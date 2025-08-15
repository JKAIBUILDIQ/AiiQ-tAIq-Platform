from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import asyncio
import json
import time
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv

from .models import Candle, OptionQuote, Position, RiskLimit
from .deribit_client import DeribitClient
from .risk_engine import RiskEngine
from pydantic import BaseModel
import uuid
from .storage import ensure_dirs, save_strategy, load_strategy, load_candles
from .backfill import backfill_historical_data
from .polygon_client import get_most_active as polygon_get_most_active
from .marketdata_client import get_nbbo_for_contracts, get_chain as md_get_chain, get_expirations as md_get_expirations, lookup_options as md_lookup
from .pait import PaitLogger
import httpx

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AiiQ_tAIq Orchestrator",
    description="Professional options and crypto trading platform orchestrator",
    version="0.1.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
deribit_client = DeribitClient()
risk_engine = RiskEngine()
pait_logger = PaitLogger()

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.solana_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket, connection_type: str = "client"):
        await websocket.accept()
        if connection_type == "solana":
            self.solana_connections.append(websocket)
        else:
            self.active_connections.append(websocket)
        
        pait_logger.emit("websocket_connect", {
            "connection_type": connection_type,
            "total_connections": len(self.active_connections) + len(self.solana_connections)
        })

    def disconnect(self, websocket: WebSocket, connection_type: str = "client"):
        if connection_type == "solana":
            if websocket in self.solana_connections:
                self.solana_connections.remove(websocket)
        else:
            if websocket in self.active_connections:
                self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str, connection_type: str = "client"):
        connections = self.solana_connections if connection_type == "solana" else self.active_connections
        for connection in connections:
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    try:
        # Allow disabling external Deribit connection in dev via env
        disable_deribit = os.getenv("DISABLE_DERIBIT", "0") in ("1", "true", "True")
        ensure_dirs()
        if not disable_deribit:
            await deribit_client.connect()
        pait_logger.emit("service_startup", {"status": "success", "service": "orchestrator", "deribit_connected": not disable_deribit})
    except Exception as e:
        pait_logger.emit("service_startup", {"status": "error", "service": "orchestrator", "error": str(e)})

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    await deribit_client.disconnect()
    pait_logger.emit("service_shutdown", {"status": "success", "service": "orchestrator"})

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    uptime = time.time() - app.start_time if hasattr(app, 'start_time') else 0
    return {
        "ok": True,
        "uptime_s": int(uptime),
        "timestamp": datetime.utcnow().isoformat(),
        "service": "aiiq-orchestrator"
    }

# ──────────────────────────────────────────────────────────────────────────────
# Strategy storage and backtesting APIs
# ──────────────────────────────────────────────────────────────────────────────

class StrategyIn(BaseModel):
    name: str
    legs: List[str]
    expectedReturn: Optional[str] = None
    riskSummary: Optional[str] = None


class StrategySaveResponse(BaseModel):
    id: str


@app.post("/assistants/strategy", response_model=StrategySaveResponse)
async def save_strategy_api(strategy: StrategyIn):
    try:
        sid = save_strategy(strategy.dict())
        return {"id": sid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class BackfillRequest(BaseModel):
    symbols: List[str] = ["BTC"]
    timeframe: str = "1d"
    days: int = 730


@app.post("/backfill")
async def backfill_api(req: BackfillRequest):
    try:
        result = await backfill_historical_data(req.symbols, req.timeframe, req.days)
        return {"status": "ok", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def run_naive_backtest(closes: List[float]) -> Dict[str, Any]:
    if len(closes) < 2:
        return {"pnl": 0, "returns": [], "maxDrawdown": 0, "sharpe": 0}
    rets: List[float] = []
    for i in range(1, len(closes)):
        r = (closes[i] - closes[i - 1]) / (closes[i - 1] or 1)
        # Delta-neutral scaling: assume 0.15 exposure
        rets.append(r * 0.15)
    equity = 1.0
    peak = 1.0
    mdd = 0.0
    series: List[float] = []
    for r in rets:
        equity *= (1 + r)
        peak = max(peak, equity)
        mdd = max(mdd, (peak - equity) / peak)
        series.append(equity)
    pnl = equity - 1.0
    avg = sum(rets) / len(rets)
    var = sum((x - avg) ** 2 for x in rets) / max(1, (len(rets) - 1))
    vol = var ** 0.5
    sharpe = (avg / vol * (252 ** 0.5)) if vol > 0 else 0
    return {"pnl": pnl, "equity": series, "returns": rets, "maxDrawdown": mdd, "sharpe": sharpe}


@app.get("/backtest")
async def backtest_api(strategyId: str, symbol: str = "BTC", timeframe: str = "1d"):
    try:
        record = load_strategy(strategyId)
        chain = load_candles(symbol, timeframe)
        if not chain:
            # Try auto-backfill minimal data
            await backfill_historical_data([symbol], timeframe, 730)
            chain = load_candles(symbol, timeframe)
        closes = [c["c"] for c in chain["candles"]]
        result = run_naive_backtest(closes)
        return {"strategyId": strategyId, "symbol": symbol, "timeframe": timeframe, "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/test/deribit")
async def test_deribit():
    """Test Deribit connectivity and get basic info."""
    try:
        # Test basic connectivity
        test_result = await deribit_client.test_connection()
        
        # Get a few BTC instruments as sample
        btc_instruments = await deribit_client.get_instruments("BTC")
        btc_count = len(btc_instruments) if btc_instruments else 0
        
        # Get a few ETH instruments as sample
        eth_instruments = await deribit_client.get_instruments("ETH")
        eth_count = len(eth_instruments) if eth_instruments else 0
        
        return {
            "status": "ok",
            "deribit_connected": test_result,
            "btc_instruments_count": btc_count,
            "eth_instruments_count": eth_count,
            "sample_btc": btc_instruments[:3] if btc_instruments else [],
            "sample_eth": eth_instruments[:3] if eth_instruments else []
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "deribit_connected": False
        }


@app.get("/crypto/options/most-active")
async def crypto_options_most_active(limit: int = 100):
    """Get most active crypto options from Deribit."""
    try:
        # Get BTC and ETH options from Deribit
        crypto_symbols = ["BTC", "ETH"]
        all_options = []
        
        for symbol in crypto_symbols:
            try:
                # Get instruments from Deribit
                instruments = await deribit_client.get_instruments(symbol)
                if instruments:
                    # Take top instruments by volume (if available) or just take first N
                    top_instruments = instruments[:50]  # Limit per symbol
                    all_options.extend(top_instruments)
                    
            except Exception as e:
                print(f"Error getting {symbol} options: {e}")
                continue
        
        # Format the data similar to the US options structure
        rows = []
        for option in all_options[:limit]:
            rows.append({
                "underlying": option.get("underlying_index", ""),
                "contract": option.get("instrument_name", ""),
                "strike": option.get("strike", None),
                "type": "call" if option.get("option_type") == "call" else "put",
                "bid": None,  # Deribit doesn't provide bid/ask in instrument list
                "ask": None,
                "last": None,
                "volume": option.get("volume_24h", 0),
                "openInterest": option.get("open_interest", 0),
                "expiration": option.get("expiration_timestamp", 0),
                "source": "deribit"
            })
        
        # Sort by volume (descending)
        rows.sort(key=lambda r: r.get("volume") or 0, reverse=True)
        
        return {
            "provider": "deribit", 
            "limit": limit, 
            "count": len(rows), 
            "results": rows, 
            "error": None
        }
        
    except Exception as e:
        print(f"Error in crypto options endpoint: {e}")
        return {
            "provider": "deribit", 
            "limit": limit, 
            "count": 0, 
            "results": [], 
            "error": str(e)
        }


@app.get("/us/options/most-active")
async def us_options_most_active(provider: str = "marketdata", symbols: Optional[str] = None, limit: int = 100):
    """Top options by volume across a symbol list using MarketData."""
    try:
        symbol_list = [s.strip().upper() for s in (symbols.split(",") if symbols else []) if s.strip()]
        if not symbol_list:
            symbol_list = ["SPY", "QQQ", "AAPL", "MSFT", "NVDA", "TSLA"]

        print(f"DEBUG: Processing symbols: {symbol_list}")  # Debug log

        # 1) gather contracts per symbol (cap per symbol to keep calls reasonable)
        contract_to_underlying: dict[str, str] = {}
        contracts: list[str] = []
        for sym in symbol_list:
            print(f"DEBUG: Getting chain for {sym}")  # Debug log
            chain, err = await md_get_chain(sym)
            print(f"DEBUG: {sym} chain result: {len(chain)} contracts, error: {err}")  # Debug log
            take = chain[:300]
            for ct in take:
                contract_to_underlying[ct] = sym
            contracts.extend(take)
            # Add delay between symbols to avoid rate limiting
            if sym != symbol_list[-1]:  # Don't delay after the last symbol
                await asyncio.sleep(1.0)

        print(f"DEBUG: Total contracts gathered: {len(contracts)}")  # Debug log

        # 2) fetch quotes (bid/ask/last/volume/openInterest)
        print(f"DEBUG: Fetching quotes for {len(contracts)} contracts")  # Debug log
        quotes, err = await get_nbbo_for_contracts(contracts)
        print(f"DEBUG: Quotes result: {len(quotes)} quotes, error: {err}")  # Debug log

        # 3) normalize rows
        rows: list[dict[str, Any]] = []
        for ct, q in quotes.items():
            rows.append({
                "underlying": contract_to_underlying.get(ct, ""),
                "contract": ct,
                "strike": None,     # optional: parse from ct if needed
                "type": None,       # optional: parse from ct if needed
                "bid": q.get("bid"),
                "ask": q.get("ask"),
                "last": q.get("last"),
                "volume": q.get("volume") or 0,
                "openInterest": q.get("openInterest") or 0,
            })

        rows.sort(key=lambda r: r.get("volume") or 0, reverse=True)
        rows = rows[:limit]
        print(f"DEBUG: Final result: {len(rows)} rows")  # Debug log
        return {"provider": "marketdata", "limit": limit, "count": len(rows), "results": rows, "error": err}
    except Exception as e:
        print(f"DEBUG: Exception in most-active: {e}")  # Debug log
        return {"provider": "marketdata", "limit": limit, "count": 0, "results": [], "error": str(e)}


@app.get("/us/options/nbbo")
async def us_options_nbbo(provider: str = "marketdata", contracts: Optional[str] = None):
    """Return NBBO-like quotes for a list of option contracts."""
    try:
        if provider != "marketdata":
            return {"provider": provider, "quotes": {}, "error": "unsupported provider"}
        symbols = [s.strip() for s in (contracts.split(",") if contracts else []) if s.strip()]
        quotes, err = await get_nbbo_for_contracts(symbols)
        return {"provider": provider, "count": len(quotes), "quotes": quotes, "error": err}
    except Exception as e:
        return {"provider": provider, "count": 0, "quotes": {}, "error": str(e)}


@app.get("/us/options/chain")
async def us_options_chain(underlying: str):
    """Get options chain (contract symbols) for an underlying from MarketData."""
    try:
        chain, err = await md_get_chain(underlying)
        return {"underlying": underlying, "contracts": chain, "error": err}
    except Exception as e:
        return {"underlying": underlying, "contracts": [], "error": str(e)}




@app.get("/symbols")
async def get_symbols():
    """Get list of supported underlyings"""
    try:
        symbols = await deribit_client.get_instruments()
        pait_logger.emit("symbols_request", {"count": len(symbols)})
        return {"symbols": symbols}
    except Exception as e:
        pait_logger.emit("symbols_request", {"error": str(e)})
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/chart/{symbol}")
async def get_chart_data(symbol: str, tf: str = "1h"):
    """Get OHLCV chart data for a symbol"""
    try:
        # Validate timeframe
        valid_timeframes = ["1m", "5m", "15m", "1h", "4h", "1d"]
        if tf not in valid_timeframes:
            raise HTTPException(status_code=400, detail=f"Invalid timeframe. Must be one of: {valid_timeframes}")
        
        try:
            candles = await deribit_client.get_candles(symbol, tf)
        except Exception:
            candles = []
        pait_logger.emit("chart_request", {"symbol": symbol, "timeframe": tf, "candles_count": len(candles)})
        return {"symbol": symbol, "timeframe": tf, "candles": candles}
    except Exception as e:
        pait_logger.emit("chart_request", {"error": str(e), "symbol": symbol, "timeframe": tf})
        return {"symbol": symbol, "timeframe": tf, "candles": []}

@app.get("/options/chain")
async def get_options_chain(underlying: str, exp: Optional[str] = None):
    """Get options chain for an underlying"""
    try:
        try:
            chain = await deribit_client.get_options_chain(underlying, exp)
        except Exception:
            chain = []
        pait_logger.emit("options_chain_request", {
            "underlying": underlying, 
            "expiry": exp, 
            "options_count": len(chain)
        })
        return {"underlying": underlying, "expiry": exp, "chain": chain}
    except Exception as e:
        pait_logger.emit("options_chain_request", {"error": str(e), "underlying": underlying})
        # return n/a instead of propagating mock error
        return {"underlying": underlying, "expiry": exp, "chain": []}

@app.websocket("/ws/stream")
async def websocket_endpoint(websocket: WebSocket, symbol: str = "BTC"):
    """WebSocket endpoint for real-time market data streaming"""
    await manager.connect(websocket)
    try:
        # Subscribe to symbol updates
        await deribit_client.subscribe_symbol(websocket, symbol)
        
        while True:
            # Send market data updates
            data = await deribit_client.get_market_data(symbol)
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(1)  # Update every second
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        pait_logger.emit("websocket_error", {"error": str(e), "symbol": symbol})
        manager.disconnect(websocket)

@app.websocket("/ingest/solana")
async def solana_ingest(websocket: WebSocket):
    """WebSocket endpoint for Solana adapter to push on-chain events"""
    await manager.connect(websocket, "solana")
    try:
        while True:
            # Receive Solana market updates
            data = await websocket.receive_text()
            solana_data = json.loads(data)
            
            # Process and broadcast to clients
            processed_data = {
                "type": "solana_market_update",
                "data": solana_data,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            await manager.broadcast(json.dumps(processed_data))
            pait_logger.emit("solana_ingest", {"data_type": solana_data.get("type"), "underlying": solana_data.get("underlying")})
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, "solana")
    except Exception as e:
        pait_logger.emit("solana_ingest_error", {"error": str(e)})
        manager.disconnect(websocket, "solana")

@app.post("/paper/order")
async def place_paper_order(order: Dict[str, Any]):
    """Place a paper trading order"""
    try:
        # Validate order
        required_fields = ["side", "instrument", "qty"]
        for field in required_fields:
            if field not in order:
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        # Execute in paper trading engine
        result = await risk_engine.execute_paper_order(order)
        
        pait_logger.emit("paper_order", {
            "order": order,
            "result": result,
            "status": "success"
        })
        
        return {"status": "success", "order_id": result["order_id"], "fills": result["fills"]}
        
    except Exception as e:
        pait_logger.emit("paper_order", {
            "order": order,
            "error": str(e),
            "status": "error"
        })
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/paper/portfolio")
async def get_paper_portfolio():
    """Get paper trading portfolio"""
    try:
        portfolio = await risk_engine.get_paper_portfolio()
        pait_logger.emit("portfolio_request", {"status": "success"})
        return portfolio
    except Exception as e:
        pait_logger.emit("portfolio_request", {"error": str(e)})
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/risk/limit")
async def set_risk_limit(risk_limit: RiskLimit):
    """Set user risk limit"""
    try:
        # Store risk limit
        await risk_engine.set_risk_limit(risk_limit)
        
        # Forward to Claudia API if available
        try:
            await pait_logger.forward_to_claudia("/api/claudia/risk_limit", risk_limit.dict())
        except:
            pass  # Claudia API not available
        
        pait_logger.emit("risk_limit_set", {"policy": risk_limit.policy})
        return {"status": "success", "message": "Risk limit updated"}
        
    except Exception as e:
        pait_logger.emit("risk_limit_set", {"error": str(e), "policy": risk_limit.policy})
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/pait/log")
async def log_pait_event(event: Dict[str, Any]):
    """Internal debug endpoint for pAIt logging"""
    try:
        pait_logger.emit("internal_log", event)
        
        # Forward to Claudia API if available
        try:
            await pait_logger.forward_to_claudia("/api/claudia/ping", event)
        except:
            pass  # Claudia API not available
        
        return {"status": "success", "message": "Event logged"}
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/crypto/markets")
async def crypto_markets():
    """Get available crypto markets and their status."""
    try:
        markets = [
            {
                "symbol": "BTC",
                "name": "Bitcoin",
                "type": "crypto",
                "status": "active",
                "endpoints": ["/crypto/options/btc", "/crypto/futures/btc"]
            },
            {
                "symbol": "ETH", 
                "name": "Ethereum",
                "type": "crypto",
                "status": "active",
                "endpoints": ["/crypto/options/eth", "/crypto/futures/eth"]
            },
            {
                "symbol": "SOL",
                "name": "Solana",
                "type": "crypto", 
                "status": "active",
                "endpoints": ["/crypto/options/sol", "/crypto/futures/sol"]
            }
        ]
        
        return {
            "status": "ok",
            "markets": markets,
            "count": len(markets)
        }
        
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.get("/crypto/options/{currency}")
async def crypto_options(currency: str, limit: int = 50):
    """Get crypto options for a specific currency (BTC, ETH, SOL)."""
    try:
        currency = currency.upper()
        
        # Get instruments from Deribit
        instruments = await deribit_client.get_instruments(currency)
        
        # Format as options data
        options = []
        for inst in instruments[:limit]:
            if inst.get("kind") == "option":
                options.append({
                    "underlying": inst.get("underlying_index", currency),
                    "contract": inst.get("instrument_name", ""),
                    "strike": inst.get("strike", 0),
                    "type": inst.get("option_type", "unknown"),
                    "expiration": inst.get("expiration_timestamp", 0),
                    "volume": inst.get("volume_24h", 0),
                    "openInterest": inst.get("open_interest", 0),
                    "source": "deribit"
                })
        
        # Sort by volume
        options.sort(key=lambda x: x.get("volume", 0), reverse=True)
        
        return {
            "currency": currency,
            "type": "options",
            "count": len(options),
            "data": options,
            "source": "deribit"
        }
        
    except Exception as e:
        return {
            "currency": currency,
            "type": "options", 
            "count": 0,
            "data": [],
            "error": str(e),
            "source": "deribit"
        }


@app.get("/forex/rates")
async def forex_rates(base: str = "USD"):
    """Get current forex exchange rates."""
    try:
        # Major currency pairs
        pairs = [
            {"from": "USD", "to": "EUR", "rate": 0.85, "change": 0.001},
            {"from": "USD", "to": "GBP", "rate": 0.73, "change": -0.002},
            {"from": "USD", "to": "JPY", "rate": 150.25, "change": 0.15},
            {"from": "USD", "to": "CHF", "rate": 0.88, "change": -0.001},
            {"from": "USD", "to": "CAD", "rate": 1.35, "change": 0.002},
            {"from": "EUR", "to": "GBP", "rate": 0.86, "change": -0.003},
            {"from": "EUR", "to": "JPY", "rate": 176.76, "change": 0.18},
            {"from": "GBP", "to": "JPY", "rate": 205.82, "change": 0.21}
        ]
        
        # Filter by base currency if specified
        if base != "ALL":
            pairs = [p for p in pairs if p["from"] == base or p["to"] == base]
        
        return {
            "status": "ok",
            "base": base,
            "timestamp": "2025-01-14T22:00:00Z",
            "pairs": pairs,
            "count": len(pairs),
            "source": "mock"  # Will be replaced with real API
        }
        
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.get("/forex/markets")
async def forex_markets():
    """Get available forex markets."""
    try:
        markets = [
            {"symbol": "EUR/USD", "name": "Euro/US Dollar", "status": "active"},
            {"symbol": "GBP/USD", "name": "British Pound/US Dollar", "status": "active"},
            {"symbol": "USD/JPY", "name": "US Dollar/Japanese Yen", "status": "active"},
            {"symbol": "USD/CHF", "name": "US Dollar/Swiss Franc", "status": "active"},
            {"symbol": "USD/CAD", "name": "US Dollar/Canadian Dollar", "status": "active"},
            {"symbol": "AUD/USD", "name": "Australian Dollar/US Dollar", "status": "active"},
            {"symbol": "NZD/USD", "name": "New Zealand Dollar/US Dollar", "status": "active"}
        ]
        
        return {
            "status": "ok",
            "markets": markets,
            "count": len(markets),
            "source": "mock"
        }
        
    except Exception as e:
        return {"status": "error", "error": str(e)}


# Add Alpha Vantage API key
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "4U0QGD3MBDA5X4AK")
ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query"


@app.get("/alpha/options/chain")
async def alpha_options_chain(symbol: str):
    """Get options chain from Alpha Vantage."""
    try:
        url = f"{ALPHA_VANTAGE_BASE_URL}"
        params = {
            "function": "OPTIONS_CHAIN",
            "symbol": symbol.upper(),
            "apikey": ALPHA_VANTAGE_API_KEY
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=15.0)
            
            if response.status_code == 200:
                data = response.json()
                
                # Alpha Vantage returns options data in a specific format
                if "monthlyExpirations" in data:
                    options = []
                    for month_data in data["monthlyExpirations"]:
                        for option in month_data.get("options", {}).get("call", []):
                            options.append({
                                "underlying": symbol.upper(),
                                "contract": f"{symbol.upper()}{option.get('expirationDate', '')}C{option.get('strikePrice', '')}",
                                "strike": float(option.get('strikePrice', 0)),
                                "type": "call",
                                "expiration": option.get('expirationDate', ''),
                                "bid": float(option.get('bid', 0)),
                                "ask": float(option.get('ask', 0)),
                                "last": float(option.get('lastPrice', 0)),
                                "volume": int(option.get('volume', 0)),
                                "openInterest": int(option.get('openInterest', 0)),
                                "source": "alpha_vantage"
                            })
                        
                        for option in month_data.get("options", {}).get("put", []):
                            options.append({
                                "underlying": symbol.upper(),
                                "contract": f"{symbol.upper()}{option.get('expirationDate', '')}P{option.get('strikePrice', '')}",
                                "strike": float(option.get('strikePrice', 0)),
                                "type": "put",
                                "expiration": option.get('expirationDate', ''),
                                "bid": float(option.get('bid', 0)),
                                "ask": float(option.get('ask', 0)),
                                "last": float(option.get('lastPrice', 0)),
                                "volume": int(option.get('volume', 0)),
                                "openInterest": int(option.get('openInterest', 0)),
                                "source": "alpha_vantage"
                            })
                    
                    return {
                        "symbol": symbol.upper(),
                        "count": len(options),
                        "options": options,
                        "source": "alpha_vantage"
                    }
                else:
                    return {
                        "symbol": symbol.upper(),
                        "count": 0,
                        "options": [],
                        "error": "No options data found",
                        "source": "alpha_vantage"
                    }
            else:
                return {
                    "symbol": symbol.upper(),
                    "count": 0,
                    "options": [],
                    "error": f"API error: {response.status_code}",
                    "source": "alpha_vantage"
                }
                
    except Exception as e:
        return {
            "symbol": symbol.upper(),
            "count": 0,
            "options": [],
            "error": str(e),
            "source": "alpha_vantage"
        }


@app.get("/alpha/forex/rates")
async def alpha_forex_rates(from_currency: str = "USD", to_currency: str = "EUR"):
    """Get forex rates from Alpha Vantage."""
    try:
        url = f"{ALPHA_VANTAGE_BASE_URL}"
        params = {
            "function": "CURRENCY_EXCHANGE_RATE",
            "from_currency": from_currency.upper(),
            "to_currency": to_currency.upper(),
            "apikey": ALPHA_VANTAGE_API_KEY
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=15.0)
            
            if response.status_code == 200:
                data = response.json()
                
                if "Realtime Currency Exchange Rate" in data:
                    rate_data = data["Realtime Currency Exchange Rate"]
                    return {
                        "from_currency": from_currency.upper(),
                        "to_currency": to_currency.upper(),
                        "exchange_rate": float(rate_data.get("5. Exchange Rate", 0)),
                        "last_refreshed": rate_data.get("6. Last Refreshed", ""),
                        "time_zone": rate_data.get("7. Time Zone", ""),
                        "source": "alpha_vantage"
                    }
                else:
                    return {
                        "error": "No forex data found",
                        "source": "alpha_vantage"
                    }
            else:
                return {
                    "error": f"API error: {response.status_code}",
                    "source": "alpha_vantage"
                }
                
    except Exception as e:
        return {
            "error": str(e),
            "source": "alpha_vantage"
        }


@app.get("/alpha/quote/{symbol}")
async def alpha_quote(symbol: str):
    """Get real-time quote from Alpha Vantage Premium."""
    try:
        url = f"{ALPHA_VANTAGE_BASE_URL}"
        params = {
            "function": "GLOBAL_QUOTE",
            "symbol": symbol.upper(),
            "apikey": ALPHA_VANTAGE_API_KEY
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=15.0)
            
            if response.status_code == 200:
                data = response.json()
                
                if "Global Quote" in data:
                    quote = data["Global Quote"]
                    return {
                        "symbol": symbol.upper(),
                        "price": float(quote.get("05. price", 0)),
                        "change": float(quote.get("09. change", 0)),
                        "change_percent": quote.get("10. change percent", "0%"),
                        "volume": int(quote.get("06. volume", 0)),
                        "high": float(quote.get("03. high", 0)),
                        "low": float(quote.get("04. low", 0)),
                        "open": float(quote.get("02. open", 0)),
                        "previous_close": float(quote.get("08. previous close", 0)),
                        "last_refreshed": quote.get("07. latest trading day", ""),
                        "source": "alpha_vantage_premium"
                    }
                else:
                    return {
                        "symbol": symbol.upper(),
                        "error": "No quote data found",
                        "source": "alpha_vantage_premium"
                    }
            else:
                return {
                    "symbol": symbol.upper(),
                    "error": f"API error: {response.status_code}",
                    "source": "alpha_vantage_premium"
                }
                
    except Exception as e:
        return {
            "symbol": symbol.upper(),
            "error": str(e),
            "source": "alpha_vantage_premium"
        }


@app.get("/alpha/technical/{symbol}")
async def alpha_technical(symbol: str, function: str = "RSI", interval: str = "daily", time_period: int = 14):
    """Get technical indicators from Alpha Vantage Premium."""
    try:
        url = f"{ALPHA_VANTAGE_BASE_URL}"
        params = {
            "function": function.upper(),
            "symbol": symbol.upper(),
            "interval": interval,
            "time_period": time_period,
            "series_type": "close",
            "apikey": ALPHA_VANTAGE_API_KEY
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=15.0)
            
            if response.status_code == 200:
                data = response.json()
                
                if "Technical Analysis: RSI" in data:
                    tech_data = data["Technical Analysis: RSI"]
                    # Convert to list format for easier processing
                    indicators = []
                    for date, values in tech_data.items():
                        indicators.append({
                            "date": date,
                            "value": float(values.get("RSI", 0))
                        })
                    
                    return {
                        "symbol": symbol.upper(),
                        "indicator": function.upper(),
                        "interval": interval,
                        "time_period": time_period,
                        "data": indicators,
                        "source": "alpha_vantage_premium"
                    }
                else:
                    return {
                        "symbol": symbol.upper(),
                        "indicator": function.upper(),
                        "error": "No technical data found",
                        "source": "alpha_vantage_premium"
                    }
            else:
                return {
                    "symbol": symbol.upper(),
                    "indicator": function.upper(),
                    "error": f"API error: {response.status_code}",
                    "source": "alpha_vantage_premium"
                }
                
    except Exception as e:
        return {
            "symbol": symbol.upper(),
            "indicator": function.upper(),
            "error": str(e),
            "source": "alpha_vantage_premium"
        }


@app.get("/alpha/intraday/{symbol}")
async def alpha_intraday(symbol: str, interval: str = "5min", outputsize: str = "compact"):
    """Get real-time intraday data from Alpha Vantage Premium."""
    try:
        url = f"{ALPHA_VANTAGE_BASE_URL}"
        params = {
            "function": "TIME_SERIES_INTRADAY",
            "symbol": symbol.upper(),
            "interval": interval,
            "outputsize": outputsize,
            "extended_hours": "true",
            "apikey": ALPHA_VANTAGE_API_KEY
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=15.0)
            
            if response.status_code == 200:
                data = response.json()
                
                if f"Time Series ({interval})" in data:
                    time_series = data[f"Time Series ({interval})"]
                    # Convert to list format for easier processing
                    intraday_data = []
                    for timestamp, values in time_series.items():
                        intraday_data.append({
                            "timestamp": timestamp,
                            "open": float(values.get("1. open", 0)),
                            "high": float(values.get("2. high", 0)),
                            "low": float(values.get("3. low", 0)),
                            "close": float(values.get("4. close", 0)),
                            "volume": int(values.get("5. volume", 0))
                        })
                    
                    # Sort by timestamp (newest first)
                    intraday_data.sort(key=lambda x: x["timestamp"], reverse=True)
                    
                    return {
                        "symbol": symbol.upper(),
                        "interval": interval,
                        "count": len(intraday_data),
                        "data": intraday_data[:100],  # Limit to 100 most recent points
                        "meta": {
                            "last_refreshed": data.get("Meta Data", {}).get("3. Last Refreshed", ""),
                            "timezone": data.get("Meta Data", {}).get("6. Time Zone", ""),
                            "extended_hours": True
                        },
                        "source": "alpha_vantage_premium_realtime"
                    }
                else:
                    return {
                        "symbol": symbol.upper(),
                        "interval": interval,
                        "error": "No intraday data found",
                        "source": "alpha_vantage_premium_realtime"
                    }
            else:
                return {
                    "symbol": symbol.upper(),
                    "interval": interval,
                    "error": f"API error: {response.status_code}",
                    "source": "alpha_vantage_premium_realtime"
                }
                
    except Exception as e:
        return {
            "symbol": symbol.upper(),
            "interval": interval,
            "error": str(e),
            "source": "alpha_vantage_premium_realtime"
        }


@app.get("/alpha/vwap/{symbol}")
async def alpha_vwap(symbol: str, interval: str = "5min"):
    """Get VWAP (Volume Weighted Average Price) from Alpha Vantage Premium."""
    try:
        url = f"{ALPHA_VANTAGE_BASE_URL}"
        params = {
            "function": "VWAP",
            "symbol": symbol.upper(),
            "interval": interval,
            "apikey": ALPHA_VANTAGE_API_KEY
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=15.0)
            
            if response.status_code == 200:
                data = response.json()
                
                if "Technical Analysis: VWAP" in data:
                    vwap_data = data["Technical Analysis: VWAP"]
                    # Convert to list format
                    vwap_points = []
                    for timestamp, values in vwap_data.items():
                        vwap_points.append({
                            "timestamp": timestamp,
                            "vwap": float(values.get("VWAP", 0))
                        })
                    
                    # Sort by timestamp (newest first)
                    vwap_points.sort(key=lambda x: x["timestamp"], reverse=True)
                    
                    return {
                        "symbol": symbol.upper(),
                        "interval": interval,
                        "count": len(vwap_points),
                        "data": vwap_points[:50],  # Limit to 50 most recent points
                        "source": "alpha_vantage_premium_realtime"
                    }
                else:
                    return {
                        "symbol": symbol.upper(),
                        "interval": interval,
                        "error": "No VWAP data found",
                        "source": "alpha_vantage_premium_realtime"
                    }
            else:
                return {
                    "symbol": symbol.upper(),
                    "interval": interval,
                    "error": f"API error: {response.status_code}",
                    "source": "alpha_vantage_premium_realtime"
                }
                
    except Exception as e:
        return {
            "symbol": symbol.upper(),
            "interval": interval,
            "error": str(e),
            "source": "alpha_vantage_premium_realtime"
        }


if __name__ == "__main__":
    app.start_time = time.time()
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8080)),
        reload=True
    )

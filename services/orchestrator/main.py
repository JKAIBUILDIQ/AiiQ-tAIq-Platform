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

from models import Candle, OptionQuote, Position, RiskLimit
from deribit_client import DeribitClient
from risk_engine import RiskEngine
from pait import PaitLogger

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
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
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
        
        candles = await deribit_client.get_candles(symbol, tf)
        pait_logger.emit("chart_request", {"symbol": symbol, "timeframe": tf, "candles_count": len(candles)})
        return {"symbol": symbol, "timeframe": tf, "candles": candles}
    except Exception as e:
        pait_logger.emit("chart_request", {"error": str(e), "symbol": symbol, "timeframe": tf})
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/options/chain")
async def get_options_chain(underlying: str, exp: Optional[str] = None):
    """Get options chain for an underlying"""
    try:
        chain = await deribit_client.get_options_chain(underlying, exp)
        pait_logger.emit("options_chain_request", {
            "underlying": underlying, 
            "expiry": exp, 
            "options_count": len(chain)
        })
        return {"underlying": underlying, "expiry": exp, "chain": chain}
    except Exception as e:
        pait_logger.emit("options_chain_request", {"error": str(e), "underlying": underlying})
        raise HTTPException(status_code=500, detail=str(e))

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

if __name__ == "__main__":
    app.start_time = time.time()
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8080)),
        reload=True
    )

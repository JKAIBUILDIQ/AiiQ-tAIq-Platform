import asyncio
import json
import websockets
import httpx
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import ssl

from .models import Candle, OptionQuote, MarketData

load_dotenv()

class DeribitClient:
    """Deribit API client for WebSocket and REST"""
    
    def __init__(self):
        self.ws_url = os.getenv("DERIBIT_BASE_URL", "wss://www.deribit.com/ws/api/v2")
        self.rest_url = "https://www.deribit.com/api/v2"
        self.ws_connection = None
        self.subscriptions = {}
        self.client_id = 0
        # SSL verification toggle for environments with custom/intercepting certs
        verify_env = os.getenv("DERIBIT_VERIFY_SSL", "1").lower()
        self.verify_ssl = verify_env not in ("0", "false", "no")
        
    async def connect(self):
        """Connect to Deribit WebSocket"""
        try:
            if self.verify_ssl:
                self.ws_connection = await websockets.connect(self.ws_url)
            else:
                ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
                ctx.check_hostname = False
                ctx.verify_mode = ssl.CERT_NONE
                self.ws_connection = await websockets.connect(self.ws_url, ssl=ctx)
            await self._authenticate()
            print("Connected to Deribit WebSocket")
        except Exception as e:
            print(f"Failed to connect to Deribit: {e}")
            raise
    
    async def disconnect(self):
        """Disconnect from Deribit WebSocket"""
        if self.ws_connection:
            await self.ws_connection.close()
            self.ws_connection = None
    
    async def _authenticate(self):
        """Authenticate with Deribit (public API for now)"""
        # For public data, no authentication needed
        pass
    
    def _get_next_id(self) -> int:
        """Get next request ID"""
        self.client_id += 1
        return self.client_id
    
    async def _send_request(self, method: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Send WebSocket request to Deribit"""
        if not self.ws_connection:
            raise Exception("WebSocket not connected")
        
        request = {
            "jsonrpc": "2.0",
            "id": self._get_next_id(),
            "method": method,
            "params": params or {}
        }
        
        await self.ws_connection.send(json.dumps(request))
        response = await self.ws_connection.recv()
        return json.loads(response)
    
    async def test_connection(self) -> bool:
        """Test if Deribit API is accessible"""
        try:
            # Try to get server time as a simple connectivity test
            response = await self._send_request("public/test")
            return "result" in response
        except Exception as e:
            print(f"Deribit connection test failed: {e}")
            return False

    async def get_instruments(self, currency: str = "BTC") -> List[Dict[str, Any]]:
        """Get list of available instruments for a currency"""
        try:
            response = await self._send_request("public/get_instruments", {
                "currency": currency.upper(),
                "expired": False,
                "kind": "option"
            })
            
            if "result" in response:
                instruments = response["result"]
                # Return full instrument objects instead of just names
                return instruments[:100]  # Return first 100 for demo
            else:
                # Return mock data if API fails
                return [
                    {
                        "instrument_name": f"{currency}-26JAN24-45000-C",
                        "underlying_index": currency,
                        "strike": 45000,
                        "option_type": "call",
                        "expiration_timestamp": 1706313600000,
                        "volume_24h": 150,
                        "open_interest": 1250
                    },
                    {
                        "instrument_name": f"{currency}-26JAN24-45000-P",
                        "underlying_index": currency,
                        "strike": 45000,
                        "option_type": "put",
                        "expiration_timestamp": 1706313600000,
                        "volume_24h": 200,
                        "open_interest": 1800
                    }
                ]
                
        except Exception as e:
            print(f"Error getting {currency} instruments: {e}")
            # Return mock data
            return [
                {
                    "instrument_name": f"{currency}-26JAN24-45000-C",
                    "underlying_index": currency,
                    "strike": 45000,
                    "option_type": "call",
                    "expiration_timestamp": 1706313600000,
                    "volume_24h": 150,
                    "open_interest": 1250
                },
                {
                    "instrument_name": f"{currency}-26JAN24-45000-P",
                    "underlying_index": currency,
                    "strike": 45000,
                    "option_type": "put",
                    "expiration_timestamp": 1706313600000,
                    "volume_24h": 200,
                    "open_interest": 1800
                }
            ]
    
    async def get_candles(self, symbol: str, timeframe: str = "1h", count: int = 100) -> List[Candle]:
        """Get OHLCV candles for a symbol"""
        try:
            # Convert timeframe to Deribit format
            tf_map = {
                "1m": "1",
                "5m": "5", 
                "15m": "15",
                "1h": "60",
                "4h": "240",
                "1d": "1D"
            }
            
            deribit_tf = tf_map.get(timeframe, "60")
            
            response = await self._send_request("public/get_tradingview_chart_data", {
                "instrument_name": symbol,
                "resolution": deribit_tf,
                "count": count
            })
            
            if "result" in response:
                result = response["result"]
                candles = []
                
                for i in range(len(result["t"])):
                    candle = Candle(
                        t=result["t"][i],
                        o=result["o"][i],
                        h=result["h"][i],
                        l=result["l"][i],
                        c=result["c"][i],
                        v=result["v"][i]
                    )
                    candles.append(candle)
                
                return candles
            else:
                # Return mock data
                return self._generate_mock_candles(symbol, timeframe, count)
                
        except Exception as e:
            print(f"Error getting candles: {e}")
            return self._generate_mock_candles(symbol, timeframe, count)
    
    async def get_options_chain(self, underlying: str, expiry: Optional[str] = None) -> List[OptionQuote]:
        """Get options chain for an underlying"""
        try:
            # For demo, return mock data
            return self._generate_mock_options_chain(underlying, expiry)
            
        except Exception as e:
            print(f"Error getting options chain: {e}")
            return self._generate_mock_options_chain(underlying, expiry)
    
    async def subscribe_symbol(self, websocket, symbol: str):
        """Subscribe to symbol updates"""
        try:
            # Subscribe to ticker updates
            await self._send_request("public/subscribe", {
                "channels": [f"ticker.{symbol}.100ms"]
            })
            
            self.subscriptions[symbol] = websocket
            print(f"Subscribed to {symbol}")
            
        except Exception as e:
            print(f"Error subscribing to {symbol}: {e}")
    
    async def get_market_data(self, symbol: str) -> MarketData:
        """Get current market data for a symbol"""
        try:
            # For demo, return mock data
            return self._generate_mock_market_data(symbol)
            
        except Exception as e:
            print(f"Error getting market data: {e}")
            return self._generate_mock_market_data(symbol)
    
    def _generate_mock_candles(self, symbol: str, timeframe: str, count: int) -> List[Candle]:
        """Generate mock candle data for demo"""
        candles = []
        base_time = int(datetime.now().timestamp())
        
        # Base price for different symbols
        base_prices = {
            "BTC": 43000,
            "ETH": 2650,
            "SOL": 98
        }
        
        base_price = base_prices.get(symbol.split("-")[0], 100)
        
        for i in range(count):
            # Generate realistic price movement
            time_offset = i * self._get_timeframe_seconds(timeframe)
            timestamp = base_time - time_offset
            
            # Random walk price simulation
            if i == 0:
                price = base_price
            else:
                change = (hash(f"{symbol}{i}") % 100 - 50) / 1000  # Small random change
                price = candles[-1].c * (1 + change)
            
            # Generate OHLCV
            volatility = 0.02  # 2% volatility
            high = price * (1 + abs(hash(f"high{i}") % 100) / 1000 * volatility)
            low = price * (1 - abs(hash(f"low{i}") % 100) / 1000 * volatility)
            open_price = price * (1 + (hash(f"open{i}") % 100 - 50) / 1000 * volatility)
            close_price = price
            volume = abs(hash(f"vol{i}") % 1000) + 100
            
            candle = Candle(
                t=timestamp,
                o=round(open_price, 2),
                h=round(high, 2),
                l=round(low, 2),
                c=round(close_price, 2),
                v=volume
            )
            candles.append(candle)
        
        return candles[::-1]  # Reverse to get chronological order
    
    def _generate_mock_options_chain(self, underlying: str, expiry: Optional[str] = None) -> List[OptionQuote]:
        """Generate mock options chain for demo"""
        if not expiry:
            expiry = "26JAN24"
        
        base_price = 43000 if underlying == "BTC" else 2650 if underlying == "ETH" else 98
        strikes = []
        
        # Generate strikes around current price
        for i in range(-5, 6):
            if underlying == "BTC":
                strike = base_price + (i * 1000)
            elif underlying == "ETH":
                strike = base_price + (i * 100)
            else:
                strike = base_price + (i * 5)
            strikes.append(strike)
        
        chain = []
        for strike in strikes:
            # Call option
            call_iv = 0.6 + (hash(f"call{strike}") % 100) / 1000
            call = OptionQuote(
                symbol=f"{underlying}-{expiry}-{int(strike)}-C",
                expiry=expiry,
                strike=strike,
                type="call",
                bid=round(max(0.01, (base_price - strike) * 0.1), 2),
                ask=round(max(0.01, (base_price - strike) * 0.1 + 0.5), 2),
                mid=round(max(0.01, (base_price - strike) * 0.1 + 0.25), 2),
                iv=round(call_iv, 3),
                delta=round(0.5 + (strike - base_price) / (base_price * 2), 3),
                gamma=round(0.001, 4),
                theta=round(-50, 1),
                vega=round(100, 1),
                rho=round(10, 1),
                underlying=underlying,
                last=round(max(0.01, (base_price - strike) * 0.1 + 0.25), 2)
            )
            chain.append(call)
            
            # Put option
            put_iv = 0.65 + (hash(f"put{strike}") % 100) / 1000
            put = OptionQuote(
                symbol=f"{underlying}-{expiry}-{int(strike)}-P",
                expiry=expiry,
                strike=strike,
                type="put",
                bid=round(max(0.01, (strike - base_price) * 0.1), 2),
                ask=round(max(0.01, (strike - base_price) * 0.1 + 0.5), 2),
                mid=round(max(0.01, (strike - base_price) * 0.1 + 0.25), 2),
                iv=round(put_iv, 3),
                delta=round(-0.5 + (strike - base_price) / (base_price * 2), 3),
                gamma=round(0.001, 4),
                theta=round(-45, 1),
                vega=round(95, 1),
                rho=round(-8, 1),
                underlying=underlying,
                last=round(max(0.01, (strike - base_price) * 0.1 + 0.25), 2)
            )
            chain.append(put)
        
        return chain
    
    def _generate_mock_market_data(self, symbol: str) -> MarketData:
        """Generate mock market data for demo"""
        base_price = 43000 if "BTC" in symbol else 2650 if "ETH" in symbol else 98
        
        # Generate realistic price movement
        change = (hash(f"{symbol}{datetime.now().hour}") % 100 - 50) / 1000
        current_price = base_price * (1 + change)
        change_amount = base_price * change
        change_percent = change
        volume = abs(hash(f"{symbol}vol") % 1000000) + 100000
        
        return MarketData(
            symbol=symbol,
            price=round(current_price, 2),
            change=round(change_amount, 2),
            change_percent=round(change_percent, 4),
            volume=volume
        )
    
    def _get_timeframe_seconds(self, timeframe: str) -> int:
        """Convert timeframe to seconds"""
        tf_map = {
            "1m": 60,
            "5m": 300,
            "15m": 900,
            "1h": 3600,
            "4h": 14400,
            "1d": 86400
        }
        return tf_map.get(timeframe, 3600)

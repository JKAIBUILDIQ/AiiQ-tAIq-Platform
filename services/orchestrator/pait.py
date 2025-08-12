import asyncio
import httpx
import json
import hashlib
import time
from typing import Dict, Any, Optional
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

class PaitLogger:
    """pAIt telemetry logger for scoring and audit"""
    
    def __init__(self):
        self.pait_log_url = os.getenv("PAIT_LOG_URL", "http://127.0.0.1:8000/api/claudia/pait/log")
        self.claudia_base_url = os.getenv("CLAUDIA_BASE_URL", "http://127.0.0.1:8000")
        self.session_id = self._generate_session_id()
        self.event_counter = 0
        
    def _generate_session_id(self) -> str:
        """Generate unique session ID"""
        timestamp = int(time.time())
        random_suffix = hashlib.md5(f"aiiq{timestamp}".encode()).hexdigest()[:8]
        return f"aiiq_{timestamp}_{random_suffix}"
    
    def emit(self, event_type: str, payload: Dict[str, Any], user_id: Optional[str] = None):
        """Emit pAIt telemetry event"""
        try:
            event = {
                "agent": "claudia",
                "component": "aiiq-orchestrator",
                "payload": payload,
                "ts": datetime.utcnow().isoformat(),
                "session_id": self.session_id,
                "user_id": user_id,
                "event_id": f"{self.session_id}_{self.event_counter:06d}",
                "event_type": event_type,
                "facts_hash": self._hash_facts(payload)
            }
            
            self.event_counter += 1
            
            # Log locally
            self._log_local(event)
            
            # Send to pAIt endpoint asynchronously
            asyncio.create_task(self._send_to_pait(event))
            
            return event
            
        except Exception as e:
            print(f"Failed to emit pAIt event: {e}")
            return None
    
    async def forward_to_claudia(self, endpoint: str, data: Dict[str, Any]) -> bool:
        """Forward data to Claudia API"""
        try:
            url = f"{self.claudia_base_url}{endpoint}"
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    url,
                    json=data,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    print(f"Successfully forwarded to Claudia: {endpoint}")
                    return True
                else:
                    print(f"Claudia API error: {response.status_code} - {response.text}")
                    return False
                    
        except Exception as e:
            print(f"Failed to forward to Claudia: {e}")
            return False
    
    async def _send_to_pait(self, event: Dict[str, Any]):
        """Send event to pAIt logging endpoint"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    self.pait_log_url,
                    json=event,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    print(f"pAIt event logged: {event['event_type']}")
                else:
                    print(f"pAIt logging error: {response.status_code} - {response.text}")
                    
        except Exception as e:
            print(f"Failed to send to pAIt: {e}")
    
    def _log_local(self, event: Dict[str, Any]):
        """Log event locally for debugging"""
        timestamp = event["ts"]
        event_type = event["event_type"]
        component = event["component"]
        
        log_entry = f"[{timestamp}] {component} - {event_type}: {json.dumps(event['payload'], indent=2)}"
        print(log_entry)
    
    def _hash_facts(self, payload: Dict[str, Any]) -> str:
        """Generate hash of facts for audit purposes"""
        try:
            # Create a deterministic string representation
            facts_str = json.dumps(payload, sort_keys=True, separators=(',', ':'))
            return hashlib.sha256(facts_str.encode()).hexdigest()[:16]
        except Exception:
            return "hash_error"
    
    def log_order_event(self, order: Dict[str, Any], result: Dict[str, Any], error: Optional[str] = None):
        """Log order-related events"""
        payload = {
            "order": order,
            "result": result,
            "error": error,
            "timestamp": datetime.utcnow().isoformat(),
            "latency_ms": result.get("latency_ms", 0) if result else 0
        }
        
        if error:
            self.emit("order_error", payload)
        else:
            self.emit("order_success", payload)
    
    def log_risk_event(self, risk_limit: Dict[str, Any], action: str):
        """Log risk management events"""
        payload = {
            "risk_limit": risk_limit,
            "action": action,
            "timestamp": datetime.utcnow().isoformat(),
            "previous_limit": None  # Could be enhanced to track changes
        }
        
        self.emit("risk_limit_change", payload)
    
    def log_strategy_event(self, strategy: Dict[str, Any], action: str, backtest_result: Optional[Dict[str, Any]] = None):
        """Log strategy builder events"""
        payload = {
            "strategy": strategy,
            "action": action,
            "backtest_result": backtest_result,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        if action == "backtest":
            self.emit("strategy_backtest", payload)
        else:
            self.emit("strategy_action", payload)
    
    def log_market_data_event(self, symbol: str, data_type: str, data_count: int):
        """Log market data events"""
        payload = {
            "symbol": symbol,
            "data_type": data_type,
            "data_count": data_count,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        self.emit("market_data", payload)
    
    def log_websocket_event(self, connection_type: str, action: str, details: Dict[str, Any] = None):
        """Log WebSocket connection events"""
        payload = {
            "connection_type": connection_type,
            "action": action,
            "details": details or {},
            "timestamp": datetime.utcnow().isoformat()
        }
        
        self.emit("websocket_event", payload)
    
    def log_solana_event(self, event_type: str, underlying: str, market_data: Dict[str, Any]):
        """Log Solana on-chain events"""
        payload = {
            "event_type": event_type,
            "underlying": underlying,
            "market_data": market_data,
            "timestamp": datetime.utcnow().isoformat(),
            "source": "solana-adapter"
        }
        
        self.emit("solana_market_update", payload)
    
    def log_performance_metric(self, metric_name: str, value: float, unit: str = ""):
        """Log performance metrics"""
        payload = {
            "metric_name": metric_name,
            "value": value,
            "unit": unit,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        self.emit("performance_metric", payload)
    
    def log_error(self, error: Exception, context: Dict[str, Any] = None):
        """Log error events"""
        payload = {
            "error_type": type(error).__name__,
            "error_message": str(error),
            "context": context or {},
            "timestamp": datetime.utcnow().isoformat(),
            "stack_trace": None  # Could be enhanced to include stack trace
        }
        
        self.emit("error", payload)
    
    def get_session_summary(self) -> Dict[str, Any]:
        """Get summary of current session"""
        return {
            "session_id": self.session_id,
            "event_count": self.event_counter,
            "start_time": self.session_id.split("_")[1] if "_" in self.session_id else "unknown",
            "current_time": datetime.utcnow().isoformat()
        }

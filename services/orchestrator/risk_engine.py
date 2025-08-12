import asyncio
import uuid
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import math
import random

from models import Position, RiskLimit, PaperOrder, PaperOrderResult, PortfolioSummary, Greeks

class RiskEngine:
    """Risk management and paper trading engine"""
    
    def __init__(self):
        self.positions: Dict[str, Position] = {}
        self.risk_limits: Dict[str, RiskLimit] = {}
        self.paper_orders: Dict[str, Dict[str, Any]] = {}
        self.cash: float = 100000.0  # Starting cash
        self.order_counter = 0
        
        # Initialize default risk limits
        self._init_default_risk_limits()
    
    def _init_default_risk_limits(self):
        """Initialize default risk limits"""
        default_limit = RiskLimit(
            policy="Max 1% per trade; VaR≤5%",
            max_position_size=10000.0,
            max_var=0.05,
            max_drawdown=0.20,
            max_leverage=2.0
        )
        self.risk_limits["default"] = default_limit
    
    async def execute_paper_order(self, order: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a paper trading order"""
        try:
            # Validate order
            if not self._validate_order(order):
                raise ValueError("Order validation failed")
            
            # Check risk limits
            if not self._check_risk_limits(order):
                raise ValueError("Order exceeds risk limits")
            
            # Generate order ID
            order_id = f"PAPER_{self.order_counter:06d}"
            self.order_counter += 1
            
            # Simulate order execution
            fills = self._simulate_fills(order)
            
            # Update positions
            self._update_positions(order, fills)
            
            # Store order
            self.paper_orders[order_id] = {
                "order": order,
                "fills": fills,
                "timestamp": datetime.utcnow(),
                "status": "filled"
            }
            
            result = {
                "order_id": order_id,
                "fills": fills,
                "total_filled": sum(fill["qty"] for fill in fills),
                "avg_fill_price": sum(fill["qty"] * fill["price"] for fill in fills) / sum(fill["qty"] for fill in fills),
                "commission": 0.0  # No commission in paper trading
            }
            
            return result
            
        except Exception as e:
            raise Exception(f"Order execution failed: {str(e)}")
    
    def _validate_order(self, order: Dict[str, Any]) -> bool:
        """Validate order parameters"""
        required_fields = ["side", "instrument", "qty"]
        for field in required_fields:
            if field not in order:
                return False
        
        if order["qty"] <= 0:
            return False
        
        if order["side"] not in ["buy", "sell"]:
            return False
        
        return True
    
    def _check_risk_limits(self, order: Dict[str, Any]) -> bool:
        """Check if order complies with risk limits"""
        try:
            # Get current risk limits
            limits = self.risk_limits.get("default")
            if not limits:
                return True  # No limits set
            
            # Check position size limit
            if limits.max_position_size:
                estimated_cost = order["qty"] * (order.get("price", 100))  # Use current price estimate
                if estimated_cost > limits.max_position_size:
                    return False
            
            # Check VaR limit
            if limits.max_var:
                current_var = self._calculate_portfolio_var()
                if current_var > limits.max_var:
                    return False
            
            return True
            
        except Exception:
            return True  # Allow order if risk check fails
    
    def _simulate_fills(self, order: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Simulate order fills with realistic pricing"""
        instrument = order["instrument"]
        qty = order["qty"]
        side = order["side"]
        
        # Generate realistic fill prices
        base_price = self._get_instrument_base_price(instrument)
        
        # Add some slippage and market impact
        slippage = random.uniform(-0.001, 0.001)  # ±0.1%
        market_impact = (qty / 1000) * 0.0001  # Small impact for large orders
        
        if side == "buy":
            fill_price = base_price * (1 + slippage + market_impact)
        else:
            fill_price = base_price * (1 + slippage - market_impact)
        
        # Simulate partial fills for large orders
        if qty > 100:
            fills = []
            remaining_qty = qty
            while remaining_qty > 0:
                fill_qty = min(remaining_qty, random.randint(10, 50))
                fill_price_adjusted = fill_price * (1 + random.uniform(-0.0005, 0.0005))
                
                fills.append({
                    "qty": fill_qty,
                    "price": round(fill_price_adjusted, 4),
                    "timestamp": datetime.utcnow().isoformat()
                })
                
                remaining_qty -= fill_qty
        else:
            fills = [{
                "qty": qty,
                "price": round(fill_price, 4),
                "timestamp": datetime.utcnow().isoformat()
            }]
        
        return fills
    
    def _update_positions(self, order: Dict[str, Any], fills: List[Dict[str, Any]]):
        """Update portfolio positions after order execution"""
        instrument = order["instrument"]
        side = order["side"]
        
        # Calculate total cost/proceeds
        total_qty = sum(fill["qty"] for fill in fills)
        total_value = sum(fill["qty"] * fill["price"] for fill in fills)
        avg_price = total_value / total_qty
        
        if side == "buy":
            # Add to position or create new
            if instrument in self.positions:
                # Update existing position
                pos = self.positions[instrument]
                new_qty = pos.qty + total_qty
                new_avg_price = (pos.qty * pos.avg_px + total_value) / new_qty
                
                pos.qty = new_qty
                pos.avg_px = new_avg_price
                pos.last_update = datetime.utcnow()
            else:
                # Create new position
                self.positions[instrument] = Position(
                    instrument=instrument,
                    qty=total_qty,
                    avg_px=avg_price,
                    entry_time=datetime.utcnow(),
                    last_update=datetime.utcnow()
                )
            
            # Deduct cash
            self.cash -= total_value
            
        else:  # sell
            if instrument in self.positions:
                pos = self.positions[instrument]
                if pos.qty >= total_qty:
                    # Update position
                    pos.qty -= total_qty
                    pos.last_update = datetime.utcnow()
                    
                    # Remove position if fully closed
                    if pos.qty == 0:
                        del self.positions[instrument]
                    
                    # Add cash
                    self.cash += total_value
                else:
                    raise ValueError("Insufficient position size for sell order")
            else:
                raise ValueError("Cannot sell instrument not in portfolio")
    
    async def get_paper_portfolio(self) -> PortfolioSummary:
        """Get current paper trading portfolio"""
        try:
            # Calculate portfolio metrics
            total_value = self.cash
            total_pnl = 0.0
            
            # Calculate current value and P&L for each position
            for instrument, position in self.positions.items():
                current_price = self._get_instrument_base_price(instrument)
                position_value = position.qty * current_price
                total_value += position_value
                
                # Calculate P&L
                position_pnl = (current_price - position.avg_px) * position.qty
                position.unrealized_pnl = position_pnl
                total_pnl += position_pnl
            
            # Calculate portfolio Greeks
            portfolio_greeks = self._calculate_portfolio_greeks()
            
            # Calculate VaR
            var = self._calculate_portfolio_var()
            
            # Calculate P&L percentage
            total_pnl_percent = (total_pnl / (total_value - total_pnl)) if (total_value - total_pnl) > 0 else 0
            
            return PortfolioSummary(
                total_value=round(total_value, 2),
                cash=round(self.cash, 2),
                positions=list(self.positions.values()),
                total_pnl=round(total_pnl, 2),
                total_pnl_percent=round(total_pnl_percent, 4),
                greeks=portfolio_greeks,
                var=round(var, 4)
            )
            
        except Exception as e:
            raise Exception(f"Failed to get portfolio: {str(e)}")
    
    async def set_risk_limit(self, risk_limit: RiskLimit):
        """Set risk limits for the portfolio"""
        try:
            risk_limit.updated_at = datetime.utcnow()
            self.risk_limits["default"] = risk_limit
        except Exception as e:
            raise Exception(f"Failed to set risk limit: {str(e)}")
    
    def _get_instrument_base_price(self, instrument: str) -> float:
        """Get base price for an instrument (mock implementation)"""
        # Mock prices for demo
        base_prices = {
            "BTC": 43000,
            "ETH": 2650,
            "SOL": 98,
            "SPY": 468,
            "QQQ": 398
        }
        
        # Extract underlying from instrument
        for underlying, price in base_prices.items():
            if underlying in instrument:
                # Add some random variation
                variation = random.uniform(-0.02, 0.02)  # ±2%
                return price * (1 + variation)
        
        return 100.0  # Default price
    
    def _calculate_portfolio_greeks(self) -> Greeks:
        """Calculate portfolio-level Greeks"""
        total_delta = 0.0
        total_gamma = 0.0
        total_theta = 0.0
        total_vega = 0.0
        total_rho = 0.0
        
        for position in self.positions.values():
            # Mock Greeks calculation (in real implementation, this would use Black-Scholes)
            if "C" in position.instrument:  # Call option
                total_delta += position.qty * 0.6
                total_gamma += position.qty * 0.001
                total_theta += position.qty * -50
                total_vega += position.qty * 100
                total_rho += position.qty * 10
            elif "P" in position.instrument:  # Put option
                total_delta += position.qty * -0.4
                total_gamma += position.qty * 0.001
                total_theta += position.qty * -45
                total_vega += position.qty * 95
                total_rho += position.qty * -8
            else:  # Stock/crypto
                total_delta += position.qty * 1.0
                total_gamma += 0.0
                total_theta += 0.0
                total_vega += 0.0
                total_rho += 0.0
        
        return Greeks(
            delta=round(total_delta, 3),
            gamma=round(total_gamma, 4),
            theta=round(total_theta, 1),
            vega=round(total_vega, 1),
            rho=round(total_rho, 1)
        )
    
    def _calculate_portfolio_var(self) -> float:
        """Calculate portfolio Value at Risk (simplified)"""
        try:
            # Simplified VaR calculation
            portfolio_value = self.cash
            for position in self.positions.values():
                current_price = self._get_instrument_base_price(position.instrument)
                portfolio_value += position.qty * current_price
            
            # Assume 2% daily volatility
            daily_volatility = 0.02
            var_95 = portfolio_value * daily_volatility * 1.645  # 95% confidence
            
            return var_95 / portfolio_value  # Return as percentage
            
        except Exception:
            return 0.05  # Default 5% VaR

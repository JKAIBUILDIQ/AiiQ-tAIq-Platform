from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class OptionType(str, Enum):
    CALL = "call"
    PUT = "put"

class OrderSide(str, Enum):
    BUY = "buy"
    SELL = "sell"

class OrderType(str, Enum):
    MARKET = "market"
    LIMIT = "limit"
    STOP = "stop"

class Candle(BaseModel):
    """OHLCV candle data"""
    t: int  # timestamp
    o: float  # open
    h: float  # high
    l: float  # low
    c: float  # close
    v: float  # volume

class OptionQuote(BaseModel):
    """Normalized options quote with Greeks"""
    symbol: str
    expiry: str
    strike: float
    type: OptionType
    bid: float
    ask: float
    mid: float
    iv: float  # implied volatility
    delta: float
    gamma: float
    theta: float
    vega: float
    rho: float
    underlying: str
    last: float
    volume: Optional[float] = None
    open_interest: Optional[float] = None

class Position(BaseModel):
    """Portfolio position"""
    instrument: str
    qty: float
    avg_px: float
    greeks: Dict[str, float] = Field(default_factory=dict)
    pnl: float = 0.0
    unrealized_pnl: float = 0.0
    realized_pnl: float = 0.0
    entry_time: Optional[datetime] = None
    last_update: Optional[datetime] = None

class RiskLimit(BaseModel):
    """Risk management limits"""
    policy: str
    max_position_size: Optional[float] = None
    max_var: Optional[float] = None  # Value at Risk
    max_drawdown: Optional[float] = None
    max_leverage: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PaperOrder(BaseModel):
    """Paper trading order"""
    side: OrderSide
    instrument: str
    qty: float
    price: Optional[float] = None
    type: OrderType = OrderType.MARKET
    time_in_force: str = "day"
    user_id: Optional[str] = None

class PaperOrderResult(BaseModel):
    """Paper trading order result"""
    order_id: str
    status: str
    fills: List[Dict[str, Any]]
    total_filled: float
    avg_fill_price: float
    commission: float = 0.0
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class MarketData(BaseModel):
    """Real-time market data"""
    symbol: str
    price: float
    change: float
    change_percent: float
    volume: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Greeks(BaseModel):
    """Options Greeks"""
    delta: float
    gamma: float
    theta: float
    vega: float
    rho: float

class PortfolioSummary(BaseModel):
    """Portfolio summary"""
    total_value: float
    cash: float
    positions: List[Position]
    total_pnl: float
    total_pnl_percent: float
    greeks: Greeks
    var: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class SolanaMarketUpdate(BaseModel):
    """Solana on-chain market update"""
    type: str
    underlying: str
    market: str
    strike: Optional[float] = None
    expiry: Optional[str] = None
    iv: Optional[float] = None
    oi: Optional[float] = None
    mark: Optional[float] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PaitEvent(BaseModel):
    """pAIt telemetry event"""
    agent: str = "claudia"
    component: str
    payload: Dict[str, Any]
    ts: datetime = Field(default_factory=datetime.utcnow)
    session_id: Optional[str] = None
    user_id: Optional[str] = None

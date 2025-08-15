from datetime import datetime, timedelta
from typing import List, Dict, Any

from .deribit_client import DeribitClient
from .storage import save_candles


async def backfill_historical_data(
    symbols: List[str],
    timeframe: str,
    days: int = 730,
) -> Dict[str, Any]:
    client = DeribitClient()
    results: Dict[str, Any] = {}

    try:
        # Try to connect; if it fails, client.get_candles has mock fallback
        try:
            await client.connect()
        except Exception:
            pass

        for sym in symbols:
            # Collect enough candles to approximate the requested days
            # get_candles returns up to count records; we call multiple times if needed
            # For simplicity, get one large batch via mock/TV endpoint
            candles = await client.get_candles(sym, timeframe=timeframe, count=days)
            save_path = save_candles(sym, timeframe, [c.__dict__ for c in candles])
            results[sym] = {
                'timeframe': timeframe,
                'count': len(candles),
                'path': save_path,
            }
    finally:
        try:
            await client.disconnect()
        except Exception:
            pass

    return results



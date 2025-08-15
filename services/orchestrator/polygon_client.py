import os
from typing import List, Dict, Any, Tuple
import httpx

POLYGON_API_KEY = os.getenv("POLYGON_API_KEY", "")
POLYGON_BASE_URL = os.getenv("POLYGON_BASE_URL", "https://api.polygon.io")

DEFAULT_UNIVERSE = ["SPY","QQQ","AAPL","MSFT","NVDA","TSLA","META","AMD","GOOGL","NFLX","JPM","BAC","XOM","INTC","MU","CRM","AVGO","GS","COIN"]

async def _fetch_page(client: httpx.AsyncClient, url: str, params: Dict[str, Any]) -> Tuple[List[Dict[str,Any]], str | None, str | None]:
    if not POLYGON_API_KEY:
        return [], None, "POLYGON_API_KEY missing"

    headers = {"Authorization": f"Bearer {POLYGON_API_KEY}", "Accept": "application/json"}
    # keep apiKey param for compatibility
    params = {**params, "apiKey": POLYGON_API_KEY}

    try:
        r = await client.get(url, params=params, headers=headers, timeout=20.0)
        if r.status_code != 200:
            return [], None, f"Polygon {r.status_code}: {await r.aread()!s}"

        data = r.json()
        results = data.get("results") or []
        next_url = data.get("next_url")
        return results, next_url, None
    except Exception as e:
        return [], None, str(e)

def _normalize(items: List[Dict[str, Any]], symbol_fallback: str) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for item in items:
        details = item.get("details") or {}
        day = item.get("day") or {}
        underlying = (details.get("underlying_asset") or {}).get("ticker") or symbol_fallback
        contract = details.get("ticker") or item.get("ticker")
        if not contract:
            continue
        out.append({
            "underlying": underlying,
            "contract": contract,
            "expiry": details.get("expiration_date"),
            "strike": details.get("strike_price"),
            "type": details.get("contract_type"),
            "last": (item.get("last_trade") or {}).get("price"),
            "bid": (item.get("last_quote") or {}).get("bid"),
            "ask": (item.get("last_quote") or {}).get("ask"),
            "volume": day.get("volume") or 0,
            "openInterest": item.get("open_interest") or day.get("open_interest") or 0,
            "provider": "polygon",
        })
    return out

async def _fetch_symbol(client: httpx.AsyncClient, symbol: str, limit: int) -> Tuple[List[Dict[str,Any]], str | None]:
    url = f"{POLYGON_BASE_URL}/v3/snapshot/options/{symbol.upper()}"
    params = {"limit": min(max(limit,1), 1000)}
    all_items: List[Dict[str, Any]] = []
    error: str | None = None

    while len(all_items) < limit and url:
        items, next_url, err = await _fetch_page(client, url, params)
        if err:
            error = err
            break
        all_items.extend(_normalize(items, symbol))
        url = next_url
        params = {}  # cursor in next_url already contains auth & paging

    return all_items[:limit], error

async def get_most_active(symbols: List[str], limit: int = 100) -> Tuple[List[Dict[str,Any]], str | None]:
    if not symbols:
        symbols = DEFAULT_UNIVERSE
    async with httpx.AsyncClient() as client:
        rows: List[Dict[str, Any]] = []
        first_error: str | None = None
        for sym in symbols:
            chunk, err = await _fetch_symbol(client, sym, limit)
            if err and not first_error:
                first_error = err
            rows.extend(chunk)
    rows.sort(key=lambda r: (r.get("volume") or 0), reverse=True)
    return rows[:limit], first_error
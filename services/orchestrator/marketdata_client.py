import os
import asyncio
from typing import List, Dict, Any, Tuple
import httpx

MARKETDATA_API_KEY = os.getenv("MARKETDATA_API_KEY", "")
MARKETDATA_BASE_URL = os.getenv("MARKETDATA_BASE_URL", "https://api.marketdata.app")


async def get_nbbo_for_contracts(contracts: List[str]) -> Tuple[Dict[str, Dict[str, Any]], str | None]:
    if not contracts:
        return {}, None
    if not MARKETDATA_API_KEY:
        return {}, "MARKETDATA_API_KEY missing"

    headers = {
        "Authorization": f"token {MARKETDATA_API_KEY}", 
        "Accept": "application/json",
        "User-Agent": "AiiQ-Orchestrator/1.0",
        "Cache-Control": "no-cache"
    }
    out: Dict[str, Dict[str, Any]] = {}
    err: str | None = None

    async with httpx.AsyncClient() as client:
        for ct in contracts[:500]:
            try:
                url = f"{MARKETDATA_BASE_URL}/v1/options/quotes/{ct}/"
                r = await client.get(url, headers=headers, timeout=10.0)
                if r.status_code != 200:
                    if not err: err = f"marketdata {r.status_code} for {ct}"
                    continue
                q = r.json() or {}
                # fields are arrays
                out[ct] = {
                    "bid": (q.get("bid") or [None])[0],
                    "ask": (q.get("ask") or [None])[0],
                    "last": (q.get("last") or [None])[0],
                    "volume": (q.get("volume") or [0])[0],
                    "openInterest": (q.get("openInterest") or [0])[0],
                }
                # Add small delay between requests to avoid rate limiting
                await asyncio.sleep(0.1)
            except Exception as e:
                if not err: err = str(e)
    return out, err


async def get_chain(underlying: str) -> Tuple[List[str], str | None]:
    """Fetch option chain list (contract symbols) for an underlying."""
    if not MARKETDATA_API_KEY:
        return [], "MARKETDATA_API_KEY missing"
    
    # Debug: show what API key we're using (first 10 chars)
    api_key_preview = MARKETDATA_API_KEY[:10] + "..." if len(MARKETDATA_API_KEY) > 10 else MARKETDATA_API_KEY
    print(f"DEBUG: Using API key: {api_key_preview}")
    
    headers = {
        "Authorization": f"token {MARKETDATA_API_KEY}", 
        "Accept": "application/json",
        "User-Agent": "AiiQ-Orchestrator/1.0",
        "Cache-Control": "no-cache"
    }
    

    
    # Use the exact endpoint that worked in our curl test
    url = f"{MARKETDATA_BASE_URL}/v1/options/chain/{underlying.upper()}/"
    
    try:
        print(f"DEBUG: Trying direct chain endpoint: {url}")
        async with httpx.AsyncClient() as client:
            r = await client.get(url, headers=headers, timeout=15.0)
            print(f"DEBUG: Direct chain endpoint status: {r.status_code}")
            
            if r.status_code == 200:
                data = r.json() or {}
                symbols = (
                    data.get("optionSymbol")
                    or data.get("optionSymbols")
                    or data.get("symbols")
                    or []
                )
                symbols = [s for s in symbols if isinstance(s, str)]
                print(f"DEBUG: Found {len(symbols)} symbols for {underlying}")
                return symbols, None
            else:
                print(f"DEBUG: Chain endpoint failed with status {r.status_code}")
                # Try to get response text for debugging
                try:
                    response_text = r.text[:200]  # First 200 chars
                    print(f"DEBUG: Response preview: {response_text}")
                except:
                    pass
                
    except Exception as e:
        print(f"DEBUG: Error with chain endpoint: {e}")
    
    # If direct approach fails, try the old fallback methods
    print(f"DEBUG: Trying fallback methods for {underlying}")
    
    # Try different endpoint formats that MarketData might use
    urls_to_try = [
        f"{MARKETDATA_BASE_URL}/v1/options/chain/{underlying.upper()}",
        f"{MARKETDATA_BASE_URL}/v1/options/{underlying.upper()}/chain/",
        f"{MARKETDATA_BASE_URL}/v1/options/{underlying.upper()}/chain"
    ]
    
    for url in urls_to_try:
        try:
            print(f"DEBUG: Trying fallback URL: {url}")
            async with httpx.AsyncClient() as client:
                r = await client.get(url, headers=headers, timeout=15.0)
                print(f"DEBUG: Fallback URL status: {r.status_code}")
                if r.status_code == 200:
                    data = r.json() or {}
                    symbols = (
                        data.get("optionSymbol")
                        or data.get("optionSymbols")
                        or data.get("symbols")
                        or []
                    )
                    symbols = [s for s in symbols if isinstance(s, str)]
                    print(f"DEBUG: Fallback found {len(symbols)} symbols for {underlying}")
                    return symbols, None
                elif r.status_code == 203:
                    print(f"DEBUG: 203 status for {url} - trying next endpoint")
                    await asyncio.sleep(1.0)
                    continue
        except Exception as e:
            print(f"DEBUG: Error with fallback {url}: {e}")
            continue
    
    # If all chain endpoints fail, try lookup as fallback
    try:
        print(f"DEBUG: Trying lookup fallback for {underlying}")
        lookup_url = f"{MARKETDATA_BASE_URL}/v1/options/lookup/{underlying.upper()}/"
        async with httpx.AsyncClient() as client:
            r = await client.get(lookup_url, headers=headers, timeout=15.0)
            print(f"DEBUG: Lookup fallback status: {r.status_code}")
            if r.status_code == 200:
                data = r.json() or {}
                symbols = (
                    data.get("optionSymbol")
                    or data.get("optionSymbols")
                    or data.get("symbols")
                    or []
                )
                symbols = [s for s in symbols if isinstance(s, str)]
                print(f"DEBUG: Lookup fallback found {len(symbols)} symbols for {underlying}")
                return symbols, None
    except Exception as e:
        print(f"DEBUG: Lookup fallback error: {e}")
    
    return [], f"marketdata chain endpoint not found for {underlying}"


async def get_expirations(underlying: str) -> Tuple[List[str], str | None]:
    """Fetch expirations for an underlying; return ISO date strings when possible."""
    if not MARKETDATA_API_KEY:
        return [], "MARKETDATA_API_KEY missing"
    headers = {
        "Authorization": f"token {MARKETDATA_API_KEY}", 
        "Accept": "application/json",
        "User-Agent": "AiiQ-Orchestrator/1.0",
        "Cache-Control": "no-cache"
    }
    url = f"{MARKETDATA_BASE_URL}/v1/options/expirations/{underlying.upper()}/"
    try:
        async with httpx.AsyncClient() as client:
            r = await client.get(url, headers=headers, timeout=15.0)
            if r.status_code != 200:
                return [], f"marketdata {r.status_code} expirations"
            data = r.json() or {}
            expirations = (
                data.get("expirations")
                or data.get("expiration")
                or data.get("dates")
                or []
            )
            out: List[str] = []
            for v in expirations:
                if isinstance(v, str):
                    out.append(v)
                elif isinstance(v, (int, float)):
                    import datetime as _dt
                    out.append(_dt.datetime.utcfromtimestamp(int(v)).date().isoformat())
            return out, None
    except Exception as e:
        return [], str(e)


async def lookup_options(query: str) -> Tuple[List[str], str | None]:
    """Lookup contract symbols by user input (strike/expiry/ticker)."""
    if not MARKETDATA_API_KEY:
        return [], "MARKETDATA_API_KEY missing"
    headers = {
        "Authorization": f"token {MARKETDATA_API_KEY}", 
        "Accept": "application/json",
        "User-Agent": "AiiQ-Orchestrator/1.0",
        "Cache-Control": "no-cache"
    }
    url = f"{MARKETDATA_BASE_URL}/v1/options/lookup/{query}/"
    try:
        async with httpx.AsyncClient() as client:
            r = await client.get(url, headers=headers, timeout=10.0)
            if r.status_code != 200:
                return [], f"marketdata {r.status_code} lookup"
            data = r.json() or {}
            symbols = (
                data.get("optionSymbol")
                or data.get("optionSymbols")
                or data.get("symbols")
                or []
            )
            symbols = [s for s in symbols if isinstance(s, str)]
            return symbols, None
    except Exception as e:
        return [], str(e)

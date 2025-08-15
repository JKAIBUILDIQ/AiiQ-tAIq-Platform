import os
import json
import uuid
from datetime import datetime
from typing import Any, Dict, Optional


REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DATA_ROOT = os.path.join(REPO_ROOT, 'data')
STRATEGIES_DIR = os.path.join(DATA_ROOT, 'strategies', 'ollama')
CHAINS_DIR = os.path.join(DATA_ROOT, 'chains')
METRICS_DIR = os.path.join(DATA_ROOT, 'metrics')
TRADES_DIR = os.path.join(DATA_ROOT, 'trades')


def ensure_dirs() -> None:
    os.makedirs(STRATEGIES_DIR, exist_ok=True)
    os.makedirs(CHAINS_DIR, exist_ok=True)
    os.makedirs(METRICS_DIR, exist_ok=True)
    os.makedirs(TRADES_DIR, exist_ok=True)


def save_json(path: str, payload: Any) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=2)


def read_json(path: str) -> Any:
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_strategy(strategy: Dict[str, Any]) -> str:
    ensure_dirs()
    strategy_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    record = {
        'id': strategy_id,
        'createdAt': now,
        'source': 'ollama',
        'strategy': strategy,
    }
    out_path = os.path.join(STRATEGIES_DIR, f'{strategy_id}.json')
    save_json(out_path, record)
    return strategy_id


def load_strategy(strategy_id: str) -> Dict[str, Any]:
    path = os.path.join(STRATEGIES_DIR, f'{strategy_id}.json')
    if not os.path.exists(path):
        raise FileNotFoundError(f'Strategy {strategy_id} not found')
    return read_json(path)


def chain_path(symbol: str, timeframe: str) -> str:
    safe_symbol = symbol.upper()
    safe_tf = timeframe
    return os.path.join(CHAINS_DIR, f'{safe_symbol}-{safe_tf}.json')


def save_candles(symbol: str, timeframe: str, candles: Any) -> str:
    ensure_dirs()
    path = chain_path(symbol, timeframe)
    payload = {'symbol': symbol, 'timeframe': timeframe, 'candles': candles}
    save_json(path, payload)
    return path


def load_candles(symbol: str, timeframe: str) -> Optional[Dict[str, Any]]:
    path = chain_path(symbol, timeframe)
    if not os.path.exists(path):
        return None
    return read_json(path)



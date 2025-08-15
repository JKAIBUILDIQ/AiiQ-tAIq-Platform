from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from ollama_client import query_ollama
import json
import os
from datetime import datetime

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..', 'data', 'strategies', 'ollama'))
os.makedirs(DATA_DIR, exist_ok=True)

router = APIRouter()

class Strategy(BaseModel):
    name: str
    legs: list[str]
    expectedReturn: str = Field(alias="expected_return", default_factory=str)
    riskSummary: str = Field(alias="risk_summary", default_factory=str)

class PromptRequest(BaseModel):
    prompt: str

class StrategyResponse(BaseModel):
    strategies: list[Strategy]

@router.post("/", response_model=StrategyResponse)
async def generate_strategy(payload: PromptRequest):
    try:
        raw = await query_ollama(payload.prompt)
        # Ollama can return either a dict with 'response' or directly 'strategies'
        text = raw.get("response") if isinstance(raw, dict) else None
        parsed = None
        if text:
            try:
                parsed = json.loads(text)
            except Exception:
                pass
        if parsed is None:
            # If model already returns dict with strategies
            parsed = raw if isinstance(raw, dict) else {"strategies": []}

        # Normalize to StrategyResponse shape
        if "strategies" not in parsed or not isinstance(parsed["strategies"], list):
            # try to coerce basic text into a single-strategy array for demo
            parsed = {"strategies": [{"name": "Strategy", "legs": [str(raw)[:120]], "expectedReturn": "—", "riskSummary": "—"}]}

        resp = StrategyResponse(strategies=[Strategy(**s) for s in parsed["strategies"]])

        # Persist to data folder
        ts = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
        out_path = os.path.join(DATA_DIR, f"strategies-{ts}.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(resp.model_dump(by_alias=True), f, indent=2)

        return resp
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

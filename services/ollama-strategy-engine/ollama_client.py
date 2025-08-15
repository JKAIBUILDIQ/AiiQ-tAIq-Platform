import aiohttp
import os

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "claudia-trader:latest")

async def query_ollama(prompt: str):
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        # If the model supports JSON mode, this will force structured output
        "format": "json",
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json=payload,
            timeout=aiohttp.ClientTimeout(total=120)
        ) as resp:
            if resp.status != 200:
                text = await resp.text()
                raise Exception(f"Ollama error: {resp.status} {text}")
            data = await resp.json()
            return data


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)
from routes.generate import router as generate_router

app = FastAPI(
    title="Ollama Strategy Engine",
    description="Generates options strategies using local Ollama MCP models.",
    version="0.1.0"
)

app.include_router(generate_router, prefix="/generate")

@app.get("/health")
async def health():
    return {"ok": True, "service": "strategy-engine"}

# Allow web app to read health/requests (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware  # ✅ Add this import
import asyncio
import httpx
from typing import Dict, List
import json

app = FastAPI(title="Ollama Bot Orchestrator for pAIt Ratings")

# ✅ Add CORS middleware to allow requests from your web app
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001", 
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... rest of your existing code stays the same ...

# Bot assignments for each category
BOT_ASSIGNMENTS = {
    "super-influencers": ["claudia-trader", "mixtral"],
    "institutional-funds": ["claudia-trader", "deepseek-coder"],
    "social-media-high": ["qwen2.5-coder", "mistral"],
    "social-media-low": ["qwen2.5-coder", "llama3"],
    "cnbc-experts": ["claudia-trader", "mixtral"],
    "options-strategies": ["deepseek-coder", "starcoder2"],
    "forex-strategies": ["claudia-trader", "qwen3"],
    "crypto-traders": ["qwen2.5-coder", "deepseek-r1"],
    "international-markets": ["mixtral", "llama3"],
    "political-influencers": ["claudia-trader", "mixtral"]
}

@app.post("/collect-data/{category}")
async def collect_category_data(category: str, background_tasks: BackgroundTasks):
    """Trigger data collection for a specific category"""
    background_tasks.add_task(run_category_collection, category)
    return {"message": f"Started data collection for {category}", "status": "running"}

async def run_category_collection(category: str):
    """Run data collection for a category using assigned bots"""
    bots = BOT_ASSIGNMENTS.get(category, ["claudia-trader"])
    
    for bot in bots:
        await collect_with_bot(bot, category)

async def collect_with_bot(bot_name: str, category: str):
    """Collect data using a specific Ollama model"""
    # This will integrate with your existing Ollama setup
    # and collect real-time data for each category
    pass

@app.get("/health")
async def health_check():
    return {"status": "healthy", "bots": list(BOT_ASSIGNMENTS.keys())}
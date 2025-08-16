#!/bin/bash

# GPU Server Cron Setup for AiiQ pAIt Data Collection
# Run this on AiiQ-core-neuralcenter (139.135.78.136)

echo "🚀 Setting up GPU-side cron schedule for AiiQ pAIt data collection..."

# Create data collection directory
mkdir -p /home/jbot/aiiq_data_collection
cd /home/jbot/aiiq_data_collection

# Create the main data collection script
cat > collect_pait_data.py << 'EOF'
#!/usr/bin/env python3
import json
import requests
from datetime import datetime
import os
import time

# GPU Models available on this server
GPU_MODELS = {
    "jbot": "http://localhost:11434/api/generate",
    "trader-max": "http://localhost:11434/api/generate", 
    "qwen2.5:72b": "http://localhost:11434/api/generate",
    "claudia-trader": "http://localhost:11434/api/generate",
    "kathy-ops": "http://localhost:11434/api/generate"
}

def query_gpu_model(model_name, prompt):
    """Query a GPU model with a prompt"""
    payload = {
        "model": model_name,
        "prompt": prompt,
        "stream": False
    }
    
    try:
        response = requests.post(GPU_MODELS[model_name], json=payload, timeout=120)
        if response.status_code == 200:
            return response.json()["response"]
        else:
            print(f"❌ Error querying {model_name}: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error connecting to {model_name}: {e}")
        return None

def collect_super_influencers():
    """Collect high-quality super influencer data using GPU models"""
    print("🤖 Collecting super influencers data...")
    
    # Try different GPU models for best results
    models_to_try = ["jbot", "trader-max", "qwen2.5:72b"]
    
    for model in models_to_try:
        try:
            prompt = f"""
            As a financial analyst, provide ONLY a JSON object with Cathy Wood's recent investment performance data:
            {{
                "portfolioHoldings": [
                    {{"symbol": "PLTR", "weight": 8.5, "value": "2.1B", "change": "+2.3%", "ytd_return": 45.2, "volatility": 28.4}},
                    {{"symbol": "TSLA", "weight": 7.2, "value": "1.8B", "change": "+1.8%", "ytd_return": 32.1, "volatility": 35.7}},
                    {{"symbol": "COIN", "weight": 4.1, "value": "980M", "change": "-0.5%", "ytd_return": 18.9, "volatility": 42.3}},
                    {{"symbol": "SQ", "weight": 3.8, "value": "920M", "change": "+1.2%", "ytd_return": 25.6, "volatility": 31.2}}
                ],
                "performance_metrics": {{
                    "portfolio_ytd_return": 28.7,
                    "sharpe_ratio": 1.85,
                    "max_drawdown": -12.4,
                    "volatility": 24.6,
                    "beta": 1.32,
                    "alpha": 8.9
                }},
                "recentMoves": [
                    {{"action": "Increased PLTR position", "date": "2025-01-15", "impact": "positive", "expected_return": 15.2}},
                    {{"action": "Reduced TSLA exposure", "date": "2025-01-12", "impact": "neutral", "risk_reduction": 8.5}},
                    {{"action": "Added AI infrastructure stocks", "date": "2025-01-10", "impact": "positive", "sector_exposure": 12.3}}
                ],
                "publicStatements": [
                    {{"statement": "AI will be the biggest investment theme of the decade", "date": "2025-01-14", "sentiment": "bullish", "market_impact": "positive"}},
                    {{"statement": "Bitcoin reaching $1M by 2030", "date": "2025-01-13", "sentiment": "very_bullish", "crypto_exposure": 15.8}},
                    {{"statement": "Disruptive innovation at discount prices", "date": "2025-01-11", "sentiment": "bullish", "valuation_metrics": "attractive"}}
                ],
                "cnbcAppearances": [
                    {{"show": "Squawk Box", "date": "2025-01-15", "key_points": ["AI revolution", "Bitcoin adoption", "Innovation stocks"], "viewership": "2.1M"}},
                    {{"show": "Mad Money", "date": "2025-01-12", "key_points": ["Market opportunities", "Tech valuations", "Crypto outlook"], "viewership": "1.8M"}}
                ]
            }}
            
            Do not include any other text, just the JSON.
            """
            
            print(f"🤖 Querying {model} for Cathy Wood data...")
            response = query_gpu_model(model, prompt)
            
            if response:
                try:
                    data = json.loads(response)
                    print(f"✅ Successfully collected data from {model}")
                    return data
                except:
                    print(f"⚠️ JSON parsing failed for {model}")
                    continue
        except Exception as e:
            print(f"⚠️ {model} failed: {e}")
            continue
    
    return None

def collect_options_strategies():
    """Collect options strategies using GPU models"""
    print("🤖 Collecting options strategies...")
    
    prompt = """
    Return ONLY a JSON object with advanced options strategies and performance metrics:
    {
        "strategies": [
            {
                "name": "Iron Condor",
                "description": "Selling out-of-the-money calls and puts with defined risk",
                "win_rate": 78.5,
                "avg_return": 12.3,
                "max_loss": -8.5,
                "complexity": "Intermediate",
                "time_decay": "High",
                "volatility_impact": "Negative",
                "best_market": "Sideways",
                "risk_reward": 1.45,
                "capital_required": "Medium",
                "examples": ["SPY Iron Condor 30 days out", "QQQ Iron Condor 45 days out"],
                "greeks": {"delta": 0.15, "gamma": 0.02, "theta": -0.08, "vega": 0.12}
            }
        ]
    }
    """
    
    # Try trader-max first (specialized for trading)
    response = query_gpu_model("trader-max", prompt)
    if response:
        try:
            return json.loads(response)
        except:
            pass
    
    # Fallback to other models
    for model in ["jbot", "qwen2.5:72b"]:
        response = query_gpu_model(model, prompt)
        if response:
            try:
                return json.loads(response)
            except:
                continue
    
    return None

def collect_forex_strategies():
    """Collect forex strategies using GPU models"""
    print("🤖 Collecting forex strategies...")
    
    prompt = """
    Return ONLY a JSON object with advanced forex strategies and performance metrics:
    {
        "strategies": [
            {
                "name": "Carry Trade",
                "description": "Borrowing in low-yield currency, investing in high-yield currency",
                "win_rate": 71.3,
                "avg_return": 15.8,
                "max_drawdown": -22.5,
                "complexity": "Intermediate",
                "interest_rate_sensitivity": "High",
                "volatility_impact": "Negative",
                "best_market": "Trending",
                "risk_reward": 1.89,
                "capital_required": "High",
                "examples": ["AUD/JPY carry trade", "NZD/JPY carry trade"],
                "currency_pairs": ["AUD/JPY", "NZD/JPY", "GBP/JPY"],
                "correlation_analysis": {"USD": -0.45, "EUR": 0.32, "JPY": 0.78}
            }
        ]
    }
    """
    
    # Try specialized models first
    for model in ["trader-max", "claudia-trader", "jbot"]:
        response = query_gpu_model(model, prompt)
        if response:
            try:
                return json.loads(response)
            except:
                continue
    
    return None

def collect_crypto_strategies():
    """Collect crypto strategies using GPU models"""
    print("🤖 Collecting crypto strategies...")
    
    prompt = """
    Return ONLY a JSON object with advanced crypto strategies and performance metrics:
    {
        "strategies": [
            {
                "name": "Grid Trading",
                "description": "Automated buying and selling at predetermined price levels",
                "win_rate": 68.9,
                "avg_return": 19.4,
                "max_drawdown": -25.1,
                "complexity": "Intermediate",
                "volatility_impact": "Positive",
                "trend_sensitivity": "Low",
                "best_market": "Sideways",
                "risk_reward": 1.78,
                "capital_required": "High",
                "examples": ["BTC Grid Trading 5% intervals", "ETH Grid Trading 3% intervals"],
                "cryptocurrencies": ["BTC", "ETH", "SOL"],
                "market_analysis": {"volatility_regime": "high", "correlation": 0.85, "liquidity": "excellent"}
            }
        ]
    }
    """
    
    # Try models good at technical analysis
    for model in ["trader-max", "jbot", "qwen2.5:72b"]:
        response = query_gpu_model(model, prompt)
        if response:
            try:
                return json.loads(response)
            except:
                continue
    
    return None

def main():
    """Main collection function"""
    print(f"🚀 Starting GPU-side data collection at {datetime.now()}")
    
    # Collect all data types
    super_influencers = collect_super_influencers()
    options_strategies = collect_options_strategies()
    forex_strategies = collect_forex_strategies()
    crypto_strategies = collect_crypto_strategies()
    
    # Create comprehensive dataset
    data = {
        "super_influencers": super_influencers,
        "options_strategies": options_strategies,
        "forex_strategies": forex_strategies,
        "crypto_strategies": crypto_strategies,
        "collected_at": datetime.now().isoformat(),
        "gpu_models_used": list(GPU_MODELS.keys()),
        "data_source": "GPU-Side Automated Collection",
        "collection_version": "3.0 - GPU Optimized"
    }
    
    # Save with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"gpu_collection_{timestamp}.json"
    
    with open(filename, "w") as f:
        json.dump(data, f, indent=2)
    
    print(f"✅ Data collection complete! Saved to {filename}")
    
    # Also save latest for easy access
    with open("latest_collection.json", "w") as f:
        json.dump(data, f, indent=2)
    
    print("✅ Latest collection saved for easy access")
    
    return data

if __name__ == "__main__":
    main()
EOF

# Make the script executable
chmod +x collect_pait_data.py

# Create cron schedule
echo "📅 Setting up cron schedule..."

# Add to crontab (runs every 4 hours)
(crontab -l 2>/dev/null; echo "0 */4 * * * cd /home/jbot/aiiq_data_collection && /usr/bin/python3 collect_pait_data.py >> collection.log 2>&1") | crontab -

# Also add specific times for different data types
(crontab -l 2>/dev/null; echo "0 6 * * * cd /home/jbot/aiiq_data_collection && /usr/bin/python3 collect_pait_data.py --type=super_influencers >> collection.log 2>&1") | crontab -
(crontab -l 2>/dev/null; echo "0 10 * * * cd /home/jbot/aiiq_data_collection && /usr/bin/python3 collect_pait_data.py --type=options >> collection.log 2>&1") | crontab -
(crontab -l 2>/dev/null; echo "0 14 * * * cd /home/jbot/aiiq_data_collection && /usr/bin/python3 collect_pait_data.py --type=forex >> collection.log 2>&1") | crontab -
(crontab -l 2>/dev/null; echo "0 18 * * * cd /home/jbot/aiiq_data_collection && /usr/bin/python3 collect_pait_data.py --type=crypto >> collection.log 2>&1") | crontab -

# Create a sync script to copy data to local system
cat > sync_to_local.sh << 'EOF'
#!/bin/bash
# Sync collected data to local AiiQ system
# Run this periodically or after each collection

LOCAL_IP="YOUR_LOCAL_IP"  # Replace with your local IP
LOCAL_PATH="/path/to/aiiq/services/ollama-strategy-engine/collected_data"

echo "🔄 Syncing GPU collection data to local system..."

# Create a compressed archive of latest data
tar -czf latest_collection.tar.gz latest_collection.json collection.log

# Copy to local system (you'll need to set up SSH keys or use scp)
scp latest_collection.tar.gz jbot@$LOCAL_IP:$LOCAL_PATH/

echo "✅ Data synced to local system"
EOF

chmod +x sync_to_local.sh

# Create a status monitoring script
cat > monitor_collections.sh << 'EOF'
#!/bin/bash
# Monitor collection status and GPU usage

echo "📊 GPU Collection Status Report"
echo "================================"

# Check cron jobs
echo "🕐 Cron Jobs:"
crontab -l | grep collect_pait_data

# Check recent collections
echo -e "\n📁 Recent Collections:"
ls -la *.json | head -5

# Check GPU usage
echo -e "\n🤖 GPU Models Status:"
for model in jbot trader-max qwen2.5:72b claudia-trader kathy-ops; do
    if curl -s http://localhost:11434/api/generate -X POST -d '{"model":"'$model'","prompt":"ping","stream":false}' > /dev/null 2>&1; then
        echo "✅ $model: Active"
    else
        echo "❌ $model: Down"
    fi
done

# Check collection log
echo -e "\n📋 Recent Log Entries:"
tail -10 collection.log
EOF

chmod +x monitor_collections.sh

echo "✅ GPU-side cron setup complete!"
echo ""
echo "📋 What was created:"
echo "  • collect_pait_data.py - Main collection script"
echo "  • sync_to_local.sh - Data sync script"
echo "  • monitor_collections.sh - Status monitoring"
echo "  • Cron jobs for automated collection"
echo ""
echo "🚀 Next steps:"
echo "  1. Test the collection script: python3 collect_pait_data.py"
echo "  2. Monitor collections: ./monitor_collections.sh"
echo "  3. Set up SSH keys for data sync"
echo "  4. Customize collection schedule as needed"
echo ""
echo "📅 Current cron schedule:"
crontab -l | grep collect_pait_data

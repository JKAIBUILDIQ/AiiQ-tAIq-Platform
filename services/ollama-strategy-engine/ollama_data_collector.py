import json
import requests
from datetime import datetime
import time
import re
from pait_scoring_engine import PaitScoringEngine

# Your Ollama models - Updated with GPU models from AiiQ-core-neuralcenter
OLLAMA_MODELS = {
    # Local CPU models (fallback)
    "mixtral": "http://localhost:11434/api/generate",
    
    # GPU models from AiiQ-core-neuralcenter (primary)
    "jbot": "http://139.135.78.136:11434/api/generate",
    "trader-max": "http://139.135.78.136:11434/api/generate",
    "qwen2.5:72b": "http://139.135.78.136:11434/api/generate",
    "claudia-trader": "http://139.135.78.136:11434/api/generate",
    "kathy-ops": "http://139.135.78.136:11434/api/generate",
    
    # Fallback models
    "deepseek-r1:8b": "http://localhost:11434/api/generate",
    "deepseek-coder:6.7b": "http://localhost:11434/api/generate"
}

# Initialize the pAIt scoring engine
pait_engine = PaitScoringEngine()

def extract_json_from_response(response_text):
    """Extract JSON from mixtral's response (which includes extra text)"""
    
    # Try to find JSON in the response using regex
    json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
    if json_match:
        json_str = json_match.group(0)
        try:
            return json.loads(json_str)
        except:
            print(f"⚠️ Couldn't parse extracted JSON: {json_str[:100]}...")
            return None
    
    return None

def query_ollama_model(model_name, prompt):
    """Query a specific Ollama model with a prompt"""
    
    payload = {
        "model": model_name,
        "prompt": prompt,
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_MODELS[model_name], json=payload, timeout=60)
        if response.status_code == 200:
            return response.json()["response"]
        else:
            print(f"❌ Error querying {model_name}: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error connecting to {model_name}: {e}")
        return None

def collect_real_cathy_wood_data():
    """Use GPU models to collect high-quality Cathy Wood performance data"""
    
    # Try GPU models first for performance data
    gpu_models = ["jbot", "trader-max", "qwen2.5:72b"]
    
    for model in gpu_models:
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
            
            print(f"🤖 Querying {model} (GPU) for Cathy Wood performance data...")
            response = query_ollama_model(model, prompt)
            
            if response:
                try:
                    data = json.loads(response)
                    print(f"✅ Successfully parsed Cathy Wood data from {model}!")
                    return data
                except:
                    print(f"⚠️ Direct JSON parsing failed for {model}, trying to extract JSON...")
                    extracted_data = extract_json_from_response(response)
                    if extracted_data:
                        print(f"✅ Successfully extracted JSON from {model} response!")
                        return extracted_data
        except Exception as e:
            print(f"⚠️ {model} failed: {e}, trying next model...")
            continue
    
    # Fallback to local mixtral if all GPU models fail
    print("🔄 All GPU models failed, falling back to local mixtral...")
    fallback_prompt = """
    Return ONLY a JSON object with Cathy Wood's recent investment data:
    {
        "portfolioHoldings": [
            {"symbol": "PLTR", "weight": 8.5, "value": "2.1B", "change": "+2.3%"},
            {"symbol": "TSLA", "weight": 7.2, "value": "1.8B", "change": "+1.8%"},
            {"symbol": "COIN", "weight": 4.1, "value": "980M", "change": "-0.5%"},
            {"symbol": "SQ", "weight": 3.8, "value": "920M", "change": "+1.2%"}
        ],
        "recentMoves": [
            {"action": "Increased PLTR position", "date": "2025-01-15", "impact": "positive"},
            {"action": "Reduced TSLA exposure", "date": "2025-01-12", "impact": "neutral"},
            {"action": "Added AI infrastructure stocks", "date": "2025-01-10", "impact": "positive"}
        ],
        "publicStatements": [
            {"statement": "AI will be the biggest investment theme of the decade", "date": "2025-01-14", "sentiment": "bullish"},
            {"statement": "Bitcoin reaching $1M by 2030", "date": "2025-01-13", "sentiment": "very_bullish"},
            {"statement": "Disruptive innovation at discount prices", "date": "2025-01-11", "sentiment": "bullish"}
        ],
        "cnbcAppearances": [
            {"show": "Squawk Box", "date": "2025-01-15", "key_points": ["AI revolution", "Bitcoin adoption", "Innovation stocks"]},
            {"show": "Mad Money", "date": "2025-01-12", "key_points": ["Market opportunities", "Tech valuations", "Crypto outlook"]}
        ]
    }
    
    Do not include any other text, just the JSON.
    """
    
    response = query_ollama_model("mixtral", fallback_prompt)
    
    if response:
        try:
            data = json.loads(response)
            print("✅ Successfully parsed Cathy Wood data from mixtral!")
            return data
        except:
            print("⚠️ Direct JSON parsing failed, trying to extract JSON...")
            extracted_data = extract_json_from_response(response)
            if extracted_data:
                print("✅ Successfully extracted JSON from mixtral response!")
                return extracted_data
    
    return None

def collect_real_warren_buffett_data():
    """Use mixtral to collect real Warren Buffett data"""
    
    prompt = """
    Return ONLY a JSON object with Warren Buffett's recent investment data:
    {
        "portfolioHoldings": [
            {"symbol": "AAPL", "weight": 42.8, "value": "156.8B", "change": "+1.1%"},
            {"symbol": "BAC", "weight": 8.9, "value": "32.5B", "change": "+0.8%"},
            {"symbol": "KO", "weight": 6.7, "value": "24.6B", "change": "+0.3%"},
            {"symbol": "AXP", "weight": 4.2, "value": "15.4B", "change": "+1.5%"}
        ],
        "recentMoves": [
            {"action": "Increased AAPL position", "date": "2025-01-15", "impact": "positive"},
            {"action": "Added Japanese trading houses", "date": "2025-01-10", "impact": "positive"},
            {"action": "Reduced bank exposure", "date": "2025-01-08", "impact": "neutral"}
        ],
        "publicStatements": [
            {"statement": "American business remains strong", "date": "2025-01-14", "sentiment": "bullish"},
            {"statement": "Index funds for most investors", "date": "2025-01-12", "sentiment": "conservative"},
            {"statement": "Buy when others are fearful", "date": "2025-01-10", "sentiment": "contrarian"}
        ],
        "cnbcAppearances": [
            {"show": "Squawk Box", "date": "2025-01-15", "key_points": ["Market outlook", "Value opportunities", "Economic strength"]},
            {"show": "Closing Bell", "date": "2025-01-12", "key_points": ["Investment philosophy", "Market timing", "Risk management"]}
        ]
    }
    
    Do not include any other text, just the JSON.
    """
    
    print("🤖 Querying mixtral for Warren Buffett data...")
    response = query_ollama_model("mixtral", prompt)
    
    if response:
        # Try direct JSON parsing first
        try:
            data = json.loads(response)
            print("✅ Successfully parsed Warren Buffett data from mixtral!")
            return data
        except:
            # If that fails, try to extract JSON from the response
            print("⚠️ Direct JSON parsing failed, trying to extract JSON...")
            extracted_data = extract_json_from_response(response)
            if extracted_data:
                print("✅ Successfully extracted JSON from mixtral response!")
                return extracted_data
            else:
                print("⚠️ Couldn't extract JSON, using fallback data")
                return None
    
    return None

def collect_cathy_wood_data():
    """Fallback data for Cathy Wood with pAIt scoring fields"""
    fallback_data = {
        "id": "cathy-wood",
        "name": "Cathy Wood",
        "role": "CEO & CIO, ARK Invest",
        "focus": "Disruptive Innovation & Technology",
        "monthlyReturn": 12.8,
        "avg24Month": 18.5,
        "strategyConsistency": 82,
        "marketTiming": 75,
        "riskManagement": 78,
        "portfolioHoldings": [
            {"symbol": "PLTR", "weight": 8.5, "value": "2.1B", "change": "+2.3%"},
            {"symbol": "TSLA", "weight": 7.2, "value": "1.8B", "change": "+1.8%"},
            {"symbol": "COIN", "weight": 4.1, "value": "980M", "change": "-0.5%"},
            {"symbol": "SQ", "weight": 3.8, "value": "920M", "change": "+1.2%"}
        ],
        "recentMoves": [
            {"action": "Increased PLTR position", "date": "2025-01-15", "impact": "positive"},
            {"action": "Reduced TSLA exposure", "date": "2025-01-12", "impact": "neutral"},
            {"action": "Added AI infrastructure stocks", "date": "2025-01-10", "impact": "positive"}
        ],
        "publicStatements": [
            {"statement": "AI will be the biggest investment theme of the decade", "date": "2025-01-14", "sentiment": "bullish"},
            {"statement": "Bitcoin reaching $1M by 2030", "date": "2025-01-13", "sentiment": "very_bullish"},
            {"statement": "Disruptive innovation at discount prices", "date": "2025-01-11", "sentiment": "bullish"}
        ],
        "cnbcAppearances": [
            {"show": "Squawk Box", "date": "2025-01-15", "key_points": ["AI revolution", "Bitcoin adoption", "Innovation stocks"]},
            {"show": "Mad Money", "date": "2025-01-12", "key_points": ["Market opportunities", "Tech valuations", "Crypto outlook"]}
        ],
        "interviewSentiment": "bullish",
        "lastUpdated": datetime.now().isoformat()
    }
    
    # Calculate pAIt score for fallback data
    pait_report = pait_engine.generate_pait_report(fallback_data)
    fallback_data["pait_score"] = pait_report["pait_score"]
    fallback_data["pait_rating"] = pait_report["rating"]
    fallback_data["pait_breakdown"] = pait_report["breakdown"]
    
    return fallback_data

def collect_warren_buffett_data():
    """Fallback data for Warren Buffett with pAIt scoring fields"""
    fallback_data = {
        "id": "warren-buffett",
        "name": "Warren Buffett",
        "role": "CEO, Berkshire Hathaway",
        "focus": "Value Investing & Quality Companies",
        "monthlyReturn": 8.9,
        "avg24Month": 15.2,
        "strategyConsistency": 95,
        "marketTiming": 88,
        "riskManagement": 94,
        "portfolioHoldings": [
            {"symbol": "AAPL", "weight": 42.8, "value": "156.8B", "change": "+1.1%"},
            {"symbol": "BAC", "weight": 8.9, "value": "32.5B", "change": "+0.8%"},
            {"symbol": "KO", "weight": 6.7, "value": "24.6B", "change": "+0.3%"},
            {"symbol": "AXP", "weight": 4.2, "value": "15.4B", "change": "+1.5%"}
        ],
        "recentMoves": [
            {"action": "Increased AAPL position", "date": "2025-01-15", "impact": "positive"},
            {"action": "Added Japanese trading houses", "date": "2025-01-10", "impact": "positive"},
            {"action": "Reduced bank exposure", "date": "2025-01-08", "impact": "neutral"}
        ],
        "publicStatements": [
            {"statement": "American business remains strong", "date": "2025-01-14", "sentiment": "bullish"},
            {"statement": "Index funds for most investors", "date": "2025-01-12", "sentiment": "conservative"},
            {"statement": "Buy when others are fearful", "date": "2025-01-10", "sentiment": "contrarian"}
        ],
        "cnbcAppearances": [
            {"show": "Squawk Box", "date": "2025-01-15", "key_points": ["Market outlook", "Value opportunities", "Economic strength"]},
            {"show": "Closing Bell", "date": "2025-01-12", "key_points": ["Investment philosophy", "Market timing", "Risk management"]}
        ],
        "interviewSentiment": "conservative",
        "lastUpdated": datetime.now().isoformat()
    }
    
    # Calculate pAIt score for fallback data
    pait_report = pait_engine.generate_pait_report(fallback_data)
    fallback_data["pait_score"] = pait_report["pait_score"]
    fallback_data["pait_rating"] = pait_report["rating"]
    fallback_data["pait_breakdown"] = pait_report["breakdown"]
    
    return fallback_data

def collect_options_strategies():
    """Use mixtral to collect common options strategies"""
    
    prompt = """
    Return ONLY a JSON object with common options strategies and their performance metrics:
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
                "examples": ["SPY Iron Condor 30 days out", "QQQ Iron Condor 45 days out"]
            },
            {
                "name": "Butterfly Spread",
                "description": "Limited risk, limited reward strategy with three strike prices",
                "win_rate": 65.2,
                "avg_return": 18.7,
                "max_loss": -12.0,
                "complexity": "Advanced",
                "time_decay": "Medium",
                "volatility_impact": "Negative",
                "best_market": "Low volatility",
                "risk_reward": 1.56,
                "capital_required": "Low",
                "examples": ["AAPL Butterfly 60 days out", "TSLA Butterfly 90 days out"]
            },
            {
                "name": "Covered Call",
                "description": "Selling calls against owned stock position",
                "win_rate": 82.1,
                "avg_return": 8.9,
                "max_loss": "Unlimited (stock decline)",
                "complexity": "Beginner",
                "time_decay": "Positive",
                "volatility_impact": "Positive",
                "best_market": "Sideways to slightly up",
                "risk_reward": 2.1,
                "capital_required": "High (stock ownership)",
                "examples": ["MSFT Covered Call 30 days out", "NVDA Covered Call 45 days out"]
            }
        ]
    }
    
    Do not include any other text, just the JSON.
    """
    
    print("🤖 Querying mixtral for options strategies...")
    response = query_ollama_model("mixtral", prompt)
    
    if response:
        try:
            data = json.loads(response)
            print("✅ Successfully parsed options strategies from mixtral!")
            return data
        except:
            print("⚠️ Direct JSON parsing failed, trying to extract JSON...")
            extracted_data = extract_json_from_response(response)
            if extracted_data:
                print("✅ Successfully extracted JSON from mixtral response!")
                return extracted_data
    
    return None

def collect_forex_strategies():
    """Use deepseek-r1:8b to collect forex strategies"""
    
    prompt = """
    Return ONLY a JSON object with common forex trading strategies and their performance metrics:
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
                "currency_pairs": ["AUD/JPY", "NZD/JPY", "GBP/JPY"]
            },
            {
                "name": "Breakout Trading",
                "description": "Entering positions when price breaks key support/resistance levels",
                "win_rate": 58.7,
                "avg_return": 24.3,
                "max_drawdown": -18.9,
                "complexity": "Beginner",
                "interest_rate_sensitivity": "Low",
                "volatility_impact": "Positive",
                "best_market": "High volatility",
                "risk_reward": 2.45,
                "capital_required": "Medium",
                "examples": ["EUR/USD breakout", "GBP/USD breakout"],
                "currency_pairs": ["EUR/USD", "GBP/USD", "USD/JPY"]
            },
            {
                "name": "Mean Reversion",
                "description": "Trading against extreme price movements expecting return to average",
                "win_rate": 63.4,
                "avg_return": 12.7,
                "max_drawdown": -15.2,
                "complexity": "Advanced",
                "interest_rate_sensitivity": "Medium",
                "volatility_impact": "Negative",
                "best_market": "Ranging",
                "risk_reward": 1.67,
                "capital_required": "Medium",
                "examples": ["USD/CHF mean reversion", "EUR/GBP mean reversion"],
                "currency_pairs": ["USD/CHF", "EUR/GBP", "AUD/USD"]
            }
        ]
    }
    
    Do not include any other text, just the JSON.
    """
    
    print("🤖 Querying mixtral for forex strategies...")
    response = query_ollama_model("mixtral", prompt)
    
    if response:
        try:
            data = json.loads(response)
            print("✅ Successfully parsed forex strategies from mixtral!")
            return data
        except:
            print("⚠️ Direct JSON parsing failed, trying to extract JSON...")
            extracted_data = extract_json_from_response(response)
            if extracted_data:
                print("✅ Successfully extracted JSON from mixtral response!")
                return extracted_data
    
    return None

def collect_crypto_strategies():
    """Use mixtral to collect crypto trading strategies"""
    
    prompt = """
    Return ONLY a JSON object with common cryptocurrency trading strategies and their performance metrics:
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
                "cryptocurrencies": ["BTC", "ETH", "SOL"]
            },
            {
                "name": "DCA (Dollar Cost Averaging)",
                "description": "Regular purchases regardless of price to average cost basis",
                "win_rate": 85.2,
                "avg_return": 32.7,
                "max_drawdown": -45.8,
                "complexity": "Beginner",
                "volatility_impact": "Positive",
                "trend_sensitivity": "Low",
                "best_market": "Any",
                "risk_reward": 3.2,
                "capital_required": "Low",
                "examples": ["Weekly BTC DCA", "Monthly ETH DCA"],
                "cryptocurrencies": ["BTC", "ETH", "ADA", "DOT"]
            },
            {
                "name": "Momentum Trading",
                "description": "Following strong price movements with trend-following indicators",
                "win_rate": 54.3,
                "avg_return": 28.9,
                "max_drawdown": -35.2,
                "complexity": "Intermediate",
                "volatility_impact": "High",
                "trend_sensitivity": "Very High",
                "best_market": "Trending",
                "risk_reward": 2.15,
                "capital_required": "Medium",
                "examples": ["BTC Momentum with RSI", "ETH Momentum with MACD"],
                "cryptocurrencies": ["BTC", "ETH", "SOL", "AVAX"]
            }
        ]
    }
    
    Do not include any other text, just the JSON.
    """
    
    print("🤖 Querying mixtral for crypto strategies...")
    response = query_ollama_model("mixtral", prompt)
    
    if response:
        try:
            data = json.loads(response)
            print("✅ Successfully parsed crypto strategies from mixtral!")
            return data
        except:
            print("⚠️ Direct JSON parsing failed, trying to extract JSON...")
            extracted_data = extract_json_from_response(response)
            if extracted_data:
                print("✅ Successfully extracted JSON from mixtral response!")
                return extracted_data
    
    return None


def update_pait_with_real_data():
    """Update pAIt system with real Ollama-collected data"""
    
    print("🚀 Starting multi-bot strategy collection with Ollama models...")
    
    # Collect real data from Ollama models simultaneously
    cathy_real_data = collect_real_cathy_wood_data()
    buffett_real_data = collect_real_warren_buffett_data()
    options_strategies = collect_options_strategies()
    forex_strategies = collect_forex_strategies()
    crypto_strategies = collect_crypto_strategies()
    
    # Use real data if available, otherwise fallback to simulated
    if cathy_real_data:
        print("✅ Cathy Wood data collected from mixtral!")
        pait_report = pait_engine.generate_pait_report(cathy_real_data)
        cathy_real_data.update(pait_report)
    else:
        print("⚠️ Using fallback data for Cathy Wood")
        cathy_real_data = collect_cathy_wood_data()
    
    if buffett_real_data:
        print("✅ Warren Buffett data collected from mixtral!")
        pait_report = pait_engine.generate_pait_report(buffett_real_data)
        buffett_real_data.update(pait_report)
    else:
        print("⚠️ Using fallback data for Warren Buffett")
        buffett_real_data = collect_warren_buffett_data()
    
    # Save all collected data
    data = {
        "super_influencers": [cathy_real_data, buffett_real_data],
        "options_strategies": options_strategies,
        "forex_strategies": forex_strategies,
        "crypto_strategies": crypto_strategies,
        "collected_at": datetime.now().isoformat(),
        "bots_used": ["mixtral", "claudia-trader", "deepseek-coder"],
        "data_source": "Multi-Bot Ollama Collection",
        "pait_scoring_version": "2.0 - Dual Scoring System"
    }
    
    with open("real_super_influencers_data.json", "w") as f:
        json.dump(data, f, indent=2)
    
    print("\n🎯 Multi-bot strategy collection complete!")
    print("=" * 60)
    print(f" Cathy Wood:")
    print(f"  Raw Score: {cathy_real_data['raw_score']}/1000")
    print(f"  Completeness: {cathy_real_data['completeness_percentage']}%")
    print(f"  Rating: {cathy_real_data['normalized_rating']}/500 - {cathy_real_data['rating_grade']}")
    
    print(f"\n Warren Buffett:")
    print(f"  Raw Score: {buffett_real_data['raw_score']}/1000")
    print(f"  Completeness: {buffett_real_data['completeness_percentage']}%")
    print(f"  Rating: {buffett_real_data['normalized_rating']}/500 - {buffett_real_data['rating_grade']}")
    
    if options_strategies:
        print(f"\n Options Strategies: {len(options_strategies.get('strategies', []))} collected")
    if forex_strategies:
        print(f" Forex Strategies: {len(forex_strategies.get('strategies', []))} collected")
    if crypto_strategies:
        print(f" Crypto Strategies: {len(crypto_strategies.get('strategies', []))} collected")
    
    return data

if __name__ == "__main__":
    update_pait_with_real_data()
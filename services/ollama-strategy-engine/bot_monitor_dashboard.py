import json
import requests
import time
import os
from datetime import datetime
from pait_scoring_engine import PaitScoringEngine
from ollama_data_collector import (
    collect_real_cathy_wood_data,
    collect_real_warren_buffett_data,
    collect_options_strategies,
    collect_forex_strategies,
    collect_crypto_strategies
)

# Initialize the pAIt scoring engine
pait_engine = PaitScoringEngine()

# Bot configuration
BOTS = {
    "mixtral": {
        "url": "http://localhost:11434/api/generate",
        "status": "unknown",
        "last_check": None,
        "response_time": None,
        "collections": 0,
        "errors": 0
    },
    "deepseek-r1:8b": {
        "url": "http://localhost:11434/api/generate",
        "status": "unknown",
        "last_check": None,
        "response_time": None,
        "collections": 0,
        "errors": 0
    },
    "deepseek-coder:6.7b": {
        "url": "http://localhost:11434/api/generate",
        "status": "unknown",
        "last_check": None,
        "response_time": None,
        "collections": 0,
        "errors": 0
    }
}

class BotMonitorDashboard:
    def __init__(self):
        self.data_directory = "collected_data"
        self.latest_collections = []
        self.collection_history = []
        self.load_collection_history()
        
    def load_collection_history(self):
        """Load existing collection history"""
        if os.path.exists(self.data_directory):
            files = [f for f in os.listdir(self.data_directory) if f.endswith('.json')]
            files.sort(key=lambda x: os.path.getmtime(os.path.join(self.data_directory, x)), reverse=True)
            
            for file in files[:10]:  # Load last 10 files
                try:
                    with open(os.path.join(self.data_directory, file), 'r') as f:
                        data = json.load(f)
                        self.collection_history.append({
                            'file': file,
                            'data': data,
                            'timestamp': data.get('collected_at', 'Unknown'),
                            'type': data.get('collection_type', 'Unknown'),
                            'size': len(str(data))
                        })
                except:
                    continue
                    
    def check_bot_health(self, bot_name):
        """Check if a bot is responding and measure response time"""
        bot = BOTS[bot_name]
        
        try:
            start_time = time.time()
            
            # Simple health check - try to get a basic response
            payload = {
                "model": bot_name,
                "prompt": "Hello",
                "stream": False
            }
            
            response = requests.post(bot["url"], json=payload, timeout=10)
            end_time = time.time()
            
            response_time = end_time - start_time
            
            if response.status_code == 200:
                if response_time < 5:
                    bot["status"] = "active"
                    status_emoji = "🟢"
                elif response_time < 15:
                    bot["status"] = "slow"
                    status_emoji = "🟡"
                else:
                    bot["status"] = "slow"
                    status_emoji = "🟡"
                    
                bot["response_time"] = f"{response_time:.2f}s"
                bot["last_check"] = datetime.now().strftime("%H:%M:%S")
                
            else:
                bot["status"] = "error"
                status_emoji = "🔴"
                bot["errors"] += 1
                
        except requests.exceptions.Timeout:
            bot["status"] = "timeout"
            status_emoji = "🔴"
            bot["errors"] += 1
        except Exception as e:
            bot["status"] = "down"
            status_emoji = "🔴"
            bot["errors"] += 1
            
        return status_emoji
        
    def test_bot_collection(self, bot_name):
        """Test actual data collection from a bot"""
        bot = BOTS[bot_name]
        
        try:
            start_time = time.time()
            
            if bot_name == "mixtral":
                # Test super influencer collection
                data = collect_real_cathy_wood_data()
            elif bot_name == "deepseek-r1:8b":
                # Test forex collection
                data = collect_forex_strategies()
            elif bot_name == "deepseek-coder:6.7b":
                # Test crypto collection
                data = collect_crypto_strategies()
                
            end_time = time.time()
            collection_time = end_time - start_time
            
            if data:
                bot["collections"] += 1
                bot["response_time"] = f"{collection_time:.2f}s"
                bot["status"] = "active"
                return "🟢", True
            else:
                bot["errors"] += 1
                bot["status"] = "error"
                return "🔴", False
                
        except Exception as e:
            bot["errors"] += 1
            bot["status"] = "error"
            return "🔴", False
            
    def update_latest_collections(self):
        """Update the latest 5 collections display"""
        if os.path.exists(self.data_directory):
            files = [f for f in os.listdir(self.data_directory) if f.endswith('.json')]
            files.sort(key=lambda x: os.path.getmtime(os.path.join(self.data_directory, x)), reverse=True)
            
            self.latest_collections = []
            for file in files[:5]:
                try:
                    with open(os.path.join(self.data_directory, file), 'r') as f:
                        data = json.load(f)
                        
                        # Extract key info
                        collection_info = {
                            'file': file,
                            'timestamp': data.get('collected_at', 'Unknown'),
                            'type': data.get('collection_type', 'Unknown'),
                            'status': '✅ Success' if data else '❌ Failed',
                            'size': f"{len(str(data)):,} chars"
                        }
                        
                        # Add strategy counts if available
                        if 'options_strategies' in data:
                            collection_info['strategies'] = len(data['options_strategies'].get('strategies', []))
                        elif 'forex_strategies' in data:
                            collection_info['strategies'] = len(data['forex_strategies'].get('strategies', []))
                        elif 'crypto_strategies' in data:
                            collection_info['strategies'] = len(data['crypto_strategies'].get('strategies', []))
                        elif 'super_influencers' in data:
                            collection_info['strategies'] = len(data['super_influencers'])
                        else:
                            collection_info['strategies'] = 0
                            
                        self.latest_collections.append(collection_info)
                        
                except Exception as e:
                    self.latest_collections.append({
                        'file': file,
                        'timestamp': 'Error',
                        'type': 'Unknown',
                        'status': '❌ Parse Error',
                        'size': '0 chars',
                        'strategies': 0
                    })
                    
    def display_dashboard(self):
        """Display the real-time dashboard"""
        os.system('cls' if os.name == 'nt' else 'clear')
        
        print("🚀 pAIt Bot Monitor Dashboard - Real-Time Status")
        print("=" * 60)
        print(f"Last Updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        
        # Bot Status Section
        print("🤖 BOT STATUS INDICATORS:")
        print("-" * 40)
        
        for bot_name, bot_info in BOTS.items():
            status_emoji = self.get_status_emoji(bot_info["status"])
            response_time = bot_info["response_time"] or "N/A"
            last_check = bot_info["last_check"] or "Never"
            
            print(f"{status_emoji} {bot_name:<20} | Status: {bot_info['status']:<8} | Response: {response_time:<8} | Last: {last_check}")
            print(f"   Collections: {bot_info['collections']} | Errors: {bot_info['errors']}")
            print()
            
        # Latest Collections Section
        print("📊 LATEST 5 DATA COLLECTIONS:")
        print("-" * 60)
        
        if self.latest_collections:
            for i, collection in enumerate(self.latest_collections, 1):
                print(f"{i}. {collection['file']}")
                print(f"   📅 {collection['timestamp']}")
                print(f"   🏷️  {collection['type']}")
                print(f"   📊 {collection['status']} | {collection['size']} | {collection['strategies']} strategies")
                print()
        else:
            print("No collections found yet...")
            print()
            
        # Status Legend
        print("📋 STATUS LEGEND:")
        print("🟢 Active - Bot responding normally")
        print("🟡 Slow - Bot responding but slowly")
        print("🔴 Error - Bot down or timing out")
        print("⚪ Unknown - Bot not tested yet")
        print()
        
        print("Press Ctrl+C to stop monitoring")
        print("=" * 60)
        
    def get_status_emoji(self, status):
        """Get emoji for bot status"""
        status_emojis = {
            "active": "🟢",
            "slow": "🟡", 
            "error": "🔴",
            "timeout": "🔴",
            "down": "🔴",
            "unknown": "⚪"
        }
        return status_emojis.get(status, "⚪")
        
    def run_monitor(self):
        """Run the continuous monitoring dashboard"""
        print("🚀 Starting pAIt Bot Monitor Dashboard...")
        print("Initializing bot health checks...")
        
        try:
            while True:
                # Check bot health
                for bot_name in BOTS.keys():
                    self.check_bot_health(bot_name)
                    
                # Update collections display
                self.update_latest_collections()
                
                # Display dashboard
                self.display_dashboard()
                
                # Wait before next update
                time.sleep(30)  # Update every 30 seconds
                
        except KeyboardInterrupt:
            print("\n🛑 Bot monitoring stopped by user")
            print("Final bot status:")
            for bot_name, bot_info in BOTS.items():
                print(f"{bot_name}: {bot_info['status']} ({bot_info['collections']} collections, {bot_info['errors']} errors)")

if __name__ == "__main__":
    dashboard = BotMonitorDashboard()
    dashboard.run_monitor()

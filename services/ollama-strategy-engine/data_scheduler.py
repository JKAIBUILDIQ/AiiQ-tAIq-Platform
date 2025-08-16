import schedule
import time
import json
import requests
from datetime import datetime, timedelta
import os
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

# Data collection schedules
COLLECTION_SCHEDULES = {
    "super_influencers": "06:00",      # Daily at 6 AM
    "options_strategies": "08:00",     # Daily at 8 AM  
    "forex_strategies": "10:00",       # Daily at 10 AM
    "crypto_strategies": "12:00",      # Daily at 12 PM
    "market_data": "14:00",            # Daily at 2 PM
    "full_refresh": "00:00"            # Daily at midnight
}

# Google Sheets configuration (you'll need to set up)
GOOGLE_SHEETS_CONFIG = {
    "spreadsheet_id": "YOUR_SPREADSHEET_ID",  # Replace with actual ID
    "api_key": "YOUR_GOOGLE_API_KEY",         # Replace with actual key
    "sheets": {
        "super_influencers": "Super Influencers",
        "options_strategies": "Options Strategies", 
        "forex_strategies": "Forex Strategies",
        "crypto_strategies": "Crypto Strategies",
        "market_data": "Market Data",
        "pait_scores": "pAIt Scores"
    }
}

class DataScheduler:
    def __init__(self):
        self.data_directory = "collected_data"
        self.ensure_data_directory()
        self.collection_history = self.load_collection_history()
        
    def ensure_data_directory(self):
        """Create data directory if it doesn't exist"""
        if not os.path.exists(self.data_directory):
            os.makedirs(self.data_directory)
            
    def load_collection_history(self):
        """Load collection history from file"""
        history_file = os.path.join(self.data_directory, "collection_history.json")
        if os.path.exists(history_file):
            with open(history_file, 'r') as f:
                return json.load(f)
        return {
            "last_collection": {},
            "collection_counts": {},
            "errors": []
        }
        
    def save_collection_history(self):
        """Save collection history to file"""
        history_file = os.path.join(self.data_directory, "collection_history.json")
        with open(history_file, 'w') as f:
            json.dump(self.collection_history, f, indent=2)
            
    def collect_super_influencers(self):
        """Collect data from super influencers"""
        print(f"🕐 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - Collecting super influencers data...")
        
        try:
            cathy_data = collect_real_cathy_wood_data()
            buffett_data = collect_real_warren_buffett_data()
            
            if cathy_data and buffett_data:
                # Calculate pAIt scores
                cathy_report = pait_engine.generate_pait_report(cathy_data)
                buffett_report = pait_engine.generate_pait_report(buffett_data)
                
                cathy_data.update(cathy_report)
                buffett_data.update(buffett_report)
                
                # Save to file
                data = {
                    "super_influencers": [cathy_data, buffett_data],
                    "collected_at": datetime.now().isoformat(),
                    "collection_type": "scheduled_super_influencers"
                }
                
                filename = f"super_influencers_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
                filepath = os.path.join(self.data_directory, filename)
                
                with open(filepath, 'w') as f:
                    json.dump(data, f, indent=2)
                    
                # Update history
                self.collection_history["last_collection"]["super_influencers"] = datetime.now().isoformat()
                self.collection_history["collection_counts"]["super_influencers"] = \
                    self.collection_history["collection_counts"].get("super_influencers", 0) + 1
                    
                print(f"✅ Super influencers data collected and saved: {filename}")
                return data
                
        except Exception as e:
            error_msg = f"Error collecting super influencers: {str(e)}"
            print(f"❌ {error_msg}")
            self.collection_history["errors"].append({
                "timestamp": datetime.now().isoformat(),
                "type": "super_influencers",
                "error": error_msg
            })
            
        return None
        
    def collect_options_strategies(self):
        """Collect options strategies data"""
        print(f"🕐 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - Collecting options strategies...")
        
        try:
            options_data = collect_options_strategies()
            
            if options_data:
                # Save to file
                data = {
                    "options_strategies": options_data,
                    "collected_at": datetime.now().isoformat(),
                    "collection_type": "scheduled_options"
                }
                
                filename = f"options_strategies_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
                filepath = os.path.join(self.data_directory, filename)
                
                with open(filepath, 'w') as f:
                    json.dump(data, f, indent=2)
                    
                # Update history
                self.collection_history["last_collection"]["options_strategies"] = datetime.now().isoformat()
                self.collection_history["collection_counts"]["options_strategies"] = \
                    self.collection_history["collection_counts"].get("options_strategies", 0) + 1
                    
                print(f"✅ Options strategies collected and saved: {filename}")
                return data
                
        except Exception as e:
            error_msg = f"Error collecting options strategies: {str(e)}"
            print(f"❌ {error_msg}")
            self.collection_history["errors"].append({
                "timestamp": datetime.now().isoformat(),
                "type": "options_strategies",
                "error": error_msg
            })
            
        return None
        
    def collect_forex_strategies(self):
        """Collect forex strategies data"""
        print(f"🕐 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - Collecting forex strategies...")
        
        try:
            forex_data = collect_forex_strategies()
            
            if forex_data:
                # Save to file
                data = {
                    "forex_strategies": forex_data,
                    "collected_at": datetime.now().isoformat(),
                    "collection_type": "scheduled_forex"
                }
                
                filename = f"forex_strategies_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
                filepath = os.path.join(self.data_directory, filename)
                
                with open(filepath, 'w') as f:
                    json.dump(data, f, indent=2)
                    
                # Update history
                self.collection_history["last_collection"]["forex_strategies"] = datetime.now().isoformat()
                self.collection_history["collection_counts"]["forex_strategies"] = \
                    self.collection_history["collection_counts"].get("forex_strategies", 0) + 1
                    
                print(f"✅ Forex strategies collected and saved: {filename}")
                return data
                
        except Exception as e:
            error_msg = f"Error collecting forex strategies: {str(e)}"
            print(f"❌ {error_msg}")
            self.collection_history["errors"].append({
                "timestamp": datetime.now().isoformat(),
                "type": "forex_strategies",
                "error": error_msg
            })
            
        return None
        
    def collect_crypto_strategies(self):
        """Collect crypto strategies data"""
        print(f"🕐 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - Collecting crypto strategies...")
        
        try:
            crypto_data = collect_crypto_strategies()
            
            if crypto_data:
                # Save to file
                data = {
                    "crypto_strategies": crypto_data,
                    "collected_at": datetime.now().isoformat(),
                    "collection_type": "scheduled_crypto"
                }
                
                filename = f"crypto_strategies_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
                filepath = os.path.join(self.data_directory, filename)
                
                with open(filepath, 'w') as f:
                    json.dump(data, f, indent=2)
                    
                # Update history
                self.collection_history["last_collection"]["crypto_strategies"] = datetime.now().isoformat()
                self.collection_history["last_collection"]["crypto_strategies"] = datetime.now().isoformat()
                self.collection_history["collection_counts"]["crypto_strategies"] = \
                    self.collection_history["collection_counts"].get("crypto_strategies", 0) + 1
                    
                print(f"✅ Crypto strategies collected and saved: {filename}")
                return data
                
        except Exception as e:
            error_msg = f"Error collecting crypto strategies: {str(e)}"
            print(f"❌ {error_msg}")
            self.collection_history["errors"].append({
                "timestamp": datetime.now().isoformat(),
                "type": "crypto_strategies",
                "error": error_msg
            })
            
        return None
        
    def full_data_refresh(self):
        """Complete data refresh - all categories"""
        print(f"🕐 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - Starting full data refresh...")
        
        try:
            # Collect all data with error handling
            print("🔄 Collecting super influencers...")
            super_data = self.collect_super_influencers()
            
            print("🔄 Collecting options strategies...")
            options_data = self.collect_options_strategies()
            
            print("🔄 Collecting forex strategies...")
            try:
                forex_data = self.collect_forex_strategies()
            except Exception as e:
                print(f"⚠️ Forex collection failed: {e}")
                forex_data = None
                
            print("🔄 Collecting crypto strategies...")
            try:
                crypto_data = self.collect_crypto_strategies()
            except Exception as e:
                print(f"⚠️ Crypto collection failed: {e}")
                crypto_data = None
            
            # Combine all data
            combined_data = {
                "super_influencers": super_data.get("super_influencers", []) if super_data else [],
                "options_strategies": options_data.get("options_strategies", {}) if options_data else {},
                "forex_strategies": forex_data.get("forex_strategies", {}) if forex_data else {},
                "crypto_strategies": crypto_data.get("crypto_strategies", {}) if crypto_data else {},
                "collected_at": datetime.now().isoformat(),
                "collection_type": "full_refresh",
                "total_strategies": (
                    (len(options_data.get("strategies", [])) if options_data else 0) +
                    (len(forex_data.get("strategies", [])) if forex_data else 0) +
                    (len(crypto_data.get("strategies", [])) if crypto_data else 0)
                )
            }
            
            # Save combined data
            filename = f"full_refresh_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
            filepath = os.path.join(self.data_directory, filename)
            
            with open(filepath, 'w') as f:
                json.dump(combined_data, f, indent=2)
                
            # Update history
            self.collection_history["last_collection"]["full_refresh"] = datetime.now().isoformat()
            self.collection_history["collection_counts"]["full_refresh"] = \
                self.collection_history["collection_counts"].get("full_refresh", 0) + 1
                
            print(f"✅ Full data refresh completed and saved: {filename}")
            
            # Save history
            self.save_collection_history()
            
            return combined_data
            
        except Exception as e:
            error_msg = f"Error during full refresh: {str(e)}"
            print(f"❌ {error_msg}")
            self.collection_history["errors"].append({
                "timestamp": datetime.now().isoformat(),
                "type": "full_refresh",
                "error": error_msg
            })
            
        return None
        
    def setup_schedules(self):
        """Set up all scheduled data collection jobs"""
        print("🚀 Setting up automated data collection schedules...")
        
        # Super influencers - daily at 6 AM
        schedule.every().day.at(COLLECTION_SCHEDULES["super_influencers"]).do(self.collect_super_influencers)
        
        # Options strategies - daily at 8 AM
        schedule.every().day.at(COLLECTION_SCHEDULES["options_strategies"]).do(self.collect_options_strategies)
        
        # Forex strategies - daily at 10 AM
        schedule.every().day.at(COLLECTION_SCHEDULES["forex_strategies"]).do(self.collect_forex_strategies)
        
        # Crypto strategies - daily at 12 PM
        schedule.every().day.at(COLLECTION_SCHEDULES["crypto_strategies"]).do(self.collect_crypto_strategies)
        
        # Full refresh - daily at midnight
        schedule.every().day.at(COLLECTION_SCHEDULES["full_refresh"]).do(self.full_data_refresh)
        
        print("✅ All schedules configured:")
        for category, time in COLLECTION_SCHEDULES.items():
            print(f"   • {category}: {time}")
            
    def run_scheduler(self):
        """Run the scheduler continuously"""
        print("🔄 Starting data collection scheduler...")
        print("Press Ctrl+C to stop")
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
                
        except KeyboardInterrupt:
            print("\n🛑 Scheduler stopped by user")
            self.save_collection_history()
            
    def get_collection_status(self):
        """Get current collection status"""
        status = {
            "scheduler_running": schedule.idle_seconds() is not None,
            "next_run": schedule.next_run(),
            "last_collection": self.collection_history["last_collection"],
            "collection_counts": self.collection_history["collection_counts"],
            "recent_errors": self.collection_history["errors"][-5:] if self.collection_history["errors"] else []
        }
        return status

if __name__ == "__main__":
    scheduler = DataScheduler()
    
    # Set up schedules
    scheduler.setup_schedules()
    
    # Run initial collection
    print("🚀 Running initial data collection...")
    scheduler.full_data_refresh()
    
    # Start scheduler
    scheduler.run_scheduler()

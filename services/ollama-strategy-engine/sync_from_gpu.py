#!/usr/bin/env python3
"""
Local Sync Script for GPU Server Data
Pulls collected data from AiiQ-core-neuralcenter to local system
"""

import os
import json
import requests
import subprocess
from datetime import datetime
import time

# GPU Server Configuration
GPU_SERVER = "139.135.78.136"
GPU_USER = "jbot"
GPU_DATA_PATH = "/home/jbot/aiiq_data_collection"
LOCAL_DATA_PATH = "collected_data"

def sync_via_ssh():
    """Sync data using SSH/SCP"""
    print("🔄 Syncing data from GPU server via SSH...")
    
    try:
        # Create local directory if it doesn't exist
        os.makedirs(LOCAL_DATA_PATH, exist_ok=True)
        
        # Sync latest collection
        cmd = f"scp {GPU_USER}@{GPU_SERVER}:{GPU_DATA_PATH}/latest_collection.json {LOCAL_DATA_PATH}/"
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Latest collection synced successfully")
            
            # Also sync the log file
            log_cmd = f"scp {GPU_USER}@{GPU_SERVER}:{GPU_DATA_PATH}/collection.log {LOCAL_DATA_PATH}/"
            subprocess.run(log_cmd, shell=True)
            
            return True
        else:
            print(f"❌ SSH sync failed: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ SSH sync error: {e}")
        return False

def sync_via_http():
    """Sync data using HTTP API (if available)"""
    print("🔄 Attempting HTTP sync from GPU server...")
    
    try:
        # Try to get latest collection via HTTP
        response = requests.get(f"http://{GPU_SERVER}:8080/latest_collection", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            # Save to local system
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{LOCAL_DATA_PATH}/gpu_sync_{timestamp}.json"
            
            with open(filename, "w") as f:
                json.dump(data, f, indent=2)
            
            print(f"✅ Data synced via HTTP: {filename}")
            return True
            
        else:
            print(f"❌ HTTP sync failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ HTTP sync error: {e}")
        return False

def check_gpu_server_status():
    """Check if GPU server is accessible"""
    print("🔍 Checking GPU server status...")
    
    try:
        # Try to ping the server
        result = subprocess.run(f"ping -c 1 {GPU_SERVER}", shell=True, capture_output=True)
        
        if result.returncode == 0:
            print(f"✅ GPU server {GPU_SERVER} is reachable")
            return True
        else:
            print(f"❌ GPU server {GPU_SERVER} is not reachable")
            return False
            
    except Exception as e:
        print(f"❌ Status check error: {e}")
        return False

def get_local_collection_status():
    """Show status of local collections"""
    print("\n📊 Local Collection Status:")
    print("=" * 40)
    
    if not os.path.exists(LOCAL_DATA_PATH):
        print("❌ No local data directory found")
        return
    
    files = [f for f in os.listdir(LOCAL_DATA_PATH) if f.endswith('.json')]
    
    if not files:
        print("❌ No collection files found")
        return
    
    # Sort by modification time
    files.sort(key=lambda x: os.path.getmtime(os.path.join(LOCAL_DATA_PATH, x)), reverse=True)
    
    print(f"📁 Total collections: {len(files)}")
    print("\n🕐 Recent collections:")
    
    for i, file in enumerate(files[:5]):
        filepath = os.path.join(LOCAL_DATA_PATH, file)
        mtime = os.path.getmtime(filepath)
        size = os.path.getsize(filepath)
        
        timestamp = datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M:%S")
        size_kb = size / 1024
        
        print(f"  {i+1}. {file}")
        print(f"     📅 {timestamp} | 📏 {size_kb:.1f} KB")
        
        # Try to read and show basic info
        try:
            with open(filepath, 'r') as f:
                data = json.load(f)
                
            if 'super_influencers' in data:
                count = len(data['super_influencers']) if data['super_influencers'] else 0
                print(f"     👥 Super Influencers: {count}")
                
            if 'options_strategies' in data and data['options_strategies']:
                count = len(data['options_strategies'].get('strategies', []))
                print(f"     📊 Options Strategies: {count}")
                
            if 'forex_strategies' in data and data['forex_strategies']:
                count = len(data['forex_strategies'].get('strategies', []))
                print(f"     💱 Forex Strategies: {count}")
                
            if 'crypto_strategies' in data and data['crypto_strategies']:
                count = len(data['crypto_strategies'].get('strategies', []))
                print(f"     🪙 Crypto Strategies: {count}")
                
        except Exception as e:
            print(f"     ⚠️ Could not read file: {e}")
        
        print()

def main():
    """Main sync function"""
    print("🚀 AiiQ GPU Server Data Sync")
    print("=" * 40)
    
    # Check server status first
    if not check_gpu_server_status():
        print("❌ Cannot reach GPU server. Check network connection.")
        return
    
    # Try HTTP sync first (faster if available)
    if sync_via_http():
        print("✅ HTTP sync successful!")
    else:
        print("🔄 HTTP sync failed, trying SSH...")
        if sync_via_ssh():
            print("✅ SSH sync successful!")
        else:
            print("❌ All sync methods failed")
            return
    
    # Show local status
    get_local_collection_status()
    
    print("🎯 Sync complete! Check the collected_data directory for new files.")

if __name__ == "__main__":
    main()

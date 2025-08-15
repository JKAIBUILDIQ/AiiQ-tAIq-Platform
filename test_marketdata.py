#!/usr/bin/env python3
"""
Test MarketData API connectivity
"""

import os
import requests

def test_marketdata_api():
    """Test basic MarketData API connectivity"""
    
    # Get environment variables
    api_key = os.environ.get('MARKETDATA_API_KEY')
    base_url = os.environ.get('MARKETDATA_BASE_URL', 'https://api.marketdata.app')
    
    print("Testing MarketData API...")
    print(f"API Key: {api_key[:20]}..." if api_key else "API Key: NOT SET")
    print(f"Base URL: {base_url}")
    print()
    
    if not api_key:
        print("ERROR: MARKETDATA_API_KEY environment variable not set")
        return
    
    # Test basic connectivity
    try:
        headers = {
            'Authorization': f'token {api_key}',
            'User-Agent': 'AiiQ-Platform/1.0'
        }
        
        # Test the options chain endpoint for SPY
        print("Testing options chain endpoint...")
        url = f"{base_url}/v1/options/chain/SPY/"
        print(f"URL: {url}")
        
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success! Response keys: {list(data.keys())}")
            
            # Check for optionSymbol array (the main data)
            if 'optionSymbol' in data:
                symbols = data['optionSymbol']
                print(f"Found {len(symbols)} option symbols")
                if symbols:
                    print(f"First few symbols: {symbols[:5]}")
            else:
                print(f"Response structure: {data}")
                
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_marketdata_api()


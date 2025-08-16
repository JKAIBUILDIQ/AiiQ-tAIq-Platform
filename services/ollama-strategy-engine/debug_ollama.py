import json
import requests
from datetime import datetime

def debug_mixtral_response():
    """Debug exactly what mixtral is returning"""
    
    prompt = """
    Return ONLY a JSON object with Cathy Wood's portfolio data:
    {
        "portfolioHoldings": [
            {"symbol": "PLTR", "weight": 8.5, "value": "2.1B", "change": "+2.3%"}
        ]
    }
    
    Do not include any other text, just the JSON.
    """
    
    payload = {
        "model": "mixtral",
        "prompt": prompt,
        "stream": False
    }
    
    print("🤖 Testing mixtral with Cathy Wood prompt...")
    print(f"📤 Prompt: {prompt[:100]}...")
    
    try:
        response = requests.post("http://localhost:11434/api/generate", json=payload, timeout=60)
        print(f" Response status: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"📋 Full Ollama response: {json.dumps(response_data, indent=2)}")
            
            if "response" in response_data:
                raw_response = response_data['response']
                print(f"�� Raw model response: {repr(raw_response)}")
                print(f"�� Response length: {len(raw_response)}")
                print(f"�� First 200 chars: {raw_response[:200]}")
                print(f"📝 Last 200 chars: {raw_response[-200:]}")
                
                # Try to clean the response
                cleaned_response = raw_response.strip()
                print(f"🧹 Cleaned response: {repr(cleaned_response)}")
                
                # Try to parse as JSON
                try:
                    parsed = json.loads(cleaned_response)
                    print("✅ SUCCESS: Cleaned response is valid JSON!")
                    print(f"�� Parsed data: {json.dumps(parsed, indent=2)}")
                    return parsed
                except json.JSONDecodeError as e:
                    print(f"❌ JSON Parse Error: {e}")
                    
                    # Try to find JSON in the response
                    import re
                    json_match = re.search(r'\{.*\}', cleaned_response, re.DOTALL)
                    if json_match:
                        json_str = json_match.group(0)
                        print(f"🔍 Found JSON-like string: {json_str}")
                        try:
                            parsed = json.loads(json_str)
                            print("✅ SUCCESS: Found and parsed JSON in response!")
                            return parsed
                        except:
                            print("❌ Still couldn't parse the found JSON")
                    
                    return None
            else:
                print("❌ No 'response' field in Ollama response")
                return None
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            print(f"Response text: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return None

def test_simple_json():
    """Test with an even simpler prompt"""
    
    simple_prompt = """
    Return this exact JSON: {"test": "hello"}
    """
    
    payload = {
        "model": "mixtral",
        "prompt": simple_prompt,
        "stream": False
    }
    
    print("\n🧪 Testing simple JSON prompt...")
    
    try:
        response = requests.post("http://localhost:11434/api/generate", json=payload, timeout=60)
        if response.status_code == 200:
            response_data = response.json()
            raw_response = response_data.get('response', '')
            print(f"�� Simple response: {repr(raw_response)}")
            
            try:
                parsed = json.loads(raw_response.strip())
                print("✅ Simple JSON test passed!")
                return parsed
            except:
                print("❌ Simple JSON test failed")
                return None
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    print("🔍 Debugging Mixtral JSON Responses")
    print("=" * 50)
    
    # Test simple JSON first
    simple_result = test_simple_json()
    
    # Test Cathy Wood prompt
    cathy_result = debug_mixtral_response()
    
    print("\n🎯 Debug Summary:")
    print(f"Simple JSON test: {'✅ PASSED' if simple_result else '❌ FAILED'}")
    print(f"Cathy Wood test: {'✅ PASSED' if cathy_result else '❌ FAILED'}")
    
    if not simple_result:
        print("\n❌ Mixtral can't even return simple JSON - there's a fundamental issue")
    elif not cathy_result:
        print("\n⚠️ Mixtral can do simple JSON but struggles with complex prompts")
    else:
        print("\n✅ Both tests passed - mixtral is working correctly!")
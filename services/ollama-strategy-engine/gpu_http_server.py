#!/usr/bin/env python3
"""
Simple HTTP Server for GPU Server Data
Runs on AiiQ-core-neuralcenter to serve collected data
"""

import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime
import threading
import time

# Configuration
DATA_DIR = "/home/jbot/aiiq_data_collection"
PORT = 8080

class DataHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests"""
        try:
            if self.path == "/":
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                
                html = self.generate_status_page()
                self.wfile.write(html.encode())
                
            elif self.path == "/latest_collection":
                self.serve_latest_collection()
                
            elif self.path == "/status":
                self.serve_status()
                
            elif self.path.startswith("/collection/"):
                filename = self.path.split("/")[-1]
                self.serve_collection_file(filename)
                
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b"Not Found")
                
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(f"Internal Error: {str(e)}".encode())
    
    def serve_latest_collection(self):
        """Serve the latest collection data"""
        latest_file = os.path.join(DATA_DIR, "latest_collection.json")
        
        if os.path.exists(latest_file):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            with open(latest_file, 'r') as f:
                data = f.read()
                self.wfile.write(data.encode())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Latest collection not found")
    
    def serve_status(self):
        """Serve server status"""
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        status = {
            "server": "AiiQ GPU Data Server",
            "timestamp": datetime.now().isoformat(),
            "data_directory": DATA_DIR,
            "collections": self.get_collection_count(),
            "latest_collection": self.get_latest_collection_time()
        }
        
        self.wfile.write(json.dumps(status, indent=2).encode())
    
    def serve_collection_file(self, filename):
        """Serve a specific collection file"""
        filepath = os.path.join(DATA_DIR, filename)
        
        if os.path.exists(filepath) and filename.endswith('.json'):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            with open(filepath, 'r') as f:
                data = f.read()
                self.wfile.write(data.encode())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Collection file not found")
    
    def get_collection_count(self):
        """Get count of collection files"""
        try:
            files = [f for f in os.listdir(DATA_DIR) if f.endswith('.json')]
            return len(files)
        except:
            return 0
    
    def get_latest_collection_time(self):
        """Get timestamp of latest collection"""
        try:
            latest_file = os.path.join(DATA_DIR, "latest_collection.json")
            if os.path.exists(latest_file):
                mtime = os.path.getmtime(latest_file)
                return datetime.fromtimestamp(mtime).isoformat()
        except:
            pass
        return "Unknown"
    
    def generate_status_page(self):
        """Generate HTML status page"""
        collections = self.get_collection_count()
        latest_time = self.get_latest_collection_time()
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>AiiQ GPU Data Server</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; background: #1a1a1a; color: #ffffff; }}
                .container {{ max-width: 800px; margin: 0 auto; }}
                .header {{ background: #2d2d2d; padding: 20px; border-radius: 10px; margin-bottom: 20px; }}
                .status {{ background: #2d2d2d; padding: 20px; border-radius: 10px; margin-bottom: 20px; }}
                .endpoints {{ background: #2d2d2d; padding: 20px; border-radius: 10px; }}
                .endpoint {{ background: #3d3d3d; padding: 15px; margin: 10px 0; border-radius: 5px; }}
                .endpoint a {{ color: #4CAF50; text-decoration: none; }}
                .endpoint a:hover {{ text-decoration: underline; }}
                .metric {{ display: inline-block; margin: 10px 20px 10px 0; }}
                .metric-value {{ font-size: 24px; font-weight: bold; color: #4CAF50; }}
                .metric-label {{ font-size: 12px; color: #888; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚀 AiiQ GPU Data Server</h1>
                    <p>Automated data collection from GPU-optimized Ollama models</p>
                </div>
                
                <div class="status">
                    <h2>📊 Server Status</h2>
                    <div class="metric">
                        <div class="metric-value">{collections}</div>
                        <div class="metric-label">Total Collections</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">{latest_time.split('T')[0] if latest_time != 'Unknown' else 'N/A'}</div>
                        <div class="metric-label">Latest Collection</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">Active</div>
                        <div class="metric-label">Server Status</div>
                    </div>
                </div>
                
                <div class="endpoints">
                    <h2>🔗 API Endpoints</h2>
                    <div class="endpoint">
                        <strong>Latest Collection:</strong> 
                        <a href="/latest_collection">/latest_collection</a>
                        <br><small>Get the most recent data collection</small>
                    </div>
                    <div class="endpoint">
                        <strong>Server Status:</strong> 
                        <a href="/status">/status</a>
                        <br><small>Get server and collection status</small>
                    </div>
                    <div class="endpoint">
                        <strong>Collection Files:</strong> 
                        <a href="/collection/filename.json">/collection/filename.json</a>
                        <br><small>Get specific collection files</small>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 40px; color: #888;">
                    <p>AiiQ pAIt Rating System - GPU Data Collection Server</p>
                    <p>Running on port {PORT}</p>
                </div>
            </div>
        </body>
        </html>
        """
        return html
    
    def log_message(self, format, *args):
        """Custom logging"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {format % args}")

def start_server():
    """Start the HTTP server"""
    try:
        server = HTTPServer(('0.0.0.0', PORT), DataHandler)
        print(f"🚀 AiiQ GPU Data Server starting on port {PORT}")
        print(f"📁 Serving data from: {DATA_DIR}")
        print(f"🌐 Access at: http://localhost:{PORT}")
        print("Press Ctrl+C to stop")
        
        server.serve_forever()
        
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")

if __name__ == "__main__":
    start_server()

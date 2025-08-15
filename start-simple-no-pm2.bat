@echo off
title AiiQ Platform - Simple Startup (No PM2)
color 0A

echo ========================================
echo    AiiQ Platform - Simple Startup
echo ========================================
echo.
echo Starting all services without PM2...
echo.

:: 1. Start Web App
echo 1. Starting Web App...
start "Web App (Port 3001)" cmd /k "cd /d %~dp0\apps\web && npm run dev -- -p 3001"
echo ✓ Web App started in new window
echo.

:: 2. Start Orchestrator API
echo 2. Starting Orchestrator API...
start "Orchestrator API (Port 8080)" cmd /k "cd /d %~dp0 && .venv\Scripts\activate.bat && set MARKETDATA_API_KEY=OGVVZDl0STdaS2dORThTWTczaGdxR2t2OTY5OFVQa2Z5dVYxOWR6SENROD0 && set MARKETDATA_BASE_URL=https://api.marketdata.app && set ALPHA_VANTAGE_API_KEY=4U0QGD3MBDA5X4AK && set DERIBIT_VERIFY_SSL=0 && set DISABLE_DERIBIT=0 && python -m uvicorn services.orchestrator.main:app --host 0.0.0.0 --port 8080"
echo ✓ Orchestrator API started in new window
echo.

:: 3. Start Strategy Engine
echo 3. Starting Strategy Engine...
start "Strategy Engine (Port 8788)" cmd /k "cd /d %~dp0 && .venv\Scripts\activate.bat && set OLLAMA_BASE_URL=http://localhost:11434 && set OLLAMA_MODEL=llama3.2:3b && python -m uvicorn services.ollama-strategy-engine.main:app --host 0.0.0.0 --port 8788"
echo ✓ Strategy Engine started in new window
echo.

echo ========================================
echo All services started!
echo ========================================
echo.
echo - Web App: http://localhost:3001
echo - Orchestrator API: http://localhost:8080  
echo - Strategy Engine: http://localhost:8788
echo.
echo Each service is running in its own window.
echo Close this window when ready.
echo ========================================
echo.
pause

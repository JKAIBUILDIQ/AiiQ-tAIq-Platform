@echo off
title AiiQ Platform - Clean Startup
color 0C

echo ========================================
echo    AiiQ Platform - Clean Startup
echo ========================================
echo.
echo Step 1: Killing any existing processes...
echo.

:: Kill any processes using our ports
echo Killing processes on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1

echo Killing processes on port 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /f /pid %%a >nul 2>&1

echo Killing processes on port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do taskkill /f /pid %%a >nul 2>&1

echo Killing processes on port 8787...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8787') do taskkill /f /pid %%a >nul 2>&1

echo Killing processes on port 8788...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8788') do taskkill /f /pid %%a >nul 2>&1

:: Kill all Node.js and Python processes to be safe
echo Killing all Node.js processes...
taskkill /f /im node.exe >nul 2>&1

echo Killing all Python processes...
taskkill /f /im python.exe >nul 2>&1

echo.
echo Step 2: Waiting for ports to be released...
timeout /t 3 /nobreak >nul

echo.
echo Step 3: Starting all services...
echo.

:: 1. Start Web App
echo 1. Starting Web App...
start "Web App (Port 3000)" cmd /k "cd /d %~dp0\apps\web && npm run dev"
echo ✓ Web App started in new window
echo.

:: 2. Start Orchestrator API
echo 2. Starting Orchestrator API...
start "Orchestrator API (Port 8080)" cmd /k "cd /d %~dp0 && .venv\Scripts\activate.bat && set ALPHA_VANTAGE_API_KEY=4U0QGD3MBDA5X4AK && set DERIBIT_VERIFY_SSL=0 && set DISABLE_DERIBIT=0 && python -m uvicorn services.orchestrator.main:app --host 0.0.0.0 --port 8080"
echo ✓ Orchestrator API started in new window
echo.

:: 3. Start Strategy Engine
echo 3. Starting Strategy Engine...
start "Strategy Engine (Port 8788)" cmd /k "cd /d %~dp0 && .venv\Scripts\activate.bat && set OLLAMA_BASE_URL=http://localhost:11434 && set OLLAMA_MODEL=llama3.1:8b && python -m uvicorn services.ollama-strategy-engine.main:app --host 0.0.0.0 --port 8788"
echo ✓ Strategy Engine started in new window
echo.

echo ========================================
echo All services started!
echo ========================================
echo.
echo - Web App: http://localhost:3000
echo - Orchestrator API: http://localhost:8080  
echo - Strategy Engine: http://localhost:8788
echo.
echo Each service is running in its own window.
echo Close this window when ready.
echo ========================================
echo.
pause


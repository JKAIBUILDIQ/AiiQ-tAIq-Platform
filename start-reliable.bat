@echo off
title AiiQ Platform - Smart Reliable Startup
color 0A

echo ========================================
echo    AiiQ Platform - Smart Startup
echo ========================================
echo.
echo Checking current service status...
echo.

:: Create logs directory if it doesn't exist
if not exist "logs" mkdir logs

:: Check current status before starting anything
echo Checking existing services...

:: Check Web App
echo Checking Web App (Port 3000)...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Web App (Port 3000): ALREADY RUNNING
) else (
    echo [X] Web App (Port 3000): NOT RESPONDING
)

:: Check Orchestrator
echo Checking Orchestrator (Port 8001)...
curl -s http://localhost:8001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Orchestrator (Port 8001): ALREADY RUNNING
) else (
    echo [X] Orchestrator (Port 8001): NOT RESPONDING
)

:: Check Strategy Engine
echo Checking Strategy Engine (Port 8787)...
curl -s http://localhost:8787/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Strategy Engine (Port 8787): ALREADY RUNNING
) else (
    echo [X] Strategy Engine (Port 8787): NOT RESPONDING
)

echo.

:: Clean up any conflicting processes
echo Cleaning up port conflicts...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing process %%a on port 3000
    taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8001 ^| findstr LISTENING') do (
    echo Killing process %%a on port 8001
    taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8787 ^| findstr LISTENING') do (
    echo Killing process %%a on port 8787
    taskkill /f /pid %%a >nul 2>&1
)

:: Wait for ports to be released
echo Waiting for ports to be released...
timeout /t 3 /nobreak >nul

:: Start services
echo.
echo Starting services...

echo Starting Web App (Port 3000)...
start /min "Web App" cmd /c "cd /d %~dp0\apps\web && npm run dev > %~dp0\logs\web.log 2>&1"
timeout /t 5 /nobreak >nul

echo Starting Orchestrator (Port 8001)...
start /min "Orchestrator" cmd /c "cd /d %~dp0 && .venv\Scripts\activate.bat && set PYTHONPATH=%~dp0 && set ALPHA_VANTAGE_API_KEY=4U0QGD3MBDA5X4AK && set DERIBIT_VERIFY_SSL=0 && set DISABLE_DERIBIT=0 && python -m uvicorn services.orchestrator.main:app --host 0.0.0.0 --port 8001 --reload > %~dp0\logs\orchestrator.log 2>&1"
timeout /t 8 /nobreak >nul

echo Starting Strategy Engine (Port 8787)...
start /min "Strategy Engine" cmd /c "cd /d %~dp0 && .venv\Scripts\activate.bat && set PYTHONPATH=%~dp0 && set OLLAMA_BASE_URL=http://localhost:11434 && set OLLAMA_MODEL=llama3.1:8b && python -m uvicorn services.ollama-strategy-engine.main:app --host 0.0.0.0 --port 8787 --reload > %~dp0\logs\strategy-engine.log 2>&1"
timeout /t 8 /nobreak >nul

:: Final health check
echo.
echo ========================================
echo Final Service Health Check...
echo ========================================

echo Checking Web App (Port 3000)...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Web App: RUNNING
) else (
    echo [X] Web App: NOT RESPONDING
)

echo Checking Orchestrator (Port 8001)...
curl -s http://localhost:8001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Orchestrator: RUNNING
) else (
    echo [X] Orchestrator: NOT RESPONDING
)

echo Checking Strategy Engine (Port 8787)...
curl -s http://localhost:8787/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Strategy Engine: RUNNING
) else (
    echo [X] Strategy Engine: NOT RESPONDING
)

echo.
echo ========================================
echo Startup Complete!
echo ========================================
echo.
echo - Web App: http://localhost:3000
echo - Orchestrator: http://localhost:8001
echo - Strategy Engine: http://localhost:8787
echo.
echo Services are running in minimized windows.
echo Check logs in the 'logs' folder for any issues.
echo.
echo To stop all services, run: stop-all.bat
echo ========================================
echo.
pause

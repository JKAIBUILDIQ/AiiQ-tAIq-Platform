@echo off
title AiiQ Platform - Simple Startup
color 0A

echo ========================================
echo    AiiQ Platform - Simple Startup
echo ========================================
echo.
echo Starting services...
echo.

:: Create logs directory
if not exist "logs" mkdir logs

:: Start Web App
echo Starting Web App (Port 3000)...
start /min "Web App" cmd /c "cd /d %~dp0\apps\web && npm run dev > %~dp0\logs\web.log 2>&1"
timeout /t 5 /nobreak >nul

:: Start Orchestrator
echo Starting Orchestrator (Port 8001)...
start /min "Orchestrator" cmd /c "cd /d %~dp0 && .venv\Scripts\activate.bat && set PYTHONPATH=%~dp0 && python -m uvicorn services.orchestrator.main:app --host 0.0.0.0 --port 8001 --reload > %~dp0\logs\orchestrator.log 2>&1"
timeout /t 8 /nobreak >nul

:: Start Strategy Engine
echo Starting Strategy Engine (Port 8787)...
start /min "Strategy Engine" cmd /c "cd /d %~dp0 && .venv\Scripts\activate.bat && set PYTHONPATH=%~dp0 && python -m uvicorn services.ollama-strategy-engine.main:app --host 0.0.0.0 --port 8787 --reload > %~dp0\logs\strategy-engine.log 2>&1"
timeout /t 8 /nobreak >nul

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo - Web App: http://localhost:3000
echo - Orchestrator: http://localhost:8001
echo - Strategy Engine: http://localhost:8787
echo.
echo Check logs in the 'logs' folder.
echo ========================================
echo.
pause

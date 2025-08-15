@echo off
title AiiQ Platform - Start Orchestrator Only
color 0E

echo ========================================
echo    Starting Orchestrator API Only
echo ========================================
echo.

echo Starting Orchestrator API...
echo Port: 8080
echo.

cd /d "%~dp0"
call .venv\Scripts\activate.bat

set MARKETDATA_API_KEY=OGVVZDl0STdaS2dORThTWTczaGdxR2t2OTY5OFVQa2Z5dVYxOWR6SENROD0
set MARKETDATA_BASE_URL=https://api.marketdata.app
set DERIBIT_VERIFY_SSL=0
set DISABLE_DERIBIT=0

echo Environment variables set.
echo Starting uvicorn...
echo.

python -m uvicorn services.orchestrator.main:app --host 0.0.0.0 --port 8080

echo.
echo Orchestrator stopped.
pause

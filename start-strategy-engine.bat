@echo off
title Strategy Engine (Port 8787)
color 0A
echo ========================================
echo    Starting Strategy Engine
echo ========================================
echo Port: 8788
echo.

cd /d "%~dp0"
call .venv\Scripts\activate.bat

set OLLAMA_BASE_URL=http://localhost:11434
set OLLAMA_MODEL=llama3.1:8b

echo Environment variables set.
echo Starting uvicorn...
python -m uvicorn services.ollama-strategy-engine.main:app --host 0.0.0.0 --port 8788

pause

@echo off
title AiiQ Platform - Service Status Check
color 0B

echo ========================================
echo    AiiQ Platform - Service Status
echo ========================================
echo.
echo Checking all services...
echo.

:: Check Web App
echo [1/3] Checking Web App (Port 3000)...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Web App: RUNNING - http://localhost:3000
) else (
    echo ✗ Web App: NOT RESPONDING
)

:: Check Orchestrator
echo [2/3] Checking Orchestrator (Port 8001)...
curl -s http://localhost:8001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Orchestrator: RUNNING - http://localhost:8001
) else (
    echo ✗ Orchestrator: NOT RESPONDING
)

:: Check Strategy Engine
echo [3/3] Checking Strategy Engine (Port 8787)...
curl -s http://localhost:8787/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Strategy Engine: RUNNING - http://localhost:8787
) else (
    echo ✗ Strategy Engine: NOT RESPONDING
)

echo.
echo ========================================
echo GPU Data Collection (Remote)
echo ========================================
echo Checking remote GPU server...
curl -s http://146.190.188.208:8080/status >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ GPU Server: RUNNING - http://146.190.188.208:8080
) else (
    echo ✗ GPU Server: NOT RESPONDING
)

echo.
echo ========================================
echo Summary
echo ========================================
echo.
echo Local Services:
echo - Web App: %errorlevel% equ 0 ? "RUNNING" : "NOT RESPONDING"
echo - Orchestrator: %errorlevel% equ 0 ? "RUNNING" : "NOT RESPONDING"  
echo - Strategy Engine: %errorlevel% equ 0 ? "RUNNING" : "NOT RESPONDING"
echo.
echo Remote Services:
echo - GPU Data Collection: %errorlevel% equ 0 ? "RUNNING" : "NOT RESPONDING"
echo.
echo ========================================
echo.
echo Commands:
echo - To restart services: start-reliable.bat
echo - To stop services: stop-all.bat
echo - To check status again: check-status.bat
echo ========================================
echo.
pause

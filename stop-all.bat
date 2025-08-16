@echo off
title AiiQ Platform - Stop All Services
color 0C

echo ========================================
echo    AiiQ Platform - Stop All Services
echo ========================================
echo.
echo Stopping all services...

:: Kill processes on our ports
echo Stopping Web App (Port 3000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1

echo Stopping Orchestrator (Port 8001)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8001') do taskkill /f /pid %%a >nul 2>&1

echo Stopping Strategy Engine (Port 8787)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8787') do taskkill /f /pid %%a >nul 2>&1

:: Kill any remaining Python processes related to our services
echo Cleaning up Python processes...
taskkill /f /im python.exe >nul 2>&1

:: Kill any remaining Node processes related to our services
echo Cleaning up Node processes...
taskkill /f /im node.exe >nul 2>&1

echo.
echo ========================================
echo All services stopped!
echo ========================================
echo.
echo To restart, run: start-reliable.bat
echo.
pause

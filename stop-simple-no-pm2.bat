@echo off
title AiiQ Platform - Stop All Services (No PM2)
color 0C

echo ========================================
echo    AiiQ Platform - Stop All Services
echo ========================================
echo.

echo Stopping all services...
echo.

:: Stop Node.js processes (Web App)
echo 1. Stopping Web App (Node.js)...
taskkill /f /im node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✓ Web App stopped
) else (
    echo ✓ No Node.js processes found
)
echo.

:: Stop Python processes (Orchestrator & Strategy Engine)
echo 2. Stopping Python services...
taskkill /f /im python.exe 2>nul
if %errorlevel% equ 0 (
    echo ✓ Python services stopped
) else (
    echo ✓ No Python processes found
)
echo.

echo ========================================
echo All services stopped!
echo ========================================
echo.
echo You can now close any remaining terminal windows.
echo.
pause


@echo off
title Web App (Port 3001)
color 0B
echo ========================================
echo    Starting Web App
echo ========================================
echo Port: 3001
echo.

cd /d "%~dp0\apps\web"

echo Starting Next.js development server...
npm run dev

pause


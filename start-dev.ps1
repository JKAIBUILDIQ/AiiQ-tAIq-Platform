# AiiQ_tAIq Development Startup Script
# This script sets up and starts the development environment

Write-Host "🚀 Starting AiiQ_tAIq Development Environment..." -ForegroundColor Green

# Ensure portable Node (no admin required)
$portableNode = Join-Path $PSScriptRoot 'nodejs-portable\node-v20.10.0-win-x64'
if (Test-Path $portableNode) {
    $env:PATH = "$portableNode;$env:PATH"
    try { setx PATH "$portableNode;$([Environment]::GetEnvironmentVariable('Path','User'))" | Out-Null } catch {}
    Write-Host "✅ Using portable Node at: $portableNode" -ForegroundColor Green
}

# Enable Corepack-managed pnpm to avoid global script PATH issues
& node -v | Out-Null
corepack enable | Out-Null
corepack prepare pnpm@10.14.0 --activate | Out-Null

# Verify pnpm via Corepack
try { corepack pnpm --version | Out-Null } catch {
    Write-Host "❌ pnpm (via Corepack) not available" -ForegroundColor Red
    exit 1
}

# Check if Python is installed
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Python is not installed. Please install Python 3.11+" -ForegroundColor Red
    exit 1
}

# Check if Docker is running
try {
    docker version | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker is not running. Starting Docker..." -ForegroundColor Yellow
    Start-Process "Docker Desktop"
    Start-Sleep -Seconds 10
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
corepack pnpm install

# Copy environment file if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Blue
    Copy-Item "env.example" ".env"
    Write-Host "⚠️  Please edit .env file with your API keys before continuing" -ForegroundColor Yellow
    Write-Host "Press any key to continue..." -ForegroundColor Cyan
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Start development environment
Write-Host "🚀 Starting development environment..." -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Solana Adapter: http://localhost:7070" -ForegroundColor Cyan

# Start all services (monorepo)
Write-Host "🟢 Launching services..." -ForegroundColor Green
corepack pnpm run dev

/**
 * PM2 ecosystem for AiiQ_tAIq
 * Place this at: ./ecosystem.config.js
 */
const fs = require('fs')
const path = require('path')
const isWin = process.platform === 'win32'
const venvPythonCandidate = isWin ? '.\\.venv\\Scripts\\python.exe' : './.venv/bin/python'
const systemPython = isWin ? 'python' : 'python3'
const venvPython = fs.existsSync(path.resolve(venvPythonCandidate)) ? venvPythonCandidate : systemPython

module.exports = {
  apps: [
    // ───────────────────────────────
    // 1) Next.js Web (Dashboard)
    // ───────────────────────────────
    {
      name: 'aiiq-web',
      cwd: 'apps/web',
      script: 'node',
      args: 'node_modules/next/dist/bin/next start -p 3000',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
      },
      watch: false,
      max_memory_restart: '512M',
      autorestart: true,
      time: true,
    },

    // ───────────────────────────────
    // 2) Orchestrator API (FastAPI)
    // ───────────────────────────────
    {
      name: 'orchestrator-api',
      cwd: 'services/orchestrator',
      script: venvPython,
      args: '-m uvicorn main:app --host 0.0.0.0 --port 8080 --reload',
      env: {
        NODE_ENV: 'development',
        PORT: '8080',
      },
      watch: false,
      max_memory_restart: '512M',
      autorestart: true,
      time: true,
    },

    // ───────────────────────────────
    // 3) Solana Adapter (Node/TS)
    // ───────────────────────────────
    {
      name: 'solana-adapter',
      cwd: 'services/solana-adapter',
      script: 'pnpm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: '7070',
      },
      watch: false,
      max_memory_restart: '512M',
      autorestart: true,
      time: true,
    },

    // ───────────────────────────────
    // 4) Ollama Strategy Engine (FastAPI)
    // ───────────────────────────────
    {
      name: 'strategy-engine',
      cwd: 'services/ollama-strategy-engine',
      script: venvPython,
      args: '-m uvicorn main:app --host 0.0.0.0 --port 8787 --reload',
      env: {
        NODE_ENV: 'development',
        PORT: '8787',
      },
      watch: false,
      max_memory_restart: '512M',
      autorestart: true,
      time: true,
    },
  ],
};
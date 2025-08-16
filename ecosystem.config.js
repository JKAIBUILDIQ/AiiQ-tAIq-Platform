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
    {
      name: 'aiiq-web',
      script: 'npm',
      args: 'run dev',
      cwd: './apps/web',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/web-error.log',
      out_file: './logs/web-out.log',
      log_file: './logs/web-combined.log',
      time: true
    },
    {
      name: 'aiiq-orchestrator',
      script: 'python',
      args: '-m uvicorn services.orchestrator.main:app --host 0.0.0.0 --port 8000 --reload',
      cwd: './',
      env: {
        PYTHONPATH: './',
        ALPHA_VANTAGE_API_KEY: '4U0QGD3MBDA5X4AK',
        DERIBIT_VERIFY_SSL: '0',
        DISABLE_DERIBIT: '0'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/orchestrator-error.log',
      out_file: './logs/orchestrator-out.log',
      log_file: './logs/orchestrator-combined.log',
      time: true
    },
    {
      name: 'aiiq-strategy-engine',
      script: 'python',
      args: '-m uvicorn services.ollama-strategy-engine.main:app --host 0.0.0.0 --port 8787 --reload',
      cwd: './',
      env: {
        PYTHONPATH: './',
        OLLAMA_BASE_URL: 'http://localhost:11434',
        OLLAMA_MODEL: 'llama3.1:8b'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/strategy-engine-error.log',
      out_file: './logs/strategy-engine-out.log',
      log_file: './logs/strategy-engine-combined.log',
      time: true
    }
  ]
};
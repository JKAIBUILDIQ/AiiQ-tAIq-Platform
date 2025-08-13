/**
 * PM2 ecosystem for AiiQ_tAIq
 * Place this at: ./ecosystem.config.js
 */
module.exports = {
  apps: [
    // ───────────────────────────────
    // 1) Next.js Web (Dashboard)
    // ───────────────────────────────
    {
      name: 'aiiq-web',
      cwd: 'apps/web',
      script: 'bash',
      args: '-lc "pnpm run start"',             // production: next build && next start
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
        // PUBLIC ENDPOINTS
        NEXT_PUBLIC_ORCHESTRATOR_URL: 'http://127.0.0.1:8001',
      },
      env_development: {
        NODE_ENV: 'development',
        // run `pnpm dev` in dev
        args: '-lc "pnpm run dev"',
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
      script: 'bash',
      // Uses repo-level .venv if present; otherwise system python
      args: "-lc '[[ -d \"../../.venv\" ]] && source ../../.venv/bin/activate; uvicorn main:app --host 0.0.0.0 --port 8080'",
      env: {
        NODE_ENV: 'production',
        PORT: '8080',
      },
      env_development: {
        NODE_ENV: 'development',
        args: '-lc "pnpm run dev"',
      },
      watch: false,
      max_memory_restart: '512M',
      autorestart: true,
      time: true,
    },
  ],
};
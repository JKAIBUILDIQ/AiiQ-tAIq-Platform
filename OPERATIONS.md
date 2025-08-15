AiiQ_tAIq Ops Guide
Securely connect real-time data + enforce risk controls.
This guide is for operators managing infra, credentials, and data flows.
1. 🧾 Credential Setup
.env in repo root (never commit)

DERIBIT_CLIENT_ID=...
DERIBIT_CLIENT_SECRET=...

HELIUS_RPC_URL=https://...

CLAUDIA_BASE_URL=http://127.0.0.1:8000

2. 🚀 Boot Up Services

Start full stack:

pnpm dev

Or separately:

pnpm --filter @aiiq-taiq/orchestrator dev
pnpm --filter @aiiq-taiq/solana-adapter dev
pnpm --filter @aiiq-taiq/web dev

3. ✅ Validate Data Flow

Check health:

curl http://localhost:8080/health

Verify endpoints:

    GET /symbols returns BTC/ETH/SOL

    UI loads at http://localhost:3000/options

    Options chain appears after expiry selected

4. ⚖️ Set Risk Controls

In UI → Risk Dashboard:

    Max per-trade loss: 1%

    Portfolio VaR (95%, 1d): <= 5%

    Leverage caps by asset class

5. 🐳 Optional: PM2 Local Prod

pm2 start infra/pm2/aiiq-ecosystem.config.js --only orchestrator,web,solana
pm2 save

6. 🛡️ Security Practices

    .env is in .gitignore

    Keys use least privilege (read/trade split)

    Rotate credentials quarterly

    No tokens/PII in logs (LOG_LEVEL=info)

    Force HTTPS in deploys

7. 🧩 Troubleshooting
Problem	Check
No chain data?	Deribit keys + internet
No Solana?	HELIUS_RPC_URL + slot
Blank UI?	DevTools → fix wide element
8. 🔁 Handoffs

Operators provide:

    Scoped API keys (confirmed)

    Target assets + expiries

    Risk presets

Engineers wire streaming + normalize chain payloads.
9. 🔧 .env.example (in root)

DERIBIT_CLIENT_ID=
DERIBIT_CLIENT_SECRET=
HELIUS_RPC_URL=
CLAUDIA_BASE_URL=http://127.0.0.1:8000

✅ Final Step

git add README.md OPERATIONS.md .env.example
git commit -m "docs: split builder/operator + env template"
git push origin main
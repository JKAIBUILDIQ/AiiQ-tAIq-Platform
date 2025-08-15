AiiQ_tAIq
Trading Quant Wrapped Around AI — A modular, AI-powered quant trading and analytics platform.
Built for engineers prototyping rapidly, integrating AI/LLMs, and shipping real-time systems.
🚀 Vision

AiiQ_tAIq merges quant precision with adaptive AI.
This builder repo supports:

    AI-assisted strategy R&D

    Market data ingestion + analytics

    Real-time options execution

    Safe-by-default risk handling

    Transparent performance tracking

🧠 Stack Overview

    Frontend: Next.js 14 + Tailwind + Zustand

    Backend: FastAPI with WebSocket streaming

    Math/Greeks: TypeScript utils in core-math/

    Solana Adapter: WebSocket via Helius → orchestrator

    Shared UI: packages/ui

    Infrastructure: PM2 + Docker for fullstack dev

🗂️ Monorepo Layout

AiiQ_tAIq/
├── apps/
│   └── web/                # Next.js UI
├── services/
│   ├── orchestrator/       # FastAPI backend
│   └── solana-adapter/     # Solana on-chain integration
├── packages/
│   ├── core-math/          # Greeks, IV, PnL, payoff logic
│   └── ui/                 # Shared components (e.g., ChainTable)
├── infra/
│   ├── docker/             # Docker configs
│   └── pm2/                # PM2 ecosystem

⚙️ Developer Quickstart
Prerequisites

    Node.js 18+ with pnpm

    Python 3.11+

    Docker + Compose (for fullstack/devops)

Setup

git clone https://github.com/JKAIBUILDIQ/AiiQ-tAIq.git
cd AiiQ-tAIq
pnpm install

Environment Config

cp .env.example .env
# Fill in API keys (see OPERATIONS.md for key setup)

Start Dev Environment

pnpm dev  # boots web, orchestrator, solana-adapter

Or individual services:

pnpm --filter @aiiq-taiq/web dev
pnpm --filter @aiiq-taiq/orchestrator dev
pnpm --filter @aiiq-taiq/solana-adapter dev

Docker Mode

pnpm docker:dev
pnpm docker:down

🧪 Testing + Lint

pnpm test             # run unit tests
pnpm lint             # lint TS
pnpm format           # prettier autoformat

🔌 Key API Routes
Orchestrator

    GET /health → {status: "ok"}

    GET /symbols → asset universe

    GET /chart/{symbol} → OHLCV series

    GET /options/chain?underlying=BTC&exp=YYYY-MM-DD

    WS /ws/stream → ticks (price, IV, greeks)

    POST /paper/order → paper trade execution

    GET /paper/portfolio → portfolio snapshot

Solana Adapter

    Connects via Helius WS

    Streams Zeta and PsyOptions data

    Pipes into orchestrator

📐 Style + Branding

    Primary Color: Rose #FF6B9D

    Secondary: Cyber #00FFFF

    Typography:

        Orbitron (Headings)

        Inter (Body)

        JetBrains Mono (Code)

📍 Dev Roadmap (Builder Scope)

    ✅ Monorepo + base UI/backend

    ✅ FastAPI streaming endpoints

    ⏳ Options chain integration (Deribit, Solana)

    ⏳ WebSocket + Paper engine

    ⏳ Risk + IV surface + AI agents

📜 Contributing

    Follow TypeScript + FastAPI best practices

    80%+ test coverage on core-math

    Use semantic commits

    Keep .env private
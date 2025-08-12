# AiiQ_tAIq
**Trading Quant Wrapped Around AI** — A modular, AI-powered quant trading and analytics platform.  
Designed for rapid strategy prototyping, risk management, and real-time execution in equities, options, and crypto.

---

## 🚀 Vision
AiiQ_tAIq is built to merge the **precision of quantitative finance** with **adaptive AI inference**.  
It serves as the foundation for:
- AI-assisted strategy research
- Real-time market analytics
- Automated execution with risk control
- Transparent performance tracking
- pAIt logic scoring and handler rating

---

## 🎯 Core Objectives
- **Speed**: Low-latency data ingestion and strategy execution.
- **Modularity**: Swap components (data source, model, broker) without rewriting the stack.
- **Transparency**: All decisions traceable for compliance and pAIt ratings.
- **Multi-Market**: Support for equities, options, and crypto from day one.
- **Scalable AI**: Connect local LLMs (Ollama), cloud inference, or specialized quant models.

---

## 🏗️ Architecture

### Monorepo Structure
```
AiiQ_tAIq/
├── apps/
│   └── web/                      # Next.js 14 frontend
├── packages/
│   ├── core-math/                # Greeks, IV, PnL calculations
│   └── ui/                       # Shared UI components
├── services/
│   ├── orchestrator/             # FastAPI backend
│   └── solana-adapter/           # Solana on-chain data
├── infra/
│   ├── docker/                   # Docker configurations
│   └── pm2/                      # PM2 process management
└── Public/                       # Assets and branding
```

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python), WebSocket streaming
- **Blockchain**: Solana integration via Helius RPC
- **Data**: Deribit options, real-time market feeds
- **State**: Zustand, real-time updates
- **Charts**: TradingView-style with lightweight-charts

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.11+
- Docker and Docker Compose

### 1. Clone and Setup
```bash
git clone https://github.com/JKAIBUILDIQ/AiiQ-tAIq.git
cd AiiQ-tAIq
```

### 2. Install Dependencies
```bash
# Install root dependencies
pnpm install

# Install all workspace dependencies
pnpm setup
```

### 3. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit .env with your API keys
# - Helius RPC for Solana
# - Deribit API (optional)
# - Claudia API (optional)
```

### 4. Start Development
```bash
# Start all services
pnpm dev

# Or start individual services
pnpm --filter @aiiq-taiq/web dev          # Frontend (port 3000)
pnpm --filter @aiiq-taiq/orchestrator dev # Backend (port 8080)
pnpm --filter @aiiq-taiq/solana-adapter dev # Solana (port 7070)
```

### 5. Docker Development
```bash
# Start all services with Docker
pnpm docker:dev

# Stop services
pnpm docker:down
```

---

## 📊 Features

### Trading Interface
- **Real-time Charts**: OHLCV with technical indicators
- **Options Chain**: Greeks, IV surface, bid/ask spreads
- **Strategy Builder**: Multi-leg options strategies
- **Portfolio Management**: Position tracking, P&L, risk metrics

### Risk Management
- **VaR Calculations**: Portfolio Value at Risk
- **Position Limits**: Configurable risk policies
- **Greeks Aggregation**: Portfolio-level risk metrics
- **Real-time Monitoring**: Live risk dashboard

### Data Sources
- **Deribit**: BTC/ETH options chains and real-time data
- **Solana**: Zeta and PsyOptions on-chain markets
- **WebSocket Streaming**: Live price and Greeks updates
- **Historical Data**: Backtesting and analysis

---

## 🔧 Development

### Available Scripts
```bash
pnpm dev          # Start all services
pnpm build        # Build all packages
pnpm test         # Run tests
pnpm lint         # Lint code
pnpm format       # Format code
pnpm docker:dev   # Start Docker services
```

### Service Endpoints

#### Orchestrator (FastAPI)
- `GET /health` - Health check
- `GET /symbols` - Available instruments
- `GET /chart/{symbol}` - OHLCV data
- `GET /options/chain` - Options chain
- `WS /ws/stream` - Real-time market data
- `POST /paper/order` - Paper trading
- `GET /paper/portfolio` - Portfolio status

#### Solana Adapter
- Connects to Helius RPC
- Streams Zeta/PsyOptions data
- Forwards to orchestrator via WebSocket

---

## 🎨 Design System

### AiiQ Brand Colors
- **Primary**: Rose (#FF6B9D)
- **Secondary**: Cyber (#00FFFF) 
- **Accent**: Gold (#FFD700)
- **Success**: Green (#00FF88)
- **Warning**: Orange (#FFAA00)
- **Danger**: Red (#FF4444)

### Typography
- **Display**: Orbitron (headings)
- **Body**: Inter (main text)
- **Mono**: JetBrains Mono (code/data)

---

## 📈 Roadmap

### M1 (48h) - Foundation ✅
- [x] Monorepo setup with pnpm workspaces
- [x] Next.js 14 frontend with AiiQ branding
- [x] FastAPI orchestrator service
- [x] Basic trading interface components
- [x] Docker development environment

### M2 (72h) - Core Features
- [ ] WebSocket streaming from Deribit
- [ ] Paper trading engine
- [ ] Portfolio management
- [ ] Risk limit enforcement

### M3 (1 week) - Advanced Features
- [ ] Solana wallet integration
- [ ] Strategy builder with payoff charts
- [ ] IV surface visualization
- [ ] Backtesting framework

### M4 (Stretch) - AI Integration
- [ ] AI-powered strategy suggestions
- [ ] Market sentiment analysis
- [ ] Automated risk alerts
- [ ] Performance analytics

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and ensure coverage >80%
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Maintain 80%+ test coverage on math modules
- Use conventional commit messages
- Update documentation for new features

---

## 📄 License

This project is proprietary and confidential. All rights reserved by AiiQ_tAIq.

---

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/JKAIBUILDIQ/AiiQ-tAIq/wiki)
- **Issues**: [GitHub Issues](https://github.com/JKAIBUILDIQ/AiiQ-tAIq/issues)
- **Discussions**: [GitHub Discussions](https://github.com/JKAIBUILDIQ/AiiQ-tAIq/discussions)

---

## 🔗 Links

- **Website**: [aiiq.cloud](https://aiiq.cloud)
- **Development**: [aiiq.dev](https://aiiq.dev)
- **Documentation**: [docs.aiiq.cloud](https://docs.aiiq.cloud)

---

*Built with ❤️ by the AiiQ_tAIq team*

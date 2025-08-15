# 🧾 Options Chain Schema — `docs/chain.md`

This document defines the API payload structure for the options chain endpoint:

GET /options/chain?underlying=BTC&exp=YYYY-MM-DD


Returns a structured grid of options contracts for a given underlying and expiry.

---

## 🔧 Parameters

| Param       | Type     | Required | Description                         |
|------------|----------|----------|-------------------------------------|
| `underlying` | `string` | ✅       | Ticker symbol (e.g., `BTC`, `ETH`) |
| `exp`        | `string` | ✅       | Expiry date (`YYYY-MM-DD`)         |

---

## 📦 Payload Schema

```ts
{
  underlying: "BTC",
  expiry: "2025-08-30",
  strikes: number[],
  calls: OptionContract[],
  puts: OptionContract[]
}

OptionContract type

interface OptionContract {
  symbol: string;              // e.g. BTC-30AUG25-45000-C
  strike: number;              // Strike price
  type: "call" | "put";        // Option type
  bid: number | null;          // Best bid (null if unavailable)
  ask: number | null;          // Best ask (null if unavailable)
  iv: number | null;           // Implied volatility (0.0–1.0)
  delta?: number;              // Optional greeks
  gamma?: number;
  vega?: number;
  theta?: number;
  rho?: number;
  volume?: number;            // Recent 24h volume
  openInterest?: number;      // Outstanding OI
  mark?: number;              // Midpoint price
  updated: string;            // ISO timestamp
}

🌍 Exchange Variants
Deribit

    Symbols follow: BTC-30AUG25-45000-C

    Data source: REST + WebSocket

    Greeks available: ✅

    iv and mark computed from Deribit mark price feed

Solana (Zeta/PsyOptions)

    Symbols follow: ZETA:BTC/45000/2025-08-30/C

    Greeks optional (experimental)

    Volume and OI may be null for illiquid contracts

    IV computed from oracle or AMM curve

📌 Example Response

{
  "underlying": "BTC",
  "expiry": "2025-08-30",
  "strikes": [44000, 45000, 46000],
  "calls": [
    {
      "symbol": "BTC-30AUG25-44000-C",
      "strike": 44000,
      "type": "call",
      "bid": 1240.5,
      "ask": 1260.3,
      "iv": 0.5123,
      "delta": 0.68,
      "gamma": 0.021,
      "vega": 8.12,
      "theta": -5.34,
      "mark": 1250.4,
      "volume": 101,
      "openInterest": 732,
      "updated": "2025-08-13T18:00:00Z"
    },
    ...
  ],
  "puts": [
    {
      "symbol": "BTC-30AUG25-44000-P",
      "strike": 44000,
      "type": "put",
      "bid": 920.1,
      "ask": 940.9,
      "iv": 0.5098,
      "delta": -0.31,
      "gamma": 0.017,
      "vega": 7.54,
      "theta": -4.22,
      "mark": 930.5,
      "volume": 86,
      "openInterest": 512,
      "updated": "2025-08-13T18:00:00Z"
    },
    ...
  ]
}

📊 Notes

    Contracts sorted by strike ascending.

    If bid/ask are missing, fallback to mark.

    Greeks may be null for low-liquidity options or missing data.

    Backend auto-refreshes every 3–5s depending on source.

🛠️ Dev Notes

    Normalize all timestamps to UTC ISO strings

    All monetary values in base asset currency (e.g. USD for BTC)

    Missing values should be explicit null, not undefined

Version: 1.0 – Last updated: 2025-08-13


---

Let me know if you'd like to generate an **image diagram** of this schema for your internal wik
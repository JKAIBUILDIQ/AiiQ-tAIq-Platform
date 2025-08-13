'use client'

import React, { useMemo, useState } from 'react'

type Ticker = { symbol: string; name: string; price: number; changePct: number; volumeUsd?: number }

type MarketKey = 'Crypto' | 'Indices' | 'Stocks' | 'Futures' | 'Forex'

const MOCK_MARKETS: Record<MarketKey, Ticker[]> = {
  Crypto: [
    { symbol: 'BTC', name: 'Bitcoin', price: 69250.43, changePct: -0.73, volumeUsd: 28500000000 },
    { symbol: 'ETH', name: 'Ethereum', price: 3573.19, changePct: -0.38, volumeUsd: 14500000000 },
    { symbol: 'USDT', name: 'Tether', price: 0.99988, changePct: 0.00, volumeUsd: 52000000000 },
    { symbol: 'BNB', name: 'Binance Coin', price: 829.16, changePct: -0.40, volumeUsd: 2100000000 },
    { symbol: 'XRP', name: 'XRP', price: 3.2103, changePct: -1.75, volumeUsd: 3800000000 },
  ],
  Indices: [
    { symbol: 'SPX', name: 'S&P 500', price: 6445.75, changePct: 1.13, volumeUsd: 0 },
    { symbol: 'NDX', name: 'Nasdaq 100', price: 23839.2, changePct: 1.33, volumeUsd: 0 },
    { symbol: 'DJI', name: 'Dow 30', price: 44458.62, changePct: 1.10, volumeUsd: 0 },
    { symbol: 'NKY', name: 'Japan 225', price: 43288.39, changePct: 1.33, volumeUsd: 0 },
  ],
  Stocks: [
    { symbol: 'NVDA', name: 'NVIDIA', price: 131.02, changePct: 2.45, volumeUsd: 34000000000 },
    { symbol: 'MSFT', name: 'Microsoft', price: 423.51, changePct: -0.28, volumeUsd: 12000000000 },
    { symbol: 'AAPL', name: 'Apple', price: 197.62, changePct: 0.65, volumeUsd: 9800000000 },
    { symbol: 'TSLA', name: 'Tesla', price: 268.33, changePct: -1.92, volumeUsd: 18000000000 },
  ],
  Futures: [
    { symbol: 'ES', name: 'S&P 500 Futures', price: 6460.25, changePct: 0.95 },
    { symbol: 'NQ', name: 'Nasdaq 100 Futures', price: 23915.5, changePct: 1.12 },
    { symbol: 'CL', name: 'Crude Oil', price: 81.43, changePct: -0.22 },
  ],
  Forex: [
    { symbol: 'EURUSD', name: 'Euro / U.S. Dollar', price: 1.0851, changePct: 0.12 },
    { symbol: 'USDJPY', name: 'U.S. Dollar / Japanese Yen', price: 155.43, changePct: -0.08 },
    { symbol: 'GBPUSD', name: 'British Pound / U.S. Dollar', price: 1.2744, changePct: 0.21 },
  ],
}

const CATEGORY_LIST: Array<{ group?: string; key?: MarketKey; label: string }> = [
  { label: 'Entire world' },
  { label: 'Countries' },
  { label: 'News' },
  { label: 'ASSETS' },
  { key: 'Indices', label: 'Indices' },
  { key: 'Stocks', label: 'Stocks' },
  { key: 'Crypto', label: 'Crypto' },
  { key: 'Futures', label: 'Futures' },
  { key: 'Forex', label: 'Forex' },
]

export default function MarketsOverview() {
  const [active, setActive] = useState<MarketKey>('Crypto')

  const movers = useMemo(() => {
    const list = [...(MOCK_MARKETS[active] || [])]
    const mostActive = [...list].sort((a, b) => (b.volumeUsd || 0) - (a.volumeUsd || 0)).slice(0, 3)
    const topGainers = [...list].sort((a, b) => b.changePct - a.changePct).slice(0, 3)
    const topLosers = [...list].sort((a, b) => a.changePct - b.changePct).slice(0, 3)
    return { mostActive, topGainers, topLosers }
  }, [active])

  return (
    <div className="aiiq-tile p-0 overflow-hidden">
      <div className="grid grid-cols-12">
        {/* Left rail categories (hide ticker bar redundancy; focused on navigation only) */}
        <div className="col-span-3 border-r border-aiiq-light/30 bg-black/30">
          <div className="px-3 py-2 text-xs text-gray-400">Markets</div>
          <div className="flex flex-col">
            {CATEGORY_LIST.map((c, idx) => (
              <button
                key={idx}
                className={`flex items-center justify-between w-full px-4 py-2 text-left text-sm ${
                  c.key === active ? 'bg-aiiq-rose/20 text-white' : 'text-gray-300 hover:bg-aiiq-light/40'
                } ${c.key ? '' : 'cursor-default'}`}
                onClick={() => c.key && setActive(c.key)}
                disabled={!c.key}
              >
                <span>{c.label}</span>
                {c.key && <span className="hidden md:inline text-xs text-gray-400">›</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Middle quick links */}
        <div className="col-span-4 border-r border-aiiq-light/30 bg-black/20 p-4 space-y-3">
          <div className="text-sm text-gray-400">Overview</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              'Market cap charts',
              'Dominance chart',
              'All assets',
              'Top gainers',
              'Top losers',
              'Most traded',
              'Large-cap',
              'Most active',
            ].map((i) => (
              <div key={i} className="px-3 py-2 rounded-lg bg-aiiq-dark/60 border border-aiiq-light/30 text-gray-300">
                {i}
              </div>
            ))}
          </div>
        </div>

        {/* Right movers panel */}
        <div className="col-span-5 p-4 space-y-4">
          <Section title="Most active">
            {movers.mostActive.map((t) => (
              <TickerCard key={t.symbol} t={t} highlight="active" />
            ))}
          </Section>
          <div className="grid grid-cols-2 gap-4">
            <Section title="Top gainers">
              {movers.topGainers.map((t) => (
                <TickerCard key={t.symbol} t={t} />
              ))}
            </Section>
            <Section title="Top losers">
              {movers.topLosers.map((t) => (
                <TickerCard key={t.symbol} t={t} />
              ))}
            </Section>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm text-gray-400 mb-2">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function TickerCard({ t, highlight }: { t: Ticker; highlight?: 'active' }) {
  const changeColor = t.changePct > 0 ? 'text-aiiq-success' : t.changePct < 0 ? 'text-aiiq-danger' : 'text-gray-300'
  return (
    <div className="flex items-center justify-between rounded-xl border border-aiiq-light/30 bg-black/40 px-3 py-2">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-aiiq-light/40 grid place-items-center text-xs font-semibold">
          {t.symbol}
        </div>
        <div>
          <div className="text-sm text-white">{t.name}</div>
          <div className="text-[11px] text-gray-400">{t.symbol}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm text-white">{formatPrice(t.price)}</div>
        <div className={`text-xs ${changeColor}`}>{t.changePct.toFixed(2)}%</div>
      </div>
      {highlight === 'active' && (
        <span className="ml-3 px-2 py-0.5 rounded-full text-[10px] bg-aiiq-cyber text-aiiq-dark">Most active</span>
      )}
    </div>
  )
}

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString(undefined, { maximumFractionDigits: 2 })
  if (price >= 1) return price.toFixed(2)
  return price.toFixed(5)
}



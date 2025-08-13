'use client'

import { useEffect, useState } from 'react'
import { formatCurrency, getChangeColor, formatPercentage } from '@/lib/utils'

type Ticker = { symbol: string; price: number; changePct: number }

const initial: Ticker[] = [
  { symbol: 'BTC', price: 43250.5, changePct: 0.0298 },
  { symbol: 'ETH', price: 2650.25, changePct: -0.0170 },
  { symbol: 'SOL', price: 98.75, changePct: 0.0342 },
  { symbol: 'IV', price: 0.612, changePct: -0.006 },
]

export function TickerRow() {
  const [tickers, setTickers] = useState<Ticker[]>(initial)

  useEffect(() => {
    const id = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => {
          const delta = (Math.random() - 0.5) * 0.004
          return { ...t, price: +(t.price * (1 + delta)).toFixed(2), changePct: +(t.changePct + delta).toFixed(4) }
        }),
      )
    }, 1500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="aiiq-tile aiiq-aura w-full overflow-hidden">
      <div className="flex items-center gap-6 whitespace-nowrap px-4 py-2 overflow-x-auto">
        {tickers.map((t) => (
          <div key={t.symbol} className="flex items-baseline gap-2">
            <span className="text-white font-semibold">{t.symbol}</span>
            <span className="text-white/90">{formatCurrency(t.price)}</span>
            <span className={`${getChangeColor(t.changePct)} text-sm`}>{formatPercentage(t.changePct)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}



'use client'

import { formatCurrency, getChangeColor } from '@/lib/utils'

type Pos = { symbol: string; qty: number; pnl: number }

const seed: Pos[] = [
  { symbol: 'BTC-26JAN24-45000-C', qty: 2, pnl: 101 },
  { symbol: 'ETH-26JAN24-2700-P', qty: 5, pnl: -28.75 },
  { symbol: 'SOL', qty: 100, pnl: 325 },
]

export function MiniPositions() {
  return (
    <div className="aiiq-tile p-4 min-w-[320px]">
      <div className="text-white/70 text-xs mb-2">Positions</div>
      <div className="divide-y divide-aiiq-light/20">
        {seed.map((p) => (
          <div key={p.symbol} className="flex items-center justify-between py-1.5 text-sm">
            <span className="truncate max-w-[220px] text-white/90">{p.symbol}</span>
            <span className={`font-semibold ${getChangeColor(p.pnl)}`}>{p.pnl > 0 ? '+' : ''}{formatCurrency(p.pnl)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}





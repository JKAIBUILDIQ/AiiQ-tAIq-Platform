'use client'

import { MiniPnL } from '@/components/widgets/mini-pnl'
import { MiniPositions } from '@/components/widgets/mini-positions'
import { MiniGreeks, Greeks } from '@/components/widgets/mini-greeks'
import { RiskBanner } from '@/components/risk-banner'
import TickerTape from '@/components/tradingview/TickerTape'
import { useEffect } from 'react'
import { usePortfolioStore } from '@/lib/portfolio-store'

function computeStabilityScore(g: Greeks): number {
  // Normalize greeks to rough 0-1 signals
  const deltaScore = 1 - Math.min(1, Math.abs(g.delta))
  const gammaScore = 1 - Math.min(1, Math.abs(g.gamma) / 0.01)
  const thetaScore = 1 - Math.min(1, Math.abs(g.theta) / 100)
  const vegaScore = 1 - Math.min(1, Math.abs(g.vega) / 150)
  const avg = (deltaScore + gammaScore + thetaScore + vegaScore) / 4
  return +(avg * 5).toFixed(1)
}

function StabilityBadge({ greeks }: { greeks: Greeks }) {
  const score = computeStabilityScore(greeks)
  const clamped = Math.max(0, Math.min(5, score))
  const pct = (clamped / 5) * 100
  const label = clamped >= 4 ? 'Stable' : clamped >= 2 ? 'Moderate' : 'Unstable'
  const color = clamped >= 4 ? 'bg-emerald-500' : clamped >= 2 ? 'bg-amber-500' : 'bg-rose-500'
  return (
    <div className="aiiq-tile p-4">
      <div className="text-white/70 text-xs mb-1">Stability</div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-aiiq-light/40 rounded-full overflow-hidden">
          <div className={`${color} h-full`} style={{ width: `${pct}%` }} />
        </div>
        <div className="text-sm font-semibold w-10 text-right">{clamped.toFixed(1)}</div>
      </div>
      <div className="text-xs text-white/70 mt-1">0 = very unstable • 5 = very stable</div>
      <div className="text-[10px] uppercase tracking-wide text-white/60 mt-0.5">{label}</div>
    </div>
  )
}

export function GlobalTradingHeader() {
  const { data, fetch } = usePortfolioStore()
  useEffect(() => { fetch() }, [fetch])
  const greeks = data?.greeks ?? { delta: 0.21, gamma: 0.004, theta: -32.5, vega: 85 }
  const risk = { currentVaR: data?.var ?? 0.02, maxVaR: 0.05 }
  return (
    <div className="sticky top-0 z-40 mb-3">
      <div className="mb-2 rounded-2xl border border-aiiq-light/30 bg-aiiq-dark/40 backdrop-blur-xl overflow-hidden">
        <TickerTape />
      </div>
      <div className="rounded-2xl border border-aiiq-light/30 bg-aiiq-dark/60 backdrop-blur-xl shadow-lg px-3 py-3">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <MiniPnL />
          <MiniPositions />
          <MiniGreeks values={greeks} />
          <div className="grid grid-cols-1 gap-3">
            <RiskBanner currentVaR={risk.currentVaR} maxVaR={risk.maxVaR} />
            <StabilityBadge greeks={greeks} />
          </div>
        </div>
      </div>
    </div>
  )
}



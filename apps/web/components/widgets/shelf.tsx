'use client'

import { useUIStore } from '@/lib/ui-store'
import { TickerRow } from './ticker-row'
import { MiniPnL } from './mini-pnl'
import { MiniPositions } from './mini-positions'
import { MiniGreeks } from './mini-greeks'
import { FlowStrip } from './flow-strip'
import { RiskBanner } from '@/components/risk-banner'

export function WidgetsShelf() {
  const { showShelf, showGreeks, showFlow } = useUIStore()

  if (!showShelf) return null

  return (
    <div id="widgets" className="space-y-4">
      <TickerRow />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MiniPnL />
        <MiniPositions />
        <RiskBanner />
        {showGreeks ? <MiniGreeks /> : null}
      </div>
      {showFlow ? <FlowStrip /> : null}
    </div>
  )
}



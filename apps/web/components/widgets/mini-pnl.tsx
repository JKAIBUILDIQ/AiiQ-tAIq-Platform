'use client'

import { useEffect, useState } from 'react'
import { formatCurrency, getChangeColor } from '@/lib/utils'

export function MiniPnL() {
  const [pnl, setPnl] = useState(397.25)
  const [twinkle, setTwinkle] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setPnl((p) => {
        const next = +(p + (Math.random() - 0.5) * 50).toFixed(2)
        setTwinkle(true); setTimeout(() => setTwinkle(false), 700)
        return next
      })
    }, 1500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="aiiq-tile p-4 aiiq-aura">
      <div className="text-white/70 text-xs">Total P&L</div>
      <div className={`text-2xl font-bold ${getChangeColor(pnl)} ${twinkle ? 'aiiq-number-changed' : ''}`}>{pnl > 0 ? '+' : ''}{formatCurrency(pnl)}</div>
    </div>
  )
}



'use client'

import { useEffect, useState } from 'react'

type Metric = { label: string; value: string; sub?: string }

export default function TilesRow() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: 'PnL', value: '$+478.35', sub: 'Today' },
    { label: 'Greeks Δ', value: '+0.28', sub: 'Portfolio' },
    { label: 'Gamma', value: '0.004', sub: 'Net' },
    { label: 'Vega', value: '34.8', sub: 'Net' },
  ])

  useEffect(() => {
    const id = setInterval(() => {
      setMetrics((m) => m.map((x) => ({ ...x, value: Math.random() > 0.5 ? x.value : x.value })))
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-wrap gap-3">
      {metrics.map((m) => (
        <div key={m.label} className="aura-tile rounded-xl px-4 py-2 bg-black/50 border border-aiiq-light/30">
          <div className="text-xs text-gray-400">{m.label}</div>
          <div className="text-lg font-semibold">{m.value}</div>
          {m.sub && <div className="text-[10px] text-gray-500">{m.sub}</div>}
        </div>
      ))}
    </div>
  )
}





'use client'

import { useEffect, useState } from 'react'

type Flow = { sym: string; side: 'C' | 'P'; size: number; iv: number }

function FlowPill({ f }: { f: Flow }) {
  const color = f.side === 'C' ? 'bg-emerald-600/60' : 'bg-rose-600/60'
  return (
    <div className={`rounded-full ${color} text-white text-xs px-3 py-1 whitespace-nowrap`}> 
      {f.sym} {f.side} {f.size} @ IV {Math.round(f.iv * 100)}%
    </div>
  )
}

export function FlowStrip() {
  const [flows, setFlows] = useState<Flow[]>([
    { sym: 'BTC-45000', side: 'C', size: 25, iv: 0.61 },
    { sym: 'ETH-2700', side: 'P', size: 40, iv: 0.58 },
    { sym: 'SOL-100', side: 'C', size: 80, iv: 0.64 },
  ])

  useEffect(() => {
    const id = setInterval(() => {
      const s = Math.random() > 0.5 ? 'C' : 'P'
      const add: Flow = {
        sym: ['BTC-45000', 'ETH-2700', 'SOL-100'][Math.floor(Math.random() * 3)],
        side: s as 'C' | 'P',
        size: Math.floor(10 + Math.random() * 100),
        iv: +(0.55 + Math.random() * 0.15).toFixed(2),
      }
      setFlows((prev) => [add, ...prev].slice(0, 10))
    }, 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="aiiq-tile px-4 py-2 overflow-x-auto">
      <div className="flex gap-2">
        {flows.map((f, i) => (
          <FlowPill key={i} f={f} />
        ))}
      </div>
    </div>
  )
}



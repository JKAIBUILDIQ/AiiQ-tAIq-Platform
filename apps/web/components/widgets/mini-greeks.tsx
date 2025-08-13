'use client'

import { useEffect, useState } from 'react'

type Greeks = { delta: number; gamma: number; theta: number; vega: number }

export function MiniGreeks() {
  const [g, setG] = useState<Greeks>({ delta: 0.21, gamma: 0.004, theta: -32.5, vega: 85 })

  useEffect(() => {
    const id = setInterval(() => {
      setG((x) => ({
        delta: +(x.delta + (Math.random() - 0.5) * 0.02).toFixed(3),
        gamma: +(x.gamma + (Math.random() - 0.5) * 0.0004).toFixed(4),
        theta: +(x.theta + (Math.random() - 0.5) * 2).toFixed(1),
        vega: +(x.vega + (Math.random() - 0.5) * 4).toFixed(1),
      }))
    }, 1500)
    return () => clearInterval(id)
  }, [])

  const cell = (label: string, val: number, color: string) => (
    <div className={`flex flex-col items-center justify-center rounded-xl ${color} px-4 py-3`}> 
      <div className="text-xs text-white/80">{label}</div>
      <div className="text-white font-semibold">{val}</div>
    </div>
  )

  return (
    <div className="aiiq-tile p-3">
      <div className="text-white/70 text-xs mb-2">Portfolio Greeks</div>
      <div className="grid grid-cols-4 gap-2">
        {cell('Δ', g.delta, 'bg-emerald-600/50')}
        {cell('Γ', g.gamma, 'bg-cyan-600/50')}
        {cell('Θ', g.theta, 'bg-amber-600/50')}
        {cell('V', g.vega, 'bg-fuchsia-600/50')}
      </div>
    </div>
  )
}



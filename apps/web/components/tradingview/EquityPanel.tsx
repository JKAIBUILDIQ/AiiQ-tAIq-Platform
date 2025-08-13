'use client'

import { useEffect, useRef } from 'react'
import { EquityPoint } from '@/lib/trading-utils'

export default function EquityPanel({ equity, stats }: { equity: EquityPoint[]; stats: { pnlPct: number; sharpe: number; winRate: number; maxDD: number } }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let chart: any
    let cleanup = () => {}
    import('lightweight-charts').then(({ createChart }) => {
      if (!ref.current) return
      chart = createChart(ref.current, { layout: { background: { color: 'transparent' }, textColor: '#ddd' }, autoSize: true, grid: { vertLines: { color: 'rgba(255,255,255,0.05)' }, horzLines: { color: 'rgba(255,255,255,0.05)' } } })
      const series = chart.addAreaSeries({ lineColor: '#22c55e', topColor: 'rgba(34,197,94,0.3)', bottomColor: 'rgba(34,197,94,0.0)' })
      series.setData(equity.map((e) => ({ time: e.time as any, value: e.value })))
      chart.timeScale().fitContent()
      cleanup = () => chart?.remove()
    })
    return () => cleanup()
  }, [equity])

  return (
    <div className="bg-black/50 border border-aiiq-light/30 rounded-xl p-4 backdrop-blur-md aura-tile">
      <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
        <div><div className="text-gray-400">PnL</div><div className="text-lg font-semibold">{stats.pnlPct.toFixed(2)}%</div></div>
        <div><div className="text-gray-400">Sharpe</div><div className="text-lg font-semibold">{stats.sharpe.toFixed(2)}</div></div>
        <div><div className="text-gray-400">Win rate</div><div className="text-lg font-semibold">{(stats.winRate*100).toFixed(1)}%</div></div>
        <div><div className="text-gray-400">Max DD</div><div className="text-lg font-semibold">{stats.maxDD.toFixed(1)}%</div></div>
      </div>
      <div ref={ref} style={{ height: 180 }} />
    </div>
  )
}





'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import StrategyControlsDrawer, { StrategyControls } from './StrategyControlsDrawer'
import CsvImport, { Candle as CsvCandle } from './CsvImport'
import EquityPanel from './EquityPanel'
import { computeEquity, computeStats, computeStrategyEquity } from '@/lib/trading-utils'
import TemplateBar from './TemplateBar'

type Candle = { time: number; open: number; high: number; low: number; close: number }

export default function StrategyPlayground() {
  const [candles, setCandles] = useState<Candle[]>([])
  const [controls, setControls] = useState<StrategyControls>({
    symbol: 'BTC',
    timeframe: '1h',
    strategy: 'SMA Cross',
    riskPct: 2,
    targetPct: 5,
    benchmarks: ['SPY'],
  })

  useEffect(() => {
    // Placeholder generator influenced by timeframe
    const stepSec = controls.timeframe === '1m' ? 60 : controls.timeframe === '5m' ? 300 : controls.timeframe === '1h' ? 3600 : 86400
    const now = Math.floor(Date.now() / 1000)
    const data: Candle[] = []
    let price = 65000
    for (let i = 300; i >= 0; i--) {
      const base = price + Math.sin(i / 7) * 300 + (Math.random() - 0.5) * 150
      const open = base + (Math.random() - 0.5) * 50
      const close = base + (Math.random() - 0.5) * 50
      const high = Math.max(open, close) + Math.random() * 80
      const low = Math.min(open, close) - Math.random() * 80
      data.push({ time: now - i * stepSec, open, high, low, close })
      price = close
    }
    setCandles(data)
  }, [controls.timeframe, controls.symbol])

  return (
    <div className="bg-black/50 border border-aiiq-light/30 rounded-xl p-4 backdrop-blur-md aura-tile">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Strategy Playground <span className="text-xs text-gray-400">(Analysis & Backtest)</span></h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{controls.symbol} • {controls.timeframe} • {controls.strategy}</span>
          <CsvImport onLoad={(rows: CsvCandle[])=> setCandles(rows as any)} />
          <StrategyControlsDrawer value={controls} onChange={setControls} />
        </div>
      </div>
      <ChartShell data={candles} benchmarks={controls.benchmarks} />
      <div className="mt-3 flex items-center justify-between">
        <TemplateBar controls={controls} onLoad={setControls} />
      </div>
      <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EquityPanel equity={computeStrategyEquity(candles, controls.strategy)} stats={computeStats(candles, computeStrategyEquity(candles, controls.strategy))} />
        <EquityPanel equity={computeEquity(candles)} stats={computeStats(candles, computeEquity(candles))} />
      </div>
      <div className="mt-3 text-xs text-gray-400">
        - CSV/JSON import (next) • Simple rule presets • Compare to benchmarks ({controls.benchmarks.join(', ')}) • pAIt score visible in drawer
      </div>
    </div>
  )
}

function ChartShell({ data, benchmarks }: { data: Candle[]; benchmarks: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let chart: any
    let cleanup = () => {}
    let alive = true
    import('lightweight-charts').then(({ createChart }) => {
      if (!alive || !ref.current) return
      chart = createChart(ref.current, {
        layout: { background: { color: 'transparent' }, textColor: '#ddd' },
        grid: { vertLines: { color: 'rgba(255,255,255,0.05)' }, horzLines: { color: 'rgba(255,255,255,0.05)' } },
        autoSize: true,
      })
      const series = chart.addCandlestickSeries()
      series.setData(data)
      // simple synthetic lines for benchmarks using scaled closes
      const closes = data.map((c) => ({ time: c.time as any, value: c.close }))
      const colorMap: Record<string,string> = { SPY: '#22c55e', QQQ: '#60a5fa', IWM: '#f59e0b', VIX: '#ef4444', BTC: '#a855f7' }
      for (const b of benchmarks) {
        const line = chart.addLineSeries({ color: colorMap[b] || '#9ca3af', lineWidth: 2 })
        const factor = 0.8 + Math.random() * 0.4
        line.setData(closes.map((p) => ({ time: p.time, value: p.value * factor })))
      }
      chart.timeScale().fitContent()
      cleanup = () => chart?.remove()
    })
    return () => { alive = false; cleanup() }
  }, [data, benchmarks])
  return <div ref={ref} className="tv-lightweight-charts" style={{ height: 380 }} />
}



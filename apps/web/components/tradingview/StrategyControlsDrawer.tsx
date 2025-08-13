'use client'

import { useState } from 'react'
import { X, Menu } from 'lucide-react'

export type StrategyControls = {
  symbol: string
  timeframe: '1m' | '5m' | '1h' | '1d'
  strategy: 'SMA Cross' | 'Breakout' | 'RSI Mean Reversion'
  riskPct: number
  targetPct: number
  benchmarks: string[]
}

export default function StrategyControlsDrawer({
  value,
  onChange,
}: {
  value: StrategyControls
  onChange: (v: StrategyControls) => void
}) {
  const [open, setOpen] = useState(false)
  const [local, setLocal] = useState<StrategyControls>(value)

  const apply = () => {
    onChange(local)
    setOpen(false)
  }

  const toggleBenchmark = (b: string) => {
    setLocal((v) => ({
      ...v,
      benchmarks: v.benchmarks.includes(b)
        ? v.benchmarks.filter((x) => x !== b)
        : [...v.benchmarks, b],
    }))
  }

  // Simple pAIt rating: placeholder formula based on risk/target/strategy
  const paitScore = Math.min(
    100,
    Math.round(70 + (local.targetPct - local.riskPct) * 2 + (local.strategy === 'SMA Cross' ? 4 : 0))
  )
  const paitGrade = paitScore >= 90 ? 'A' : paitScore >= 80 ? 'B' : paitScore >= 70 ? 'C' : 'D'

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm bg-black/40 border border-aiiq-light/30 hover:bg-aiiq-light/40"
        aria-label="Open strategy controls"
      >
        <Menu className="h-4 w-4" /> Strategy
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-[360px] bg-[#0b0c10] border-l border-aiiq-light/30 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Strategy Settings</h3>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400">Asset</label>
                <input
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-black/40 border border-aiiq-light/30"
                  value={local.symbol}
                  onChange={(e) => setLocal({ ...local, symbol: e.target.value.toUpperCase() })}
                  placeholder="BTC, SPY, TSLA"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400">Timeframe</label>
                <select
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-black/40 border border-aiiq-light/30"
                  value={local.timeframe}
                  onChange={(e) => setLocal({ ...local, timeframe: e.target.value as any })}
                >
                  <option value="1m">1m</option>
                  <option value="5m">5m</option>
                  <option value="1h">1h</option>
                  <option value="1d">1d</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400">Strategy</label>
                <select
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-black/40 border border-aiiq-light/30"
                  value={local.strategy}
                  onChange={(e) => setLocal({ ...local, strategy: e.target.value as any })}
                >
                  <option>SMA Cross</option>
                  <option>Breakout</option>
                  <option>RSI Mean Reversion</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400">Risk %</label>
                  <input
                    type="number"
                    className="mt-1 w-full px-3 py-2 rounded-lg bg-black/40 border border-aiiq-light/30"
                    value={local.riskPct}
                    onChange={(e) => setLocal({ ...local, riskPct: Number(e.target.value) })}
                    min={0}
                    step={0.5}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Target %</label>
                  <input
                    type="number"
                    className="mt-1 w-full px-3 py-2 rounded-lg bg-black/40 border border-aiiq-light/30"
                    value={local.targetPct}
                    onChange={(e) => setLocal({ ...local, targetPct: Number(e.target.value) })}
                    min={0}
                    step={0.5}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">Benchmarks</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['SPY', 'QQQ', 'IWM', 'VIX', 'BTC'].map((b) => (
                    <button
                      key={b}
                      onClick={() => toggleBenchmark(b)}
                      className={`px-3 py-1 rounded-full text-xs border ${
                        local.benchmarks.includes(b)
                          ? 'bg-aiiq-cyber/30 border-aiiq-cyber text-white'
                          : 'bg-black/40 border-aiiq-light/30 text-gray-300 hover:bg-aiiq-light/40'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-aiiq-light/30">
                <div className="text-xs text-gray-400">pAIt Rating</div>
                <div className="flex items-end gap-3 mt-1">
                  <div className="text-2xl font-bold">{paitScore}</div>
                  <div className="text-lg">{paitGrade}</div>
                </div>
                <div className="text-[11px] text-gray-500 mt-1">First-pass heuristic based on risk/target/strategy. Will use live telemetry next.</div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setOpen(false)} className="px-3 py-1 rounded-lg text-sm border border-aiiq-light/30">Cancel</button>
                <button onClick={apply} className="px-3 py-1 rounded-lg text-sm bg-aiiq-rose/30 border border-aiiq-rose">Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}



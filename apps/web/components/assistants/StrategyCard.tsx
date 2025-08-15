'use client'

import React from 'react'

export type Strategy = {
  name: string
  legs: string[]
  expectedReturn?: string
  riskSummary?: string
  greeks?: Record<string, number | string>
}

type Props = {
  strategy: Strategy
  saving?: boolean
  backtesting?: boolean
  resultEquity?: number | null
  onSave?: (s: Strategy) => Promise<string | null> | void
  onBacktest?: (strategyId: string) => Promise<void> | void
}

export function StrategyCard({ strategy, saving, backtesting, resultEquity, onSave, onBacktest }: Props) {
  const [savedId, setSavedId] = React.useState<string | null>(null)
  const [savingLocal, setSavingLocal] = React.useState(false)
  const [backtestingLocal, setBacktestingLocal] = React.useState(false)
  const [equity, setEquity] = React.useState<number | null>(null)

  async function handleSave() {
    if (!onSave) return
    setSavingLocal(true)
    try {
      const id = await onSave(strategy)
      if (id) setSavedId(id)
    } finally {
      setSavingLocal(false)
    }
  }

  async function handleBacktest() {
    if (!onBacktest || !savedId) return
    setBacktestingLocal(true)
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080') + `/backtest?strategyId=${encodeURIComponent(savedId)}&symbol=BTC&timeframe=1d`)
      if (res.ok) {
        const data = await res.json()
        if (data?.result?.equity && Array.isArray(data.result.equity)) {
          const last = data.result.equity[data.result.equity.length - 1]
          if (typeof last === 'number') setEquity(last)
        }
      }
    } finally {
      setBacktestingLocal(false)
    }
  }

  const busy = saving || savingLocal || backtesting || backtestingLocal

  return (
    <div className="p-4 bg-gray-900/70 border border-aiiq-light/30 hover:border-cyan-500 rounded-xl transition-colors shadow">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-white">{strategy.name}</h3>
        <div className="flex gap-2">
          {onSave && (
            <button
              className="text-xs px-2 py-1 rounded border border-aiiq-light/40 text-gray-200 hover:text-white hover:bg-aiiq-light/20 disabled:opacity-50"
              onClick={handleSave}
              disabled={busy}
              title="Save strategy to orchestrator"
            >
              {savingLocal ? 'Saving…' : savedId ? 'Saved' : 'Save'}
            </button>
          )}
          {onBacktest && (
            <button
              className="text-xs px-2 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50"
              onClick={handleBacktest}
              disabled={!savedId || busy}
              title={savedId ? 'Run backtest' : 'Save first to get an ID'}
            >
              {backtestingLocal ? 'Backtesting…' : 'Backtest'}
            </button>
          )}
        </div>
      </div>

      <ul className="text-cyan-300 mt-2 mb-3 list-disc ml-6">
        {strategy.legs?.map((leg, idx) => (
          <li key={idx}>{leg}</li>
        ))}
      </ul>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-gray-400">Risk</div>
          <div className="text-gray-200">{strategy.riskSummary || '—'}</div>
        </div>
        <div>
          <div className="text-gray-400">Return</div>
          <div className="text-emerald-400">{strategy.expectedReturn || (equity != null ? `${((equity - 1) * 100).toFixed(2)}%` : '—')}</div>
        </div>
        {strategy.greeks && (
          <div className="col-span-2">
            <div className="text-gray-400 mb-1">Greeks</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(strategy.greeks).map(([k, v]) => (
                <span key={k} className="px-2 py-0.5 rounded bg-aiiq-light/20 text-gray-200 text-xs border border-aiiq-light/30">
                  {k}: {String(v)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {savedId && (
        <div className="mt-3 text-xs text-gray-500">ID: {savedId}</div>
      )}
    </div>
  )}

export default StrategyCard



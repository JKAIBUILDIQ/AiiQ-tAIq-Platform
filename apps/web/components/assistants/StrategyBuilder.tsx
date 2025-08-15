'use client';
import React, { useState } from 'react';
import StrategyCard from './StrategyCard'

type Strategy = {
  name: string;
  legs: string[];
  expectedReturn: string;
  riskSummary: string;
};

async function generateStrategies(prompt: string): Promise<Strategy[]> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30_000)

  async function post(url: string) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    })
  }

  try {
    // Try without trailing slash; fall back to trailing slash if 404
    let res = await post('http://localhost:8787/generate')
    if (res.status === 404) res = await post('http://localhost:8787/generate/')

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(text || `Request failed (${res.status})`)
    }

    const data = await res.json().catch(() => ({} as any))

    // Normalize strategies from various shapes
    let raw: any[] = []
    if (Array.isArray(data?.strategies)) {
      raw = data.strategies
    } else if (typeof data?.response === 'string') {
      try {
        const parsed = JSON.parse(data.response)
        if (Array.isArray(parsed?.strategies)) raw = parsed.strategies
      } catch {/* ignore */}
    } else if (Array.isArray(data?.results)) {
      raw = data.results
    }

    return raw.map((s: any): Strategy => {
      const legs =
        Array.isArray(s?.legs)
          ? s.legs.map((x: any) => String(x))
          : typeof s?.legs === 'string'
            ? s.legs.split(/\r?\n|,|;/).map((t: string) => t.trim()).filter(Boolean)
            : []

      return {
        name: String(s?.name ?? 'Strategy'),
        legs,
        expectedReturn: String(s?.expectedReturn ?? s?.expected_return ?? '—'),
        riskSummary: String(s?.riskSummary ?? s?.risk_summary ?? '—'),
      }
    })
  } finally {
    clearTimeout(timeout)
  }
}
export default function StrategyBuilder() {
  const [prompt, setPrompt] = useState('')
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await generateStrategies(prompt)
      setStrategies(result)
    } catch {
      setError('Failed to fetch strategies')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    const p = url.searchParams.get('prompt') || ''
    const focus = url.searchParams.get('focus') === '1'
    const run = url.searchParams.get('run') === '1'
    if (p) setPrompt(p)
    if (focus) {
      const ta = document.getElementById('strategy-prompt') as HTMLTextAreaElement | null
      ta?.focus()
      ta?.setSelectionRange(ta.value.length, ta.value.length)
    }
    if (p && run) {
      ;(async () => {
        setLoading(true)
        setError(null)
        try {
          const result = await generateStrategies(p)
          setStrategies(result)
        } catch {
          setError('Failed to fetch strategies')
        } finally {
          setLoading(false)
        }
      })()
    }
  }, [])

  return (
    <div id="builder" className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-white">Strategy Builder</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          id="strategy-prompt"
          className="w-full h-32 p-4 bg-gray-800 text-white border border-gray-700 rounded"
          placeholder="Describe the strategy you want..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div>
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Strategies'}
          </button>
        </div>
      </form>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {strategies.map((s, i) => (
          <StrategyCard
            key={i}
            strategy={s}
            onSave={async (st) => {
              try {
                const res = await fetch((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080') + '/assistants/strategy', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(st),
                })
                if (!res.ok) return null
                const data = await res.json()
                return data?.id || null
              } catch {
                return null
              }
            }}
            onBacktest={async (id) => {
              try {
                const res = await fetch((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080') + `/backtest?strategyId=${encodeURIComponent(id)}&symbol=BTC&timeframe=1d`)
                if (!res.ok) return
                const data = await res.json()
                console.log('Backtest', data)
              } catch {}
            }}
          />
        ))}
      </div>
    </div>
  );
}

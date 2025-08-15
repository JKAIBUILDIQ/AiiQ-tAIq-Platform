'use client'

import React from 'react'

type Row = {
  underlying?: string
  contract?: string
  expiry?: string
  strike?: number
  type?: string
  last?: number
  bid?: number
  ask?: number
  volume?: number
  openInterest?: number
  provider?: string
}

export default function MostActiveOptions() {
  const [symbols, setSymbols] = React.useState('SPY,QQQ,AAPL,MSFT,NVDA,TSLA')
  const [rows, setRows] = React.useState<Row[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = new URL((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080') + '/us/options/most-active')
      url.searchParams.set('provider', 'marketdata')
      url.searchParams.set('symbols', symbols)
      url.searchParams.set('limit', '100')
      const res = await fetch(url.toString(), { cache: 'no-store' })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const data = await res.json()
      const results = Array.isArray(data?.results) ? data.results : []
      setRows(results.filter(Boolean))
      if (data?.error) setError(String(data.error))
    } catch (e: any) {
      setError(e?.message || 'Failed to load')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [symbols])

  React.useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          className="w-full md:w-1/2 px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-100"
          placeholder="Symbols (comma separated)"
          value={symbols}
          onChange={(e) => setSymbols(e.target.value)}
        />
        <button
          className="px-3 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-60"
          onClick={load}
          disabled={loading}
        >
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>
      {error && <div className="text-red-400 text-sm break-all">Error: {error}</div>}
      <div className="overflow-auto border border-aiiq-light/30 rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-900/60 text-gray-300">
            <tr>
              <th className="text-left p-2">Underlying</th>
              <th className="text-left p-2">Contract</th>
              <th className="text-right p-2">Strike</th>
              <th className="text-left p-2">Type</th>
              <th className="text-right p-2">Bid</th>
              <th className="text-right p-2">Ask</th>
              <th className="text-right p-2">Last</th>
              <th className="text-right p-2">Volume</th>
              <th className="text-right p-2">Open Int</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(rows) && rows.map((r, i) => {
              if (!r || typeof r !== 'object') return null
              const underlying = (r as any)?.underlying ?? '—'
              const contractVal = (r as any)?.contract ?? '—'
              const strike = (r as any)?.strike ?? '—'
              const type = (r as any)?.type ?? '—'
              const bid = (r as any)?.bid ?? '—'
              const ask = (r as any)?.ask ?? '—'
              const last = (r as any)?.last ?? '—'
              const volume = (r as any)?.volume ?? 0
              const oi = (r as any)?.openInterest ?? 0
              return (
                <tr key={`${contractVal}-${i}`} className="odd:bg-gray-900/30">
                  <td className="p-2 text-gray-200">{underlying}</td>
                  <td className="p-2 text-cyan-300 break-all">{contractVal}</td>
                  <td className="p-2 text-right">{strike}</td>
                  <td className="p-2">{type}</td>
                  <td className="p-2 text-right">{bid}</td>
                  <td className="p-2 text-right">{ask}</td>
                  <td className="p-2 text-right">{last}</td>
                  <td className="p-2 text-right">{volume}</td>
                  <td className="p-2 text-right">{oi}</td>
                </tr>
              )
            })}
            {(!Array.isArray(rows) || rows.length === 0) && !loading && (
              <tr>
                <td colSpan={9} className="p-3 text-center text-gray-400">No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-gray-500">Source: MarketData</div>
    </div>
  )
}
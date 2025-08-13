'use client'

import { useEffect, useState } from 'react'
import { ChainSnapshot, connectChainStream, mockChain } from '@/lib/chain-stream'

type ChainRow = {
  strike: number
  callIV: number
  callBid: number
  callAsk: number
  putBid: number
  putAsk: number
  putIV: number
}

export function OptionsChain({ symbol }: { symbol?: string }) {
  const [snap, setSnap] = useState<ChainSnapshot | null>(null)

  useEffect(() => {
    const sym = symbol || 'BTC'
    return connectChainStream(sym, setSnap)
  }, [symbol])

  return (
    <div className="bg-black/50 border border-aiiq-light/30 rounded-xl p-4 backdrop-blur-md aura-tile">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Options Chain <span className="text-xs text-gray-400">(auto: live or mock)</span></h3>
        <span className="text-sm text-gray-400">{symbol ?? '—'} • 30D</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-gray-400">
            <tr>
              <th className="text-left py-2">Strike</th>
              <th className="text-right">C Bid</th>
              <th className="text-right">C Ask</th>
              <th className="text-right">C IV</th>
              <th className="text-right">P Bid</th>
              <th className="text-right">P Ask</th>
              <th className="text-right">P IV</th>
            </tr>
          </thead>
          <tbody>
            {!snap && (
              <tr className="border-t border-aiiq-light/20"><td className="py-3 text-gray-500" colSpan={7}>Loading chain…</td></tr>
            )}
            {snap?.rows.map((r) => (
              <tr key={r.strike} className="border-t border-aiiq-light/20">
                <td className="py-2">{r.strike.toLocaleString()}</td>
                <td className="text-right text-green-400">{r.callBid.toFixed(0)}</td>
                <td className="text-right text-green-300">{r.callAsk.toFixed(0)}</td>
                <td className="text-right">{(r.callIV * 100).toFixed(1)}%</td>
                <td className="text-right text-red-300">{r.putBid.toFixed(0)}</td>
                <td className="text-right text-red-400">{r.putAsk.toFixed(0)}</td>
                <td className="text-right">{(r.putIV * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OptionsChain



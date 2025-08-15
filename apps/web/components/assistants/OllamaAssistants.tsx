'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

type Assistant = {
  name: string
  model: string
  avatar: string
}

const assistants: Assistant[] = [
  { name: 'Celine', model: 'claudia-trader:latest', avatar: '/public-proxy?path=images/assistants/celine.jpg' },
  { name: 'Juliet', model: 'claudia-trader:latest', avatar: '/public-proxy?path=images/assistants/juliet.jpg' },
  { name: 'John', model: 'claudia-trader:latest', avatar: '/public-proxy?path=images/assistants/johnAI.jpeg' },
  { name: 'Jela', model: 'claudia-trader:latest', avatar: '/public-proxy?path=images/assistants/jelaAI.jpeg' },
]

const promptByAssistant: Record<string, string> = {
  Celine: 'Generate 3 delta-neutral options strategies on BTC using historical data from Jan 2023 to Aug 2025. Limit DTE < 10, IV rank > 0.6. Output JSON with name, legs[], riskSummary, greeks, expectedReturn.',
  Juliet: 'Design 3 risk-defined strategies on TSLA for next 10 days. Prefer iron condors/butterflies. Output JSON with name, legs[], riskSummary, greeks, expectedReturn.',
  John: 'Create 3 mean-reversion SPY option strategies with tight risk, JSON fields: name, legs[], riskSummary, greeks, expectedReturn.',
  Jela: 'Propose 3 ETH gamma scalping strategies (options + spot hedges). Return JSON with fields name, legs[], riskSummary, greeks, expectedReturn.',
}

export default function OllamaAssistants() {
  const router = useRouter()
  return (
    <div className="mt-4">
      <h2 className="text-sm uppercase tracking-wide text-gray-400 mb-2">Ollama Assistants</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {assistants.map((a) => (
          <div key={a.name} className="flex items-center justify-between p-3 rounded-lg border border-aiiq-light/30 bg-aiiq-dark/40 hover:border-cyan-500">
            <button
              className="flex items-center gap-3 text-left"
              onClick={() => {
                const prompt = promptByAssistant[a.name] || ''
                const q = new URLSearchParams({ prompt, focus: '1' })
                router.push(`/assistants?${q.toString()}#builder`)
              }}
              title={`Prefill prompt for ${a.name}`}
            >
              <img src={a.avatar} alt={a.name} className="h-8 w-8 rounded-full object-cover" />
              <div className="min-w-0">
                <div className="text-gray-200 truncate">{a.name}</div>
                <div className="text-[10px] text-cyan-400 truncate">{a.model}</div>
              </div>
            </button>
            <button
              className="text-xs px-2 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white"
              onClick={() => {
                const prompt = promptByAssistant[a.name] || ''
                const q = new URLSearchParams({ prompt, run: '1' })
                router.push(`/assistants?${q.toString()}#builder`)
              }}
              title="Run now"
            >
              Run
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}



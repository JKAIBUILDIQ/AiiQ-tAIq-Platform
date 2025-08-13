'use client'

import { create } from 'zustand'
import type { Greeks } from '@/components/widgets/mini-greeks'

export interface PositionSummary {
  instrument: string
  qty: number
  avg_px?: number
  unrealized_pnl?: number
}

export interface PortfolioSummary {
  total_value: number
  cash: number
  positions: PositionSummary[]
  total_pnl: number
  total_pnl_percent: number
  greeks: Greeks & { rho?: number }
  var: number
  timestamp?: string
}

interface PortfolioState {
  data: PortfolioSummary | null
  error?: string
  isLoading: boolean
  fetch: () => Promise<void>
}

const httpBase =
  (typeof window !== 'undefined' && (window as any).__NEXT_PUBLIC_ORCH_HTTP) ||
  process.env.NEXT_PUBLIC_ORCH_HTTP ||
  'http://127.0.0.1:8080'

export const usePortfolioStore = create<PortfolioState>((set) => ({
  data: null,
  isLoading: false,
  async fetch() {
    set({ isLoading: true, error: undefined })
    try {
      const res = await fetch(`${httpBase}/paper/portfolio`)
      if (!res.ok) throw new Error(`status ${res.status}`)
      const json = (await res.json()) as PortfolioSummary
      set({ data: json, isLoading: false })
    } catch (e: any) {
      set({ error: String(e?.message || e), isLoading: false })
    }
  },
}))



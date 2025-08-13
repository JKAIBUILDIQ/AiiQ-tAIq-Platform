"use client"
import { RiskBanner } from '@/components/risk-banner'
import { usePortfolioStore } from '@/lib/portfolio-store'
import { useEffect } from 'react'

export default function RiskPage() {
  return (
    <div className="p-4">
      <div className="aiiq-tile p-6">
        <h2 className="text-xl font-semibold">Risk</h2>
        <p className="text-sm text-gray-400">Placeholder content. Risk controls and VaR dashboards will live here.</p>
      </div>
    </div>
  )
}



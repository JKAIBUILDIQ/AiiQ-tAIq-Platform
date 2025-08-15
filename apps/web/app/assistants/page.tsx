"use client"
import StrategyBuilder from '@/components/assistants/StrategyBuilder'
import OllamaAssistants from '@/components/assistants/OllamaAssistants'
import TradingViewSymbolOverview from '@/components/tradingview/TradingViewSymbolOverview'
import MostActiveOptions from '@/components/markets/MostActiveOptions'

export default function AssistantsPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="aiiq-tile p-6">
        <h2 className="text-xl font-semibold">Assistants</h2>
        <p className="text-sm text-gray-400">Manage AI assistants and tasks.</p>
        <OllamaAssistants />
      </div>
      <StrategyBuilder />
      <div className="aiiq-tile p-6">
        <h3 className="text-lg font-semibold mb-3">Market Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TradingViewSymbolOverview symbol="TSLA" />
          <TradingViewSymbolOverview symbol="BTCUSD" />
        </div>
      </div>
      <div className="aiiq-tile p-6">
        <h3 className="text-lg font-semibold mb-3">Most Active US Options (MarketData)</h3>
        <MostActiveOptions />
      </div>
    </div>
  )
}



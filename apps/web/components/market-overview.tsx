'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { getChangeColor, getChangeIcon, formatCurrency, formatPercentage } from '@/lib/utils'

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
}

const mockMarketData: MarketData[] = [
  { symbol: 'BTC', price: 43250.50, change: 1250.75, changePercent: 0.0298, volume: 28475000000 },
  { symbol: 'ETH', price: 2650.25, change: -45.80, changePercent: -0.0170, volume: 15842000000 },
  { symbol: 'SOL', price: 98.75, change: 3.25, changePercent: 0.0342, volume: 2847500000 },
  { symbol: 'SPY', price: 468.50, change: 2.15, changePercent: 0.0046, volume: 28475000000 },
  { symbol: 'QQQ', price: 398.75, change: -1.25, changePercent: -0.0031, volume: 28475000000 },
]

export function MarketOverview() {
  return (
    <div className="aiq-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Market Overview</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <span>Last updated:</span>
          <span className="text-aiiq-cyber">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {mockMarketData.map((market) => (
          <div key={market.symbol} className="bg-aiiq-lighter rounded-lg p-4 border border-aiiq-light hover:border-aiiq-cyber transition-colors duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-white">{market.symbol}</h3>
              <div className={getChangeColor(market.changePercent)}>
                {getChangeIcon(market.changePercent)}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xl font-bold text-white">
                {formatCurrency(market.price)}
              </p>
              <div className="flex items-center space-x-2">
                <span className={getChangeColor(market.change)}>
                  {market.change > 0 ? '+' : ''}{formatCurrency(market.change)}
                </span>
                <span className={getChangeColor(market.changePercent)}>
                  ({market.changePercent > 0 ? '+' : ''}{formatPercentage(market.changePercent)})
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Vol: {formatCurrency(market.volume)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Market Sentiment */}
      <div className="mt-6 pt-6 border-t border-aiiq-light">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Market Sentiment</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Fear & Greed Index:</span>
            <span className="text-aiiq-gold font-bold">65</span>
            <span className="text-sm text-gray-400">(Greed)</span>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-aiiq-lighter rounded-lg p-3 text-center">
            <p className="text-sm text-gray-400">VIX</p>
            <p className="text-lg font-bold text-white">18.5</p>
            <p className="text-xs text-aiiq-success">-2.1%</p>
          </div>
          
          <div className="bg-aiiq-lighter rounded-lg p-3 text-center">
            <p className="text-sm text-gray-400">Put/Call Ratio</p>
            <p className="text-lg font-bold text-white">0.85</p>
            <p className="text-xs text-aiiq-warning">+0.12</p>
          </div>
          
          <div className="bg-aiiq-lighter rounded-lg p-3 text-center">
            <p className="text-sm text-gray-400">Options Flow</p>
            <p className="text-lg font-bold text-white">Bullish</p>
            <p className="text-xs text-aiiq-success">+15%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

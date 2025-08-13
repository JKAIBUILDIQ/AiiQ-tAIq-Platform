'use client'

import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react'
import { getChangeColor, formatCurrency, formatPercentage } from '@/lib/utils'

interface Position {
  id: string
  symbol: string
  type: 'call' | 'put' | 'stock' | 'crypto'
  quantity: number
  avgPrice: number
  currentPrice: number
  pnl: number
  pnlPercent: number
  delta: number
  gamma: number
  theta: number
  vega: number
}

const mockPositions: Position[] = [
  {
    id: '1',
    symbol: 'BTC-26JAN24-45000-C',
    type: 'call',
    quantity: 2,
    avgPrice: 1200.00,
    currentPrice: 1250.50,
    pnl: 101.00,
    pnlPercent: 0.0842,
    delta: 0.65,
    gamma: 0.0023,
    theta: -45.20,
    vega: 125.80
  },
  {
    id: '2',
    symbol: 'ETH-26JAN24-2700-P',
    type: 'put',
    quantity: 5,
    avgPrice: 95.00,
    currentPrice: 89.25,
    pnl: -28.75,
    pnlPercent: -0.0605,
    delta: -0.45,
    gamma: 0.0018,
    theta: -32.10,
    vega: 89.50
  },
  {
    id: '3',
    symbol: 'SOL',
    type: 'crypto',
    quantity: 100,
    avgPrice: 95.50,
    currentPrice: 98.75,
    pnl: 325.00,
    pnlPercent: 0.0340,
    delta: 1.0,
    gamma: 0,
    theta: 0,
    vega: 0
  }
]

export function QuickPositions() {
  const totalPnl = mockPositions.reduce((sum, pos) => sum + pos.pnl, 0)
  const totalPnlPercent = mockPositions.reduce((sum, pos) => sum + pos.pnlPercent, 0) / mockPositions.length

  return (
    <div className="aiq-card rounded-2xl border-aiiq-light/30 bg-aiiq-dark/60 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Quick Positions</h2>
        <button className="aiq-button-primary text-sm px-3 py-1">
          View All
        </button>
      </div>
      
      {/* Portfolio Summary */}
      <div className="bg-aiiq-lighter rounded-lg p-4 mb-6 border border-aiiq-light">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-400">Total P&L</p>
            <p className={`text-2xl font-bold ${getChangeColor(totalPnl)}`}>
              {totalPnl > 0 ? '+' : ''}{formatCurrency(totalPnl)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">P&L %</p>
            <p className={`text-2xl font-bold ${getChangeColor(totalPnlPercent)}`}>
              {totalPnlPercent > 0 ? '+' : ''}{formatPercentage(totalPnlPercent)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Positions List */}
      <div className="space-y-4">
        {mockPositions.map((position) => (
          <div key={position.id} className="bg-aiiq-lighter rounded-lg p-4 border border-aiiq-light hover:border-aiiq-cyber transition-colors duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-aiiq-cyber">{position.symbol}</span>
                <span className={`aiq-badge ${
                  position.type === 'call' ? 'aiq-badge-bull' : 
                  position.type === 'put' ? 'aiq-badge-bear' : 'aiq-badge-neutral'
                }`}>
                  {position.type.toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-400">
                {position.quantity} contracts
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-gray-400">Avg Price</p>
                <p className="font-semibold text-white">{formatCurrency(position.avgPrice)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Current</p>
                <p className="font-semibold text-white">{formatCurrency(position.currentPrice)}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className={`text-lg font-bold ${getChangeColor(position.pnl)}`}>
                {position.pnl > 0 ? '+' : ''}{formatCurrency(position.pnl)}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span>Δ: {position.delta.toFixed(3)}</span>
                <span>Γ: {position.gamma.toFixed(4)}</span>
                <span>Θ: {position.theta.toFixed(1)}</span>
                <span>V: {position.vega.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-aiiq-light">
        <div className="grid grid-cols-2 gap-3">
          <button className="aiq-button-success text-sm px-3 py-2">
            <TrendingUp className="h-4 w-4 mr-2" />
            Close All
          </button>
          <button className="aiq-button-secondary text-sm px-3 py-2">
            <PieChart className="h-4 w-4 mr-2" />
            Analyze
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { Star, TrendingUp, TrendingDown } from 'lucide-react'
import { getChangeColor, formatCurrency, formatPercentage } from '@/lib/utils'

interface WatchlistItem {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  isFavorite: boolean
}

const mockWatchlist: WatchlistItem[] = [
  { id: '1', symbol: 'BTC-26JAN24-45000-C', name: 'Bitcoin Call 45K Jan 26', price: 1250.50, change: 125.75, changePercent: 0.1118, volume: 1250, isFavorite: true },
  { id: '2', symbol: 'ETH-26JAN24-2700-P', name: 'Ethereum Put 2.7K Jan 26', price: 89.25, change: -12.80, changePercent: -0.1254, volume: 890, isFavorite: true },
  { id: '3', symbol: 'SOL-26JAN24-100-C', name: 'Solana Call 100 Jan 26', price: 15.75, change: 2.25, changePercent: 0.1667, volume: 1575, isFavorite: false },
  { id: '4', symbol: 'SPY-26JAN24-470-C', name: 'SPY Call 470 Jan 26', price: 8.50, change: 0.75, changePercent: 0.0968, volume: 850, isFavorite: true },
  { id: '5', symbol: 'QQQ-26JAN24-400-P', name: 'QQQ Put 400 Jan 26', price: 12.25, change: -1.50, changePercent: -0.1091, volume: 1225, isFavorite: false },
]

export function Watchlist() {
  return (
    <div className="aiq-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Watchlist</h2>
        <button className="aiq-button-secondary text-sm px-3 py-1">
          Add Symbol
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="aiq-table">
          <thead>
            <tr>
              <th className="w-12"></th>
              <th>Symbol</th>
              <th>Name</th>
              <th>Price</th>
              <th>Change</th>
              <th>Change %</th>
              <th>Volume</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockWatchlist.map((item) => (
              <tr key={item.id} className="hover:bg-aiiq-lighter/50 transition-colors duration-200">
                <td className="text-center">
                  <button className="text-aiiq-gold hover:text-aiiq-gold/80 transition-colors">
                    <Star className={`h-4 w-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </td>
                <td>
                  <span className="font-mono text-aiiq-cyber">{item.symbol}</span>
                </td>
                <td className="max-w-xs truncate">{item.name}</td>
                <td className="font-bold">{formatCurrency(item.price)}</td>
                <td className={getChangeColor(item.change)}>
                  {item.change > 0 ? '+' : ''}{formatCurrency(item.change)}
                </td>
                <td className={getChangeColor(item.changePercent)}>
                  {item.changePercent > 0 ? '+' : ''}{formatPercentage(item.changePercent)}
                </td>
                <td className="text-gray-400">{item.volume.toLocaleString()}</td>
                <td>
                  <div className="flex items-center space-x-2">
                    <button className="aiq-button-success text-xs px-2 py-1">
                      Trade
                    </button>
                    <button className="aiq-button-secondary text-xs px-2 py-1">
                      Chart
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">
          {mockWatchlist.filter(item => item.isFavorite).length} items in watchlist
        </p>
      </div>
    </div>
  )
}

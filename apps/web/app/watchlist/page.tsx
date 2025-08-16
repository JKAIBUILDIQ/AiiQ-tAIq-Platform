"use client"

import React, { useState, useEffect } from 'react'
import { Plus, Search, Star, TrendingUp, TrendingDown, RefreshCw, Settings, Filter, Download, Eye, AlertTriangle } from 'lucide-react'

export default function WatchlistPage() {
  // Default values for server-side rendering
  const defaultWatchlists = [
    {
      id: 1,
      name: 'Major Indices',
      symbols: ['SPY', 'QQQ', 'IWM', 'DIA', 'VTI'],
      description: 'Core market indices and ETFs'
    },
    {
      id: 2,
      name: 'Tech Leaders',
      symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA'],
      description: 'Top technology companies'
    },
    {
      id: 3,
      name: 'Crypto & Commodities',
      symbols: ['BTC', 'ETH', 'SOL', 'GLD', 'SLV', 'USO'],
      description: 'Digital assets and commodities'
    }
  ]

  const [watchlists, setWatchlists] = useState(defaultWatchlists)
  const [activeWatchlist, setActiveWatchlist] = useState('1')
  const [liveData, setLiveData] = useState({})
  const [isHydrated, setIsHydrated] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddSymbol, setShowAddSymbol] = useState(false)
  const [newSymbol, setNewSymbol] = useState('')
  const [lastUpdate, setLastUpdate] = useState('')

  // Hydrate from localStorage after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedWatchlists = localStorage.getItem('aiiq-watchlists')
        if (savedWatchlists) {
          setWatchlists(JSON.parse(savedWatchlists))
        }
        
        const savedActiveWatchlist = localStorage.getItem('aiiq-active-watchlist')
        if (savedActiveWatchlist) {
          setActiveWatchlist(savedActiveWatchlist)
        }
        
        const savedLiveData = localStorage.getItem('aiiq-live-data')
        if (savedLiveData) {
          setLiveData(JSON.parse(savedLiveData))
        }
        
        setIsHydrated(true)
      } catch (error) {
        console.error('Error loading from localStorage:', error)
        setIsHydrated(true)
      }
    }
  }, [])

  // ✅ Save data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aiiq-watchlists', JSON.stringify(watchlists))
    }
  }, [watchlists])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aiiq-active-watchlist', activeWatchlist)
    }
  }, [activeWatchlist])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aiiq-live-data', JSON.stringify(liveData))
    }
  }, [liveData])

  // ✅ Smart data refresh - only fetch if data is stale
  const shouldRefreshData = () => {
    const lastUpdate = localStorage.getItem('aiiq-last-update')
    if (!lastUpdate) return true
    
    const timeSinceUpdate = Date.now() - parseInt(lastUpdate)
    const oneHour = 60 * 60 * 1000 // 1 hour in milliseconds
    
    return timeSinceUpdate > oneHour
  }

  // Fetch live data for all symbols in active watchlist
  const fetchLiveData = async () => {
    setIsLoading(true)
    try {
      const currentWatchlist = watchlists.find(w => w.id === parseInt(activeWatchlist))
      if (!currentWatchlist) return

      const newData: any = {}
      
      for (const symbol of currentWatchlist.symbols) {
        try {
          const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=4U0QGD3MBDA5X4AK`)
          const data = await response.json()
          
          if (data['Global Quote']) {
            const quote = data['Global Quote']
            newData[symbol] = {
              price: parseFloat(quote['05. price']) || 0,
              change: parseFloat(quote['09. change']) || 0,
              changePercent: quote['10. change percent'] || '0%',
              open: parseFloat(quote['02. open']) || 0,
              high: parseFloat(quote['03. high']) || 0,
              low: parseFloat(quote['04. low']) || 0,
              volume: parseInt(quote['06. volume']) || 0,
              lastUpdated: new Date().toLocaleTimeString()
            }
          }
        } catch (error) {
          console.error(`Error fetching data for ${symbol}:`, error)
        }
      }
      
      setLiveData(newData)
      setLastUpdate(new Date().toLocaleTimeString())
      
      // ✅ Save timestamp of last update
      if (typeof window !== 'undefined') {
        localStorage.setItem('aiiq-last-update', Date.now().toString())
      }
    } catch (error) {
      console.error('Error fetching live data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-refresh data every hour (3600000 ms)
  useEffect(() => {
    // Only fetch data if it's stale or doesn't exist
    if (shouldRefreshData() || Object.keys(liveData).length === 0) {
      fetchLiveData()
    }
    
    const interval = setInterval(fetchLiveData, 3600000) // 1 hour
    return () => clearInterval(interval)
  }, [activeWatchlist])

  const addSymbol = () => {
    if (newSymbol.trim() && !watchlists.find(w => w.id === parseInt(activeWatchlist))?.symbols.includes(newSymbol.toUpperCase())) {
      const updatedWatchlists = watchlists.map(w => 
        w.id === parseInt(activeWatchlist) 
          ? { ...w, symbols: [...w.symbols, newSymbol.toUpperCase()] }
          : w
      )
      setWatchlists(updatedWatchlists)
      setNewSymbol('')
      setShowAddSymbol(false)
      
      // Fetch data for new symbol
      setTimeout(fetchLiveData, 100)
    }
  }

  const removeSymbol = (symbol: string) => {
    const updatedWatchlists = watchlists.map(w => 
      w.id === parseInt(activeWatchlist) 
        ? { ...w, symbols: w.symbols.filter(s => s !== symbol) }
        : w
    )
    setWatchlists(updatedWatchlists)
    
    // Remove from live data
    const updatedLiveData = { ...liveData }
    delete updatedLiveData[symbol]
    setLiveData(updatedLiveData)
  }

  const currentWatchlist = watchlists.find(w => w.id === parseInt(activeWatchlist))
  const totalSymbols = currentWatchlist?.symbols.length || 0
  const gainers = Object.values(liveData).filter((data: any) => data.change > 0).length
  const losers = Object.values(liveData).filter((data: any) => data.change < 0).length

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-aiiq-darker text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aiiq-cyber mx-auto mb-4"></div>
          <p className="text-gray-400">Loading watchlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-aiiq-darker text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-aiiq-display aiiq-gradient-text mb-4">
            �� Professional Watchlist
          </h1>
          <p className="text-gray-300 text-lg">
            Real-time market data powered by Alpha Vantage Premium API
          </p>
        </div>

        {/* Summary Panels */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="aiiq-card p-6">
            <h3 className="text-lg font-semibold text-aiiq-cyber mb-2">Total P&L</h3>
            <div className="text-3xl font-bold text-green-400">+$227.92</div>
            <p className="text-sm text-gray-400">Today's performance</p>
          </div>
          
          <div className="aiiq-card p-6">
            <h3 className="text-lg font-semibold text-aiiq-cyber mb-2">Positions</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">BTC-26JAN24-45000-C</span>
                <span className="text-green-400">+$101.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">ETH-26JAN24-2700-P</span>
                <span className="text-red-400">-$28.75</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">SOL</span>
                <span className="text-green-400">+$325.00</span>
              </div>
            </div>
          </div>
          
          <div className="aiiq-card p-6">
            <h3 className="text-lg font-semibold text-aiiq-cyber mb-2">Portfolio Greeks</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Δ 0.24</div>
              <div>Γ 0.0047</div>
              <div>Θ -30.1</div>
              <div>V 80.3</div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Hover the symbols for definitions</p>
          </div>
          
          <div className="aiiq-card p-6">
            <h3 className="text-lg font-semibold text-aiiq-cyber mb-2">Risk Management</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Current VaR</span>
                <span className="text-yellow-400">3.29%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Max VaR</span>
                <span className="text-green-400">5.00%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '65.8%' }}></div>
              </div>
              <div className="text-center text-sm">Risk Level: 65.8%</div>
              <div className="text-center">
                <span className="text-green-400 font-semibold">STABLE</span>
                <div className="text-2xl font-bold">5.0</div>
              </div>
            </div>
          </div>
        </div>

        {/* Watchlist Tabs */}
        <div className="aiiq-card p-6 mb-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {watchlists.map((watchlist) => (
              <button
                key={watchlist.id}
                onClick={() => setActiveWatchlist(watchlist.id.toString())}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  activeWatchlist === watchlist.id.toString()
                    ? 'bg-aiiq-cyber text-white border-aiiq-cyber shadow-lg'
                    : 'bg-aiiq-dark text-gray-300 border-aiiq-cyber/30 hover:border-aiiq-cyber/60'
                }`}
              >
                {watchlist.name}
              </button>
            ))}
          </div>

          {/* Search and Add Symbol */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="🔍 Search symbols..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-aiiq-dark border border-aiiq-cyber/30 rounded-lg text-white placeholder-gray-400 focus:border-aiiq-cyber focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowAddSymbol(!showAddSymbol)}
              className="aiiq-button flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Symbol
            </button>
          </div>

          {/* Add Symbol Form */}
          {showAddSymbol && (
            <div className="bg-aiiq-dark/50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Enter symbol (e.g., AAPL)"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2 bg-aiiq-dark border border-aiiq-cyber/30 rounded-lg text-white placeholder-gray-400 focus:border-aiiq-cyber focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && addSymbol()}
                />
                <button onClick={addSymbol} className="aiiq-button">
                  Add
                </button>
                <button 
                  onClick={() => setShowAddSymbol(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Watchlist Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-aiiq-cyber/30">
                  <th className="text-left py-3 px-4 text-aiiq-cyber">Symbol</th>
                  <th className="text-right py-3 px-4 text-aiiq-cyber">Price</th>
                  <th className="text-right py-3 px-4 text-aiiq-cyber">Change</th>
                  <th className="text-right py-3 px-4 text-aiiq-cyber">Open</th>
                  <th className="text-right py-3 px-4 text-aiiq-cyber">High</th>
                  <th className="text-right py-3 px-4 text-aiiq-cyber">Low</th>
                  <th className="text-right py-3 px-4 text-aiiq-cyber">Volume</th>
                  <th className="text-center py-3 px-4 text-aiiq-cyber">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentWatchlist?.symbols
                  .filter(symbol => 
                    searchTerm === '' || 
                    symbol.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((symbol) => {
                    const data = liveData[symbol]
                    return (
                      <tr key={symbol} className="border-b border-aiiq-cyber/20 hover:bg-aiiq-dark/30">
                        <td className="py-3 px-4 font-semibold text-aiiq-cyber">{symbol}</td>
                        <td className="py-3 px-4 text-right">
                          {data ? `$${data.price.toFixed(2)}` : 'Loading...'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {data ? (
                            <span className={`flex items-center justify-end ${
                              data.change >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {data.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                              ${data.change.toFixed(2)} ({data.changePercent})
                            </span>
                          ) : 'Loading...'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {data ? `$${data.open.toFixed(2)}` : 'Loading...'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {data ? `$${data.high.toFixed(2)}` : 'Loading...'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {data ? `$${data.low.toFixed(2)}` : 'Loading...'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {data ? data.volume.toLocaleString() : 'Loading...'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button className="text-blue-400 hover:text-blue-300 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => removeSymbol(symbol)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>

          {/* Update Info and Summary */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">
                Last Update: {lastUpdate || 'Never'}
              </span>
              <button 
                onClick={fetchLiveData}
                disabled={isLoading}
                className="aiiq-button-sm flex items-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Updating...' : 'Refresh Now'}
              </button>
              <span className="text-sm text-gray-400">Auto-refresh: Every hour</span>
            </div>
          </div>

          {/* Summary Boxes */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-aiiq-dark/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-aiiq-cyber">{totalSymbols}</div>
              <div className="text-sm text-gray-400">Total Symbols</div>
            </div>
            <div className="bg-aiiq-dark/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{gainers}</div>
              <div className="text-sm text-gray-400">Gainers</div>
            </div>
            <div className="bg-aiiq-dark/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{losers}</div>
              <div className="text-sm text-gray-400">Losers</div>
            </div>
            <div className="bg-aiiq-dark/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{totalSymbols}</div>
              <div className="text-sm text-gray-400">Watchlist Size</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
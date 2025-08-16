"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, Star, Award, Target, BarChart3, Users, Calendar, TrendingDown, CheckCircle, AlertTriangle, Zap, Building2, Globe, DollarSign, PieChart, Eye, RefreshCw, Database, Bot, TrendingUp2, Shield, Target as TargetIcon, BarChart3 as BarChartIcon, Clock, DollarSign as DollarIcon, AlertTriangle as AlertIcon, Bitcoin, Coins, TrendingDown2, Activity, MapPin, Flame, Zap as ZapIcon } from 'lucide-react'

export default function CryptoTradersPage() {
  const [activeTrader, setActiveTrader] = useState('bitcoin-maximalist')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('2025-01-15')

  // Data structure for Ollama bots to populate
  const [tradersData, setTradersData] = useState([
    {
      id: 'bitcoin-maximalist',
      name: 'Bitcoin Maximalist',
      type: 'BTC-First Strategy',
      monthlyReturn: 28.9,
      avg24Month: 35.4,
      aiScore: 82,
      riskRating: 'High',
      successRate: 65,
      maxDrawdown: 42.8,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      portfolioAllocation: [],
      tradingHistory: [],
      marketAnalysis: [],
      socialMediaActivity: [],
      // Crypto specific fields
      blockchainFocus: '',
      defiExposure: 0,
      nftHoldings: [],
      stakingRewards: 0,
      miningOperations: {},
      // Performance tracking
      winRate: 0,
      averageReturn: 0,
      largestWin: 0,
      largestLoss: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      // Risk metrics
      volatilityScore: 0,
      correlationRisk: 0,
      liquidityRisk: 0,
      regulatoryRisk: 0,
      // Market timing
      entryPoints: [],
      exitStrategies: [],
      hodlPeriod: 0,
      rebalancingFrequency: ''
    },
    {
      id: 'defi-farmer',
      name: 'DeFi Yield Farmer',
      type: 'Yield Optimization',
      monthlyReturn: 35.7,
      avg24Month: 41.2,
      aiScore: 78,
      riskRating: 'Very High',
      successRate: 52,
      maxDrawdown: 58.4,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      portfolioAllocation: [],
      tradingHistory: [],
      marketAnalysis: [],
      socialMediaActivity: [],
      // Crypto specific fields
      blockchainFocus: '',
      defiExposure: 0,
      nftHoldings: [],
      stakingRewards: 0,
      miningOperations: {},
      // Performance tracking
      winRate: 0,
      averageReturn: 0,
      largestWin: 0,
      largestLoss: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      // Risk metrics
      volatilityScore: 0,
      correlationRisk: 0,
      liquidityRisk: 0,
      regulatoryRisk: 0,
      // Market timing
      entryPoints: [],
      exitStrategies: [],
      hodlPeriod: 0,
      rebalancingFrequency: ''
    },
    {
      id: 'nft-trader',
      name: 'NFT Trader',
      type: 'Digital Asset Trading',
      monthlyReturn: 45.2,
      avg24Month: 52.8,
      aiScore: 71,
      riskRating: 'Extreme',
      successRate: 38,
      maxDrawdown: 72.6,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      portfolioAllocation: [],
      tradingHistory: [],
      marketAnalysis: [],
      socialMediaActivity: [],
      // Crypto specific fields
      blockchainFocus: '',
      defiExposure: 0,
      nftHoldings: [],
      stakingRewards: 0,
      miningOperations: {},
      // Performance tracking
      winRate: 0,
      averageReturn: 0,
      largestWin: 0,
      largestLoss: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      // Risk metrics
      volatilityScore: 0,
      correlationRisk: 0,
      liquidityRisk: 0,
      regulatoryRisk: 0,
      // Market timing
      entryPoints: [],
      exitStrategies: [],
      hodlPeriod: 0,
      rebalancingFrequency: ''
    }
  ])

  // Function for Ollama bots to update data
  const updateTraderData = (traderId: string, newData: any) => {
    setTradersData(prev => prev.map(trader => 
      trader.id === traderId ? { ...trader, ...newData } : trader
    ))
  }

  // Simulate Ollama bot data refresh
  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLastUpdated(new Date().toISOString().split('T')[0])
    setIsLoading(false)
  }

  const renderTraderCard = (trader: any) => (
    <div key={trader.id} className="aiiq-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Bitcoin className="w-5 h-5 text-orange-500" />
            <h3 className="text-xl font-semibold text-aiiq-cyber">
              {trader.name}
            </h3>
          </div>
          <p className="text-gray-400 text-sm mb-1">{trader.type}</p>
          <p className="text-gray-400 text-sm mb-3">Crypto Strategy</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-aiiq-cyber">{trader.aiScore}</div>
          <div className="text-sm text-gray-400">pAIt Score</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-400">{trader.monthlyReturn}%</div>
          <div className="text-xs text-gray-400">Monthly Return</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-aiiq-cyber">{trader.avg24Month}%</div>
          <div className="text-xs text-gray-400">24-Month Avg</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${
            trader.riskRating === 'Low' ? 'text-green-400' :
            trader.riskRating === 'Medium' ? 'text-yellow-400' :
            trader.riskRating === 'High' ? 'text-orange-400' :
            trader.riskRating === 'Very High' ? 'text-red-400' :
            'text-red-600'
          }`}>
            {trader.riskRating}
          </div>
          <div className="text-xs text-gray-400">Risk Rating</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-400">{trader.successRate}%</div>
          <div className="text-xs text-gray-400">Success Rate</div>
        </div>
      </div>

      {/* pAIt Crypto Analysis */}
      <div className="bg-aiiq-dark/50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-aiiq-cyber mb-3">pAIt Crypto Trader Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-gray-400">Success Rate</div>
            <div className="text-lg font-semibold text-blue-400">{trader.successRate}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Max Drawdown</div>
            <div className="text-lg font-semibold text-red-400">{trader.maxDrawdown}%</div>
          </div>
        </div>
      </div>

      {/* Ollama Bot Data Areas */}
      <div className="space-y-4 mb-4">
        {/* Portfolio Allocation */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Coins className="w-4 h-4 mr-2" />
            Portfolio Allocation (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {trader.portfolioAllocation.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {trader.portfolioAllocation.map((asset: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {asset.symbol}: {asset.weight}% • Value: ${asset.value}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Blockchain Focus */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <ZapIcon className="w-4 h-4 mr-2" />
            Blockchain Focus (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {trader.blockchainFocus ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-aiiq-dark/50 p-2 rounded">
                  <div className="font-semibold">Primary Chain</div>
                  <div>{trader.blockchainFocus}</div>
                </div>
                <div className="bg-aiiq-dark/50 p-2 rounded">
                  <div className="font-semibold">DeFi Exposure</div>
                  <div>{trader.defiExposure}%</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Risk Metrics (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Volatility Score</div>
                <div>{trader.volatilityScore}/100</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Correlation Risk</div>
                <div>{trader.correlationRisk}%</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Liquidity Risk</div>
                <div>{trader.liquidityRisk}/100</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Regulatory Risk</div>
                <div>{trader.regulatoryRisk}/100</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Tracking */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <TrendingUp2 className="w-4 h-4 mr-2" />
            Performance Tracking (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Win Rate</div>
                <div>{trader.winRate}%</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Sharpe Ratio</div>
                <div>{trader.sharpeRatio.toFixed(2)}</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Largest Win</div>
                <div className="text-green-400">${trader.largestWin}</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Largest Loss</div>
                <div className="text-red-400">${trader.largestLoss}</div>
              </div>
            </div>
          </div>
        </div>

        {/* NFT Holdings */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Flame className="w-4 h-4 mr-2" />
            NFT Holdings (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {trader.nftHoldings.length > 0 ? (
              <div className="space-y-1">
                {trader.nftHoldings.map((nft: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {nft.collection}: {nft.name} • Floor: {nft.floorPrice} ETH
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Market Timing */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Market Timing (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">HODL Period</div>
                <div>{trader.hodlPeriod} days avg</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Rebalancing</div>
                <div>{trader.rebalancingFrequency}</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Entry Points</div>
                <div>{trader.entryPoints.length} tracked</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Exit Strategies</div>
                <div>{trader.exitStrategies.length} defined</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Last updated: {trader.lastUpdated}</span>
        <button className="aiiq-button-sm">
          <Target className="w-3 h-3 mr-1" />
          View Strategy
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-aiiq-darker text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-aiiq-display aiiq-gradient-text mb-4">
            ₿ Crypto Traders
          </h1>
          <p className="text-gray-300 text-lg">
            Cryptocurrency trading strategies with extreme volatility and high risk/reward profiles
          </p>
          
          {/* Ollama Bot Status */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-aiiq-cyber" />
              <span className="text-sm text-gray-300">Ollama Bot Status: Active</span>
            </div>
            <button 
              onClick={refreshData}
              disabled={isLoading}
              className="aiiq-button-sm flex items-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Updating...' : 'Refresh Data'}
            </button>
            <span className="text-sm text-gray-400">
              Last Updated: {lastUpdated}
            </span>
          </div>
        </div>

        {/* Trader Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {tradersData.map((trader) => (
            <button
              key={trader.id}
              onClick={() => setActiveTrader(trader.id)}
              className={`p-4 rounded-lg border transition-all ${
                activeTrader === trader.id
                  ? 'bg-aiiq-cyber text-white border-aiiq-cyber shadow-lg'
                  : 'bg-aiiq-dark text-gray-300 border-aiiq-cyber/30 hover:border-aiiq-cyber/60'
              }`}
            >
              <div className="text-lg font-semibold mb-1">{trader.name}</div>
              <div className="text-sm opacity-75">{trader.type}</div>
              <div className="text-xs opacity-60 mt-1">pAIt: {trader.aiScore}</div>
            </button>
          ))}
        </div>

        {/* Selected Trader Details */}
        <div className="space-y-6">
          {tradersData.map(trader => 
            activeTrader === trader.id && renderTraderCard(trader)
          )}
        </div>

        {/* pAIt Methodology for Crypto */}
        <div className="mt-12 bg-gradient-to-r from-aiiq-cyber/20 to-aiiq-cyber/10 rounded-lg p-6 border border-aiiq-cyber/30">
          <h3 className="text-lg font-semibold text-aiiq-cyber mb-4"> pAIt Crypto Trader Methodology</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Volatility Analysis</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-blue-400">Success Rate:</span> Win/loss ratio in extreme markets</li>
                <li>• <span className="text-green-400">Max Drawdown:</span> Worst-case scenario analysis</li>
                <li>• <span className="text-yellow-400">Risk/Reward:</span> Potential gain vs. catastrophic loss</li>
                <li>• <span className="text-purple-400">Market Timing:</span> Entry/exit in volatile conditions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Ollama Bot Data Collection</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-green-400">Portfolio Allocation:</span> Crypto asset distribution</li>
                <li>• <span className="text-aiiq-cyber">Blockchain Focus:</span> Primary chains and DeFi exposure</li>
                <li>• <span className="text-yellow-400">Risk Metrics:</span> Volatility, correlation, liquidity</li>
                <li>• <span className="text-red-400">Market Timing:</span> HODL periods and rebalancing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
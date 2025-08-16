"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, Star, Award, Target, BarChart3, Users, Calendar, TrendingDown, CheckCircle, AlertTriangle, Zap, Building2, Globe, DollarSign, PieChart, Eye, RefreshCw, Database, Bot, PieChart as PieChartIcon, TrendingUp2, BarChart3 as BarChartIcon } from 'lucide-react'

export default function InstitutionalFundsPage() {
  const [activeFund, setActiveFund] = useState('arkk')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('2025-01-15')

  // Data structure for Ollama bots to populate
  const [fundsData, setFundsData] = useState([
    {
      id: 'arkk',
      name: 'ARK Innovation ETF',
      ticker: 'ARKK',
      firm: 'ARK Invest',
      strategy: 'Innovation & Disruption',
      aum: '8.2B',
      monthlyReturn: 15.3,
      avg24Month: 22.1,
      aiScore: 87,
      riskRating: 'High',
      strategyConsistency: 78,
      managerAttribution: 65,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      topHoldings: [],
      sectorAllocation: [],
      recentTrades: [],
      performanceHistory: [],
      riskMetrics: {},
      fundFlows: [],
      expenseRatio: 0.75,
      inceptionDate: '2014-10-31',
      benchmark: 'S&P 500',
      trackingError: 2.3
    },
    {
      id: 'spy',
      name: 'SPDR S&P 500 ETF',
      ticker: 'SPY',
      firm: 'State Street',
      strategy: 'Large Cap Index',
      aum: '450.2B',
      monthlyReturn: 6.8,
      avg24Month: 12.4,
      aiScore: 92,
      riskRating: 'Low',
      strategyConsistency: 95,
      managerAttribution: 15,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      topHoldings: [],
      sectorAllocation: [],
      recentTrades: [],
      performanceHistory: [],
      riskMetrics: {},
      fundFlows: [],
      expenseRatio: 0.0945,
      inceptionDate: '1993-01-29',
      benchmark: 'S&P 500',
      trackingError: 0.1
    },
    {
      id: 'qqq',
      name: 'Invesco QQQ Trust',
      ticker: 'QQQ',
      firm: 'Invesco',
      strategy: 'NASDAQ-100 Index',
      aum: '245.7B',
      monthlyReturn: 8.9,
      avg24Month: 16.2,
      aiScore: 89,
      riskRating: 'Medium',
      strategyConsistency: 88,
      managerAttribution: 25,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      topHoldings: [],
      sectorAllocation: [],
      recentTrades: [],
      performanceHistory: [],
      riskMetrics: {},
      fundFlows: [],
      expenseRatio: 0.20,
      inceptionDate: '1999-03-10',
      benchmark: 'NASDAQ-100',
      trackingError: 0.2
    }
  ])

  // Function for Ollama bots to update data
  const updateFundData = (fundId: string, newData: any) => {
    setFundsData(prev => prev.map(fund => 
      fund.id === fundId ? { ...fund, ...newData } : fund
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

  const renderFundCard = (fund: any) => (
    <div key={fund.id} className="aiiq-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-aiiq-cyber mb-2">
            {fund.name} ({fund.ticker})
          </h3>
          <p className="text-gray-400 text-sm mb-1">{fund.firm}</p>
          <p className="text-gray-400 text-sm mb-3">{fund.strategy} • AUM: ${fund.aum}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-aiiq-cyber">{fund.aiScore}</div>
          <div className="text-sm text-gray-400">pAIt Score</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-400">{fund.monthlyReturn}%</div>
          <div className="text-xs text-gray-400">Monthly Return</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-aiiq-cyber">{fund.avg24Month}%</div>
          <div className="text-xs text-gray-400">24-Month Avg</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${
            fund.riskRating === 'Low' ? 'text-green-400' :
            fund.riskRating === 'Medium' ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {fund.riskRating}
          </div>
          <div className="text-xs text-gray-400">Risk Rating</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-400">{fund.aum}</div>
          <div className="text-xs text-gray-400">Assets</div>
        </div>
      </div>

      {/* pAIt Fund Analysis */}
      <div className="bg-aiiq-dark/50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-aiiq-cyber mb-3">pAIt Fund Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-gray-400">Strategy Consistency</div>
            <div className="text-lg font-semibold text-blue-400">{fund.strategyConsistency}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Manager Attribution</div>
            <div className="text-lg font-semibold text-green-400">{fund.managerAttribution}</div>
          </div>
        </div>
      </div>

      {/* Ollama Bot Data Areas */}
      <div className="space-y-4 mb-4">
        {/* Top Holdings */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <PieChartIcon className="w-4 h-4 mr-2" />
            Top Holdings (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {fund.topHoldings.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {fund.topHoldings.map((holding: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {holding.symbol}: {holding.weight}%
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Sector Allocation */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <BarChartIcon className="w-4 h-4 mr-2" />
            Sector Allocation (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {fund.sectorAllocation.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {fund.sectorAllocation.map((sector: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {sector.name}: {sector.weight}%
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Recent Trades */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <TrendingUp2 className="w-4 h-4 mr-2" />
            Recent Trades (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {fund.recentTrades.length > 0 ? (
              <div className="space-y-1">
                {fund.recentTrades.map((trade: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {trade.date}: {trade.action} {trade.symbol} - {trade.volume} shares
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Fund Details */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Database className="w-4 h-4 mr-2" />
            Fund Details (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-aiiq-dark/50 p-2 rounded">
                Expense Ratio: {fund.expenseRatio}%
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                Inception: {fund.inceptionDate}
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                Benchmark: {fund.benchmark}
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                Tracking Error: {fund.trackingError}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Last updated: {fund.lastUpdated}</span>
        <button className="aiiq-button-sm">
          <PieChart className="w-3 h-3 mr-1" />
          View Holdings
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-aiiq-darker text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-aiiq-display aiiq-gradient-text mb-4">
            🏦 Institutional Funds
          </h1>
          <p className="text-gray-300 text-lg">
            ETF strategies, fund performance, and manager attribution analysis
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

        {/* Fund Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {fundsData.map((fund) => (
            <button
              key={fund.id}
              onClick={() => setActiveFund(fund.id)}
              className={`p-4 rounded-lg border transition-all ${
                activeFund === fund.id
                  ? 'bg-aiiq-cyber text-white border-aiiq-cyber shadow-lg'
                  : 'bg-aiiq-dark text-gray-300 border-aiiq-cyber/30 hover:border-aiiq-cyber/60'
              }`}
            >
              <div className="text-lg font-semibold mb-1">{fund.ticker}</div>
              <div className="text-sm opacity-75">{fund.name}</div>
              <div className="text-xs opacity-60 mt-1">pAIt: {fund.aiScore}</div>
            </button>
          ))}
        </div>

        {/* Selected Fund Details */}
        <div className="space-y-6">
          {fundsData.map(fund => 
            activeFund === fund.id && renderFundCard(fund)
          )}
        </div>

        {/* pAIt Methodology for Funds */}
        <div className="mt-12 bg-gradient-to-r from-aiiq-cyber/20 to-aiiq-cyber/10 rounded-lg p-6 border border-aiiq-cyber/30">
          <h3 className="text-lg font-semibold text-aiiq-cyber mb-4"> pAIt Institutional Fund Methodology</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Performance Analysis</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-blue-400">Strategy Consistency:</span> How well they stick to their stated approach</li>
                <li>• <span className="text-green-400">Manager Attribution:</span> Skill vs. market timing vs. luck</li>
                <li>• <span className="text-yellow-400">Risk Management:</span> Volatility and drawdown control</li>
                <li>• <span className="text-purple-400">Asset Allocation:</span> Sector and company concentration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Ollama Bot Data Collection</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-green-400">Holdings Data:</span> Current positions and changes</li>
                <li>• <span className="text-aiiq-cyber">Performance Metrics:</span> Returns, risk, consistency</li>
                <li>• <span className="text-yellow-400">Strategy Execution:</span> How well they follow their mandate</li>
                <li>• <span className="text-red-400">Fund Flows:</span> Money in/out analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
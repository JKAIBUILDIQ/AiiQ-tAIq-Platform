"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, Star, Award, Target, BarChart3, Users, Calendar, TrendingDown, CheckCircle, AlertTriangle, Zap, Building2, Globe, DollarSign, PieChart, Eye, RefreshCw, Database, Bot, TrendingUp2, Shield, Target as TargetIcon, BarChart3 as BarChartIcon, Clock, DollarSign as DollarIcon, AlertTriangle as AlertIcon, Globe2, TrendingDown2, Activity, MapPin } from 'lucide-react'

export default function ForexStrategiesPage() {
  const [activeStrategy, setActiveStrategy] = useState('carry-trade')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('2025-01-15')

  // Data structure for Ollama bots to populate
  const [strategiesData, setStrategiesData] = useState([
    {
      id: 'carry-trade',
      name: 'Carry Trade Strategy',
      type: 'Interest Rate Arbitrage',
      monthlyReturn: 12.8,
      avg24Month: 18.5,
      aiScore: 85,
      riskRating: 'Medium',
      successRate: 72,
      maxDrawdown: 18.4,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      currencyPairs: [],
      interestRateDiffs: [],
      economicIndicators: [],
      centralBankPolicies: [],
      marketConditions: [],
      // Forex specific fields
      leverage: 0,
      marginRequirement: 0,
      swapRates: {},
      correlationMatrix: {},
      volatilityProfile: {},
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
      var95: 0,
      expectedShortfall: 0,
      stressTestResults: [],
      correlationRisk: 0
    },
    {
      id: 'momentum-trading',
      name: 'Momentum Trading',
      type: 'Trend Following',
      monthlyReturn: 18.9,
      avg24Month: 24.7,
      aiScore: 78,
      riskRating: 'High',
      successRate: 58,
      maxDrawdown: 25.6,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      currencyPairs: [],
      interestRateDiffs: [],
      economicIndicators: [],
      centralBankPolicies: [],
      marketConditions: [],
      // Forex specific fields
      leverage: 0,
      marginRequirement: 0,
      swapRates: {},
      correlationMatrix: {},
      volatilityProfile: {},
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
      var95: 0,
      expectedShortfall: 0,
      stressTestResults: [],
      correlationRisk: 0
    },
    {
      id: 'mean-reversion',
      name: 'Mean Reversion',
      type: 'Range Trading',
      monthlyReturn: 9.4,
      avg24Month: 14.2,
      aiScore: 91,
      riskRating: 'Low',
      successRate: 82,
      maxDrawdown: 12.8,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      currencyPairs: [],
      interestRateDiffs: [],
      economicIndicators: [],
      centralBankPolicies: [],
      marketConditions: [],
      // Forex specific fields
      leverage: 0,
      marginRequirement: 0,
      swapRates: {},
      correlationMatrix: {},
      volatilityProfile: {},
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
      var95: 0,
      expectedShortfall: 0,
      stressTestResults: [],
      correlationRisk: 0
    }
  ])

  // Function for Ollama bots to update data
  const updateStrategyData = (strategyId: string, newData: any) => {
    setStrategiesData(prev => prev.map(strategy => 
      strategy.id === strategyId ? { ...strategy, ...newData } : strategy
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

  const renderStrategyCard = (strategy: any) => (
    <div key={strategy.id} className="aiiq-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Globe2 className="w-5 h-5 text-green-500" />
            <h3 className="text-xl font-semibold text-aiiq-cyber">
              {strategy.name}
            </h3>
          </div>
          <p className="text-gray-400 text-sm mb-1">{strategy.type}</p>
          <p className="text-gray-400 text-sm mb-3">Forex Strategy</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-aiiq-cyber">{strategy.aiScore}</div>
          <div className="text-sm text-gray-400">pAIt Score</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-400">{strategy.monthlyReturn}%</div>
          <div className="text-xs text-gray-400">Monthly Return</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-aiiq-cyber">{strategy.avg24Month}%</div>
          <div className="text-xs text-gray-400">24-Month Avg</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${
            strategy.riskRating === 'Low' ? 'text-green-400' :
            strategy.riskRating === 'Medium' ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {strategy.riskRating}
          </div>
          <div className="text-xs text-gray-400">Risk Rating</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-400">{strategy.successRate}%</div>
          <div className="text-xs text-gray-400">Success Rate</div>
        </div>
      </div>

      {/* pAIt Forex Analysis */}
      <div className="bg-aiiq-dark/50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-aiiq-cyber mb-3">pAIt Forex Strategy Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-gray-400">Success Rate</div>
            <div className="text-lg font-semibold text-blue-400">{strategy.successRate}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Max Drawdown</div>
            <div className="text-lg font-semibold text-red-400">{strategy.maxDrawdown}%</div>
          </div>
        </div>
      </div>

      {/* Ollama Bot Data Areas */}
      <div className="space-y-4 mb-4">
        {/* Currency Pairs */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Currency Pairs (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {strategy.currencyPairs.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {strategy.currencyPairs.map((pair: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {pair.symbol}: {pair.weight}% • Vol: {pair.volatility}%
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Economic Indicators */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <BarChartIcon className="w-4 h-4 mr-2" />
            Economic Indicators (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {strategy.economicIndicators.length > 0 ? (
              <div className="space-y-1">
                {strategy.economicIndicators.map((indicator: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {indicator.name}: {indicator.value} • Impact: {indicator.impact}
                  </div>
                ))}
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
                <div className="font-semibold">VaR (95%)</div>
                <div>{strategy.var95}%</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Sharpe Ratio</div>
                <div>{strategy.sharpeRatio.toFixed(2)}</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Leverage</div>
                <div>{strategy.leverage}:1</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Correlation Risk</div>
                <div>{strategy.correlationRisk}%</div>
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
                <div>{strategy.winRate}%</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Avg Return</div>
                <div>{strategy.averageReturn}%</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Largest Win</div>
                <div className="text-green-400">${strategy.largestWin}</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Largest Loss</div>
                <div className="text-red-400">${strategy.largestLoss}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Central Bank Policies */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Building2 className="w-4 h-4 mr-2" />
            Central Bank Policies (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {strategy.centralBankPolicies.length > 0 ? (
              <div className="space-y-1">
                {strategy.centralBankPolicies.map((policy: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {policy.bank}: {policy.action} • Rate: {policy.rate}% • Impact: {policy.impact}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Last updated: {strategy.lastUpdated}</span>
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
            🌍 Forex Strategies
          </h1>
          <p className="text-gray-300 text-lg">
            Foreign exchange trading strategies with global market analysis
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

        {/* Strategy Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {strategiesData.map((strategy) => (
            <button
              key={strategy.id}
              onClick={() => setActiveStrategy(strategy.id)}
              className={`p-4 rounded-lg border transition-all ${
                activeStrategy === strategy.id
                  ? 'bg-aiiq-cyber text-white border-aiiq-cyber shadow-lg'
                  : 'bg-aiiq-dark text-gray-300 border-aiiq-cyber/30 hover:border-aiiq-cyber/60'
              }`}
            >
              <div className="text-lg font-semibold mb-1">{strategy.name}</div>
              <div className="text-sm opacity-75">{strategy.type}</div>
              <div className="text-xs opacity-60 mt-1">pAIt: {strategy.aiScore}</div>
            </button>
          ))}
        </div>

        {/* Selected Strategy Details */}
        <div className="space-y-6">
          {strategiesData.map(strategy => 
            activeStrategy === strategy.id && renderStrategyCard(strategy)
          )}
        </div>

        {/* pAIt Methodology for Forex */}
        <div className="mt-12 bg-gradient-to-r from-aiiq-cyber/20 to-aiiq-cyber/10 rounded-lg p-6 border border-aiiq-cyber/30">
          <h3 className="text-lg font-semibold text-aiiq-cyber mb-4"> pAIt Forex Strategy Methodology</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Risk Analysis</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-blue-400">Success Rate:</span> Win/loss ratio over time</li>
                <li>• <span className="text-green-400">Max Drawdown:</span> Worst-case scenario analysis</li>
                <li>• <span className="text-yellow-400">Risk/Reward:</span> Potential gain vs. loss</li>
                <li>• <span className="text-purple-400">Market Conditions:</span> Strategy effectiveness</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Ollama Bot Data Collection</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-green-400">Currency Pairs:</span> Pair selection and weights</li>
                <li>• <span className="text-aiiq-cyber">Economic Indicators:</span> GDP, inflation, employment</li>
                <li>• <span className="text-yellow-400">Central Bank Policies:</span> Interest rate decisions</li>
                <li>• <span className="text-red-400">Risk Metrics:</span> VaR, Sharpe ratio, correlation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, Star, Award, Target, BarChart3, Users, Calendar, TrendingDown, CheckCircle, AlertTriangle, Zap, Building2, Globe, DollarSign, PieChart, Eye, RefreshCw, Database, Bot, TrendingUp2, Shield, Target as TargetIcon, BarChart3 as BarChartIcon, Clock, DollarSign as DollarIcon, AlertTriangle as AlertIcon } from 'lucide-react'

export default function OptionsStrategiesPage() {
  const [activeStrategy, setActiveStrategy] = useState('iron-condor')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('2025-01-15')

  // Data structure for Ollama bots to populate
  const [strategiesData, setStrategiesData] = useState([
    {
      id: 'iron-condor',
      name: 'Iron Condor Income',
      type: 'Income Strategy',
      monthlyReturn: 8.5,
      avg24Month: 12.3,
      aiScore: 89,
      riskRating: 'Medium',
      successRate: 78,
      maxLoss: 15.2,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      underlyingAssets: [],
      expirationCycles: [],
      profitTargets: [],
      stopLosses: [],
      marketConditions: [],
      volatilityImpact: {},
      // Options specific fields
      delta: 0,
      gamma: 0,
      theta: 0,
      vega: 0,
      impliedVolatility: 0,
      historicalVolatility: 0,
      maxProfit: 0,
      maxRisk: 0,
      probabilityOfProfit: 0,
      daysToExpiration: 0,
      // Performance tracking
      winRate: 0,
      averageReturn: 0,
      largestWin: 0,
      largestLoss: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0
    },
    {
      id: 'gamma-squeeze',
      name: 'Gamma Squeeze Scanner',
      type: 'Momentum Strategy',
      monthlyReturn: 25.7,
      avg24Month: 31.4,
      aiScore: 76,
      riskRating: 'Very High',
      successRate: 45,
      maxLoss: 35.8,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      underlyingAssets: [],
      expirationCycles: [],
      profitTargets: [],
      stopLosses: [],
      marketConditions: [],
      volatilityImpact: {},
      // Options specific fields
      delta: 0,
      gamma: 0,
      theta: 0,
      vega: 0,
      impliedVolatility: 0,
      historicalVolatility: 0,
      maxProfit: 0,
      maxRisk: 0,
      probabilityOfProfit: 0,
      daysToExpiration: 0,
      // Performance tracking
      winRate: 0,
      averageReturn: 0,
      largestWin: 0,
      largestLoss: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0
    },
    {
      id: 'covered-call',
      name: 'Covered Call Strategy',
      type: 'Income & Growth',
      monthlyReturn: 6.8,
      avg24Month: 10.2,
      aiScore: 92,
      riskRating: 'Low',
      successRate: 85,
      maxLoss: 8.5,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      underlyingAssets: [],
      expirationCycles: [],
      profitTargets: [],
      stopLosses: [],
      marketConditions: [],
      volatilityImpact: {},
      // Options specific fields
      delta: 0,
      gamma: 0,
      theta: 0,
      vega: 0,
      impliedVolatility: 0,
      historicalVolatility: 0,
      maxProfit: 0,
      maxRisk: 0,
      probabilityOfProfit: 0,
      daysToExpiration: 0,
      // Performance tracking
      winRate: 0,
      averageReturn: 0,
      largestWin: 0,
      largestLoss: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0
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
          <h3 className="text-xl font-semibold text-aiiq-cyber mb-2">
            {strategy.name}
          </h3>
          <p className="text-gray-400 text-sm mb-1">{strategy.type}</p>
          <p className="text-gray-400 text-sm mb-3">Options Strategy</p>
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
            strategy.riskRating === 'High' ? 'text-orange-400' :
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

      {/* pAIt Options Analysis */}
      <div className="bg-aiiq-dark/50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-aiiq-cyber mb-3">pAIt Options Strategy Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-gray-400">Success Rate</div>
            <div className="text-lg font-semibold text-blue-400">{strategy.successRate}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Max Loss</div>
            <div className="text-lg font-semibold text-red-400">{strategy.maxLoss}%</div>
          </div>
        </div>
      </div>

      {/* Ollama Bot Data Areas */}
      <div className="space-y-4 mb-4">
        {/* Greeks Analysis */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <BarChartIcon className="w-4 h-4 mr-2" />
            Greeks Analysis (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Δ Delta</div>
                <div>{strategy.delta.toFixed(3)}</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Γ Gamma</div>
                <div>{strategy.gamma.toFixed(4)}</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Θ Theta</div>
                <div>{strategy.theta.toFixed(3)}</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">V Vega</div>
                <div>{strategy.vega.toFixed(3)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Volatility Analysis */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <AlertIcon className="w-4 h-4 mr-2" />
            Volatility Analysis (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Implied Vol</div>
                <div>{strategy.impliedVolatility}%</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Historical Vol</div>
                <div>{strategy.historicalVolatility}%</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Vol Impact</div>
                <div>{strategy.volatilityImpact.impact || 'N/A'}</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Days to Exp</div>
                <div>{strategy.daysToExpiration}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk/Reward Profile */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <TargetIcon className="w-4 h-4 mr-2" />
            Risk/Reward Profile (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Max Profit</div>
                <div className="text-green-400">${strategy.maxProfit}</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Max Risk</div>
                <div className="text-red-400">${strategy.maxRisk}</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Prob of Profit</div>
                <div>{strategy.probabilityOfProfit}%</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Risk/Reward</div>
                <div>1:{(strategy.maxProfit / strategy.maxRisk).toFixed(2)}</div>
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

        {/* Market Conditions */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Market Conditions (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {strategy.marketConditions.length > 0 ? (
              <div className="space-y-1">
                {strategy.marketConditions.map((condition: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {condition.type}: {condition.description} • Success: {condition.successRate}%
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
            �� Options Strategies
          </h1>
          <p className="text-gray-300 text-lg">
            Options trading strategies with risk assessment and success rate analysis
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

        {/* pAIt Methodology for Options */}
        <div className="mt-12 bg-gradient-to-r from-aiiq-cyber/20 to-aiiq-cyber/10 rounded-lg p-6 border border-aiiq-cyber/30">
          <h3 className="text-lg font-semibold text-aiiq-cyber mb-4"> pAIt Options Strategy Methodology</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Risk Analysis</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-blue-400">Success Rate:</span> Win/loss ratio over time</li>
                <li>• <span className="text-green-400">Max Loss:</span> Worst-case scenario analysis</li>
                <li>• <span className="text-yellow-400">Risk/Reward:</span> Potential gain vs. loss</li>
                <li>• <span className="text-purple-400">Market Conditions:</span> Strategy effectiveness</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Ollama Bot Data Collection</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-green-400">Greeks Analysis:</span> Delta, gamma, theta, vega</li>
                <li>• <span className="text-aiiq-cyber">Volatility Impact:</span> IV vs. HV analysis</li>
                <li>• <span className="text-yellow-400">Performance Tracking:</span> Win rates and returns</li>
                <li>• <span className="text-red-400">Market Conditions:</span> Strategy success factors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
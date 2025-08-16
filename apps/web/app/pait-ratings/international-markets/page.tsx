"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, Star, Award, Target, BarChart3, Users, Calendar, TrendingDown, CheckCircle, AlertTriangle, Zap, Building2, Globe, DollarSign, PieChart, Eye, RefreshCw, Database, Bot, TrendingUp2, Shield, Target as TargetIcon, BarChart3 as BarChartIcon, Clock, DollarSign as DollarIcon, AlertTriangle as AlertIcon, Flag, MapPin, Globe2, TrendingDown2, Activity, Building, Gavel, Scale, Banknote } from 'lucide-react'

export default function InternationalMarketsPage() {
  const [activeRegion, setActiveRegion] = useState('india')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('2025-01-15')

  // Data structure for Ollama bots to populate
  const [marketsData, setMarketsData] = useState([
    {
      id: 'india',
      name: 'India Markets',
      region: 'South Asia',
      focus: 'Technology & Financial Services',
      monthlyReturn: 12.8,
      avg24Month: 18.5,
      aiScore: 87,
      riskRating: 'Medium',
      marketAccess: 75,
      regulatoryEnvironment: 82,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      majorIndices: [],
      sectorPerformance: [],
      economicIndicators: [],
      politicalEvents: [],
      // International specific fields
      currencyPair: 'INR/USD',
      exchangeRate: 0,
      interestRate: 0,
      inflationRate: 0,
      gdpGrowth: 0,
      // Market structure
      marketCap: 0,
      tradingVolume: 0,
      foreignInvestment: 0,
      domesticRetail: 0,
      // Risk factors
      politicalStability: 0,
      regulatoryRisk: 0,
      currencyRisk: 0,
      liquidityRisk: 0,
      // Performance tracking
      topPerformers: [],
      worstPerformers: [],
      sectorRotation: [],
      marketSentiment: ''
    },
    {
      id: 'china',
      name: 'China Markets',
      region: 'East Asia',
      focus: 'Manufacturing & Technology',
      monthlyReturn: 8.9,
      avg24Month: 14.2,
      aiScore: 79,
      riskRating: 'High',
      marketAccess: 45,
      regulatoryEnvironment: 68,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      majorIndices: [],
      sectorPerformance: [],
      economicIndicators: [],
      politicalEvents: [],
      // International specific fields
      currencyPair: 'CNY/USD',
      exchangeRate: 0,
      interestRate: 0,
      inflationRate: 0,
      gdpGrowth: 0,
      // Market structure
      marketCap: 0,
      tradingVolume: 0,
      foreignInvestment: 0,
      domesticRetail: 0,
      // Risk factors
      politicalStability: 0,
      regulatoryRisk: 0,
      currencyRisk: 0,
      liquidityRisk: 0,
      // Performance tracking
      topPerformers: [],
      worstPerformers: [],
      sectorRotation: [],
      marketSentiment: ''
    },
    {
      id: 'korea',
      name: 'South Korea Markets',
      region: 'East Asia',
      focus: 'Technology & Automotive',
      monthlyReturn: 15.4,
      avg24Month: 21.8,
      aiScore: 89,
      riskRating: 'Medium',
      marketAccess: 88,
      regulatoryEnvironment: 91,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      majorIndices: [],
      sectorPerformance: [],
      economicIndicators: [],
      politicalEvents: [],
      // International specific fields
      currencyPair: 'KRW/USD',
      exchangeRate: 0,
      interestRate: 0,
      inflationRate: 0,
      gdpGrowth: 0,
      // Market structure
      marketCap: 0,
      tradingVolume: 0,
      foreignInvestment: 0,
      domesticRetail: 0,
      // Risk factors
      politicalStability: 0,
      regulatoryRisk: 0,
      currencyRisk: 0,
      liquidityRisk: 0,
      // Performance tracking
      topPerformers: [],
      worstPerformers: [],
      sectorRotation: [],
      marketSentiment: ''
    }
  ])

  // Function for Ollama bots to update data
  const updateMarketData = (marketId: string, newData: any) => {
    setMarketsData(prev => prev.map(market => 
      market.id === marketId ? { ...market, ...newData } : market
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

  const renderMarketCard = (market: any) => (
    <div key={market.id} className="aiiq-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Flag className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-semibold text-aiiq-cyber">
              {market.name}
            </h3>
          </div>
          <p className="text-gray-400 text-sm mb-1">{market.region} • {market.focus}</p>
          <p className="text-gray-400 text-sm mb-3">International Market</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-aiiq-cyber">{market.aiScore}</div>
          <div className="text-sm text-gray-400">pAIt Score</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-400">{market.monthlyReturn}%</div>
          <div className="text-xs text-gray-400">Monthly Return</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-aiiq-cyber">{market.avg24Month}%</div>
          <div className="text-xs text-gray-400">24-Month Avg</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${
            market.riskRating === 'Low' ? 'text-green-400' :
            market.riskRating === 'Medium' ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {market.riskRating}
          </div>
          <div className="text-xs text-gray-400">Risk Rating</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-400">{market.region}</div>
          <div className="text-xs text-gray-400">Region</div>
        </div>
      </div>

      {/* pAIt International Analysis */}
      <div className="bg-aiiq-dark/50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-aiiq-cyber mb-3">pAIt International Market Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-gray-400">Market Access</div>
            <div className="text-lg font-semibold text-blue-400">{market.marketAccess}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Regulatory Environment</div>
            <div className="text-lg font-semibold text-green-400">{market.regulatoryEnvironment}</div>
          </div>
        </div>
      </div>

      {/* Ollama Bot Data Areas */}
      <div className="space-y-4 mb-4">
        {/* Economic Indicators */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <BarChartIcon className="w-4 h-4 mr-2" />
            Economic Indicators (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">GDP Growth</div>
                <div>{market.gdpGrowth}%</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Inflation Rate</div>
                <div>{market.inflationRate}%</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Interest Rate</div>
                <div>{market.interestRate}%</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Exchange Rate</div>
                <div>{market.exchangeRate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Major Indices */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Major Indices (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {market.majorIndices.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {market.majorIndices.map((index: any, indexNum: number) => (
                  <div key={indexNum} className="bg-aiiq-dark/50 p-2 rounded">
                    {index.name}: {index.value} • {index.change}%
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Sector Performance */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <PieChart className="w-4 h-4 mr-2" />
            Sector Performance (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {market.sectorPerformance.length > 0 ? (
              <div className="space-y-1">
                {market.sectorPerformance.map((sector: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {sector.name}: {sector.return}% • Weight: {sector.weight}%
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Risk Factors (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Political Stability</div>
                <div>{market.politicalStability}/100</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Regulatory Risk</div>
                <div>{market.regulatoryRisk}/100</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Currency Risk</div>
                <div>{market.currencyRisk}/100</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Liquidity Risk</div>
                <div>{market.liquidityRisk}/100</div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Structure */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Building className="w-4 h-4 mr-2" />
            Market Structure (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Market Cap</div>
                <div>${market.marketCap}B</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Trading Volume</div>
                <div>${market.tradingVolume}M</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Foreign Investment</div>
                <div>{market.foreignInvestment}%</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Domestic Retail</div>
                <div>{market.domesticRetail}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Star className="w-4 h-4 mr-2" />
            Top Performers (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {market.topPerformers.length > 0 ? (
              <div className="space-y-1">
                {market.topPerformers.map((performer: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {performer.symbol}: {performer.return}% • {performer.sector}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Political Events */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Gavel className="w-4 h-4 mr-2" />
            Political Events (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {market.politicalEvents.length > 0 ? (
              <div className="space-y-1">
                {market.politicalEvents.map((event: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {event.date}: {event.description} • Impact: {event.impact}
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
        <span>Last updated: {market.lastUpdated}</span>
        <button className="aiiq-button-sm">
          <MapPin className="w-3 h-3 mr-1" />
          View Markets
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-aiiq-darker text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-aiiq-display aiiq-gradient-text mb-4">
            🌍 International Markets
          </h1>
          <p className="text-gray-300 text-lg">
            Global market opportunities with regional risk assessment and access analysis
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

        {/* Market Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {marketsData.map((market) => (
            <button
              key={market.id}
              onClick={() => setActiveRegion(market.id)}
              className={`p-4 rounded-lg border transition-all ${
                activeRegion === market.id
                  ? 'bg-aiiq-cyber text-white border-aiiq-cyber shadow-lg'
                  : 'bg-aiiq-dark text-gray-300 border-aiiq-cyber/30 hover:border-aiiq-cyber/60'
              }`}
            >
              <div className="text-lg font-semibold mb-1">{market.name}</div>
              <div className="text-sm opacity-75">{market.region}</div>
              <div className="text-xs opacity-60 mt-1">pAIt: {market.aiScore}</div>
            </button>
          ))}
        </div>

        {/* Selected Market Details */}
        <div className="space-y-6">
          {marketsData.map(market => 
            activeRegion === market.id && renderMarketCard(market)
          )}
        </div>

        {/* pAIt Methodology for International Markets */}
        <div className="mt-12 bg-gradient-to-r from-aiiq-cyber/20 to-aiiq-cyber/10 rounded-lg p-6 border border-aiiq-cyber/30">
          <h3 className="text-lg font-semibold text-aiiq-cyber mb-4"> pAIt International Markets Methodology</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Regional Analysis</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-blue-400">Market Access:</span> Ease of entry and trading</li>
                <li>• <span className="text-green-400">Regulatory Environment:</span> Government stability and rules</li>
                <li>• <span className="text-yellow-400">Currency Risk:</span> Exchange rate volatility</li>
                <li>• <span className="text-purple-400">Political Stability:</span> Government and policy consistency</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Ollama Bot Data Collection</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-green-400">Economic Indicators:</span> GDP, inflation, employment</li>
                <li>• <span className="text-aiiq-cyber">Market Structure:</span> Market cap, volume, investment flows</li>
                <li>• <span className="text-yellow-400">Political Events:</span> Policy changes and market impact</li>
                <li>• <span className="text-red-400">Risk Factors:</span> Political, regulatory, currency, liquidity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
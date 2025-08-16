"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, Star, Award, Target, BarChart3, Users, Calendar, TrendingDown, CheckCircle, AlertTriangle, Zap, Building2, Globe, DollarSign, PieChart, Eye, RefreshCw, Database, Bot } from 'lucide-react'

export default function SuperInfluencersPage() {
  const [activeInfluencer, setActiveInfluencer] = useState('cathy-wood')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('2025-01-15')

  // Data structure for Ollama bots to populate
  const [influencersData, setInfluencersData] = useState([
    {
      id: 'cathy-wood',
      name: 'Cathy Wood',
      firm: 'ARK Invest',
      role: 'CEO & CIO',
      focus: 'Innovation & Disruption',
      monthlyReturn: 12.5,
      avg24Month: 18.7,
      aiScore: 89,
      riskRating: 'High',
      biasScore: 75,
      mediaCoverage: 92,
      creditAttribution: 68,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      portfolioHoldings: [],
      recentMoves: [],
      publicStatements: [],
      cnbcAppearances: [],
      interviewSentiment: 'positive',
      strategyConsistency: 78,
      marketTiming: 82,
      riskManagement: 71
    },
    {
      id: 'warren-buffett',
      name: 'Warren Buffett',
      firm: 'Berkshire Hathaway',
      role: 'CEO & Chairman',
      focus: 'Value Investing & Long-term',
      monthlyReturn: 8.2,
      avg24Month: 14.3,
      aiScore: 94,
      riskRating: 'Low',
      biasScore: 45,
      mediaCoverage: 88,
      creditAttribution: 82,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      portfolioHoldings: [],
      recentMoves: [],
      publicStatements: [],
      cnbcAppearances: [],
      interviewSentiment: 'neutral',
      strategyConsistency: 95,
      marketTiming: 89,
      riskManagement: 94
    },
    {
      id: 'ray-dalio',
      name: 'Ray Dalio',
      firm: 'Bridgewater Associates',
      role: 'Founder & Co-CIO',
      focus: 'Macro & Risk Parity',
      monthlyReturn: 6.8,
      avg24Month: 11.9,
      aiScore: 87,
      riskRating: 'Medium',
      biasScore: 78,
      mediaCoverage: 85,
      creditAttribution: 71,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      portfolioHoldings: [],
      recentMoves: [],
      publicStatements: [],
      cnbcAppearances: [],
      interviewSentiment: 'positive',
      strategyConsistency: 82,
      marketTiming: 76,
      riskManagement: 88
    }
  ])

  // Function for Ollama bots to update data
  const updateInfluencerData = (influencerId: string, newData: any) => {
    setInfluencersData(prev => prev.map(influencer => 
      influencer.id === influencerId ? { ...influencer, ...newData } : influencer
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

  const renderInfluencerCard = (influencer: any) => (
    <div key={influencer.id} className="aiiq-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-aiiq-cyber mb-2">
            {influencer.name}
          </h3>
          <p className="text-gray-400 text-sm mb-1">{influencer.firm}</p>
          <p className="text-gray-400 text-sm mb-3">{influencer.role} • {influencer.focus}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-aiiq-cyber">{influencer.aiScore}</div>
          <div className="text-sm text-gray-400">pAIt Score</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-400">{influencer.monthlyReturn}%</div>
          <div className="text-xs text-gray-400">Monthly Return</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-aiiq-cyber">{influencer.avg24Month}%</div>
          <div className="text-xs text-gray-400">24-Month Avg</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${
            influencer.riskRating === 'Low' ? 'text-green-400' :
            influencer.riskRating === 'Medium' ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {influencer.riskRating}
          </div>
          <div className="text-xs text-gray-400">Risk Rating</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-400">{influencer.biasScore}</div>
          <div className="text-xs text-gray-400">Bias Score</div>
        </div>
      </div>

      {/* pAIt Attribution Analysis */}
      <div className="bg-aiiq-dark/50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-aiiq-cyber mb-3">pAIt Attribution Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <div className="text-sm text-gray-400">Media Coverage</div>
            <div className="text-lg font-semibold text-blue-400">{influencer.mediaCoverage}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Credit Attribution</div>
            <div className="text-lg font-semibold text-green-400">{influencer.creditAttribution}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Firm Bias Impact</div>
            <div className="text-lg font-semibold text-yellow-400">{influencer.biasScore}</div>
          </div>
        </div>
      </div>

      {/* Ollama Bot Data Areas */}
      <div className="space-y-4 mb-4">
        {/* Portfolio Holdings */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Database className="w-4 h-4 mr-2" />
            Portfolio Holdings (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {influencer.portfolioHoldings.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {influencer.portfolioHoldings.map((holding: any, index: number) => (
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

        {/* Recent Moves */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Recent Moves (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {influencer.recentMoves.length > 0 ? (
              <div className="space-y-1">
                {influencer.recentMoves.map((move: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {move.action} {move.symbol} - {move.date}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Public Statements */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Public Statements (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {influencer.publicStatements.length > 0 ? (
              <div className="space-y-1">
                {influencer.publicStatements.map((statement: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {statement.date}: {statement.content.substring(0, 100)}...
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
        <span>Last updated: {influencer.lastUpdated}</span>
        <button className="aiiq-button-sm">
          <Eye className="w-3 h-3 mr-1" />
          View Portfolio
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-aiiq-darker text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-aiiq-display aiiq-gradient-text mb-4">
            🏆 Super Influencers (SI)
          </h1>
          <p className="text-gray-300 text-lg">
            Institutional leaders with firm affiliations - pAIt bias analysis & credit attribution
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

        {/* Influencer Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {influencersData.map((influencer) => (
            <button
              key={influencer.id}
              onClick={() => setActiveInfluencer(influencer.id)}
              className={`p-4 rounded-lg border transition-all ${
                activeInfluencer === influencer.id
                  ? 'bg-aiiq-cyber text-white border-aiiq-cyber shadow-lg'
                  : 'bg-aiiq-dark text-gray-300 border-aiiq-cyber/30 hover:border-aiiq-cyber/60'
              }`}
            >
              <div className="text-lg font-semibold mb-1">{influencer.name}</div>
              <div className="text-sm opacity-75">{influencer.firm}</div>
              <div className="text-xs opacity-60 mt-1">pAIt: {influencer.aiScore}</div>
            </button>
          ))}
        </div>

        {/* Selected Influencer Details */}
        <div className="space-y-6">
          {influencersData.map(influencer => 
            activeInfluencer === influencer.id && renderInfluencerCard(influencer)
          )}
        </div>

        {/* pAIt Methodology for SI */}
        <div className="mt-12 bg-gradient-to-r from-aiiq-cyber/20 to-aiiq-cyber/10 rounded-lg p-6 border border-aiiq-cyber/30">
          <h3 className="text-lg font-semibold text-aiiq-cyber mb-4">🎯 pAIt Super Influencer Methodology</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Attribution Analysis</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-blue-400">Media Coverage:</span> CNBC appearances, interview frequency</li>
                <li>• <span className="text-green-400">Credit Attribution:</span> Strategy vs. company performance</li>
                <li>• <span className="text-yellow-400">Firm Bias Impact:</span> How much firm affiliation affects decisions</li>
                <li>• <span className="text-purple-400">Risk Assessment:</span> Volatility and drawdown analysis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Ollama Bot Data Collection</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-green-400">Portfolio Holdings:</span> Current positions and changes</li>
                <li>• <span className="text-aiiq-cyber">Public Statements:</span> Interviews, articles, social media</li>
                <li>• <span className="text-yellow-400">Performance Metrics:</span> Returns, risk, consistency</li>
                <li>• <span className="text-red-400">Market Timing:</span> Entry/exit analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
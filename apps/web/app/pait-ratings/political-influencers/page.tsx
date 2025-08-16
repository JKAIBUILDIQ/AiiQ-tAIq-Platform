"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, Star, Award, Target, BarChart3, Users, Calendar, TrendingDown, CheckCircle, AlertTriangle, Zap, Building2, Globe, DollarSign, PieChart, Eye, RefreshCw, Database, Bot, Shield, Target as TargetIcon, BarChart3 as BarChartIcon, Clock, DollarSign as DollarIcon, AlertTriangle as AlertIcon, Flag, MapPin, Globe2, Activity, Building, Gavel, Scale, Banknote, Vote, TrendingUp as TrendingUpIcon, AlertTriangle as AlertIcon2 } from 'lucide-react'

export default function PoliticalInfluencersPage() {
  const [activePolitician, setActivePolitician] = useState('nancy-pelosi')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('2025-01-15')

  // Data structure for Ollama bots to populate
  const [politiciansData, setPoliticiansData] = useState([
    {
      id: 'nancy-pelosi',
      name: 'Nancy Pelosi',
      role: 'Former Speaker of the House',
      party: 'Democrat',
      focus: 'Technology & Healthcare Policy',
      monthlyReturn: 18.7,
      avg24Month: 24.3,
      aiScore: 89,
      riskRating: 'Medium',
      policyImpact: 95,
      marketTiming: 87,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      portfolioHoldings: [],
      recentMoves: [],
      publicStatements: [],
      cnbcAppearances: [],
      interviewSentiment: 'positive',
      strategyConsistency: 78,
      riskManagement: 71,
      // Political specific fields
      committeePositions: [],
      votingRecord: [],
      policyProposals: [],
      mediaCoverage: [],
      // Performance tracking
      predictionAccuracy: 0,
      marketImpact: 0,
      sectorInfluence: [],
      regulatoryChanges: [],
      // Risk assessment
      politicalStability: 0,
      policyConsistency: 0,
      marketVolatility: 0,
      regulatoryRisk: 0
    },
    {
      id: 'donald-trump',
      name: 'Donald Trump',
      role: 'Former President',
      party: 'Republican',
      focus: 'Trade Policy & Energy',
      monthlyReturn: 22.4,
      avg24Month: 28.9,
      aiScore: 85,
      riskRating: 'High',
      policyImpact: 92,
      marketTiming: 78,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      portfolioHoldings: [],
      recentMoves: [],
      publicStatements: [],
      cnbcAppearances: [],
      interviewSentiment: 'mixed',
      strategyConsistency: 65,
      riskManagement: 68,
      // Political specific fields
      committeePositions: [],
      votingRecord: [],
      policyProposals: [],
      mediaCoverage: [],
      // Performance tracking
      predictionAccuracy: 0,
      marketImpact: 0,
      sectorInfluence: [],
      regulatoryChanges: [],
      // Risk assessment
      politicalStability: 0,
      policyConsistency: 0,
      marketVolatility: 0,
      regulatoryRisk: 0
    },
    {
      id: 'elizabeth-warren',
      name: 'Elizabeth Warren',
      role: 'US Senator',
      party: 'Democrat',
      focus: 'Financial Regulation & Consumer Protection',
      monthlyReturn: 12.8,
      avg24Month: 16.5,
      aiScore: 82,
      riskRating: 'Medium',
      policyImpact: 88,
      marketTiming: 75,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      portfolioHoldings: [],
      recentMoves: [],
      publicStatements: [],
      cnbcAppearances: [],
      interviewSentiment: 'positive',
      strategyConsistency: 82,
      riskManagement: 85,
      // Political specific fields
      committeePositions: [],
      votingRecord: [],
      policyProposals: [],
      mediaCoverage: [],
      // Performance tracking
      predictionAccuracy: 0,
      marketImpact: 0,
      sectorInfluence: [],
      regulatoryChanges: [],
      // Risk assessment
      politicalStability: 0,
      policyConsistency: 0,
      marketVolatility: 0,
      regulatoryRisk: 0
    }
  ])

  // Function for Ollama bots to update data
  const updatePoliticianData = (politicianId: string, newData: any) => {
    setPoliticiansData(prev => prev.map(politician => 
      politician.id === politicianId ? { ...politician, ...newData } : politician
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

  const renderPoliticianCard = (politician: any) => (
    <div key={politician.id} className="aiiq-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Building className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-semibold text-aiiq-cyber">
              {politician.name}
            </h3>
          </div>
          <p className="text-gray-400 text-sm mb-1">{politician.role} • {politician.party}</p>
          <p className="text-gray-400 text-sm mb-3">{politician.focus}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-aiiq-cyber">{politician.aiScore}</div>
          <div className="text-sm text-gray-400">pAIt Score</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-400">{politician.monthlyReturn}%</div>
          <div className="text-xs text-gray-400">Monthly Return</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-aiiq-cyber">{politician.avg24Month}%</div>
          <div className="text-xs text-gray-400">24-Month Avg</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${
            politician.riskRating === 'Low' ? 'text-green-400' :
            politician.riskRating === 'Medium' ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {politician.riskRating}
          </div>
          <div className="text-xs text-gray-400">Risk Rating</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-400">{politician.party}</div>
          <div className="text-xs text-gray-400">Party</div>
        </div>
      </div>

      {/* pAIt Political Analysis */}
      <div className="bg-aiiq-dark/50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-aiiq-cyber mb-3">pAIt Political Influencer Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-gray-400">Policy Impact</div>
            <div className="text-lg font-semibold text-blue-400">{politician.policyImpact}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Market Timing</div>
            <div className="text-lg font-semibold text-green-400">{politician.marketTiming}</div>
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
            {politician.portfolioHoldings.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {politician.portfolioHoldings.map((holding: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {holding.symbol}: {holding.weight}% • Value: ${holding.value}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Voting Record */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Vote className="w-4 h-4 mr-2" />
            Voting Record (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {politician.votingRecord.length > 0 ? (
              <div className="space-y-1">
                {politician.votingRecord.map((vote: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {vote.bill}: {vote.vote} • Impact: {vote.marketImpact}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Policy Proposals */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Gavel className="w-4 h-4 mr-2" />
            Policy Proposals (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {politician.policyProposals.length > 0 ? (
              <div className="space-y-1">
                {politician.policyProposals.map((proposal: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {proposal.title}: {proposal.status} • Market Impact: {proposal.impact}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Media Coverage */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Media Coverage (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {politician.mediaCoverage.length > 0 ? (
              <div className="space-y-1">
                {politician.mediaCoverage.map((coverage: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {coverage.outlet}: {coverage.headline} • Sentiment: {coverage.sentiment}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Risk Assessment (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Political Stability</div>
                <div>{politician.politicalStability}/100</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Policy Consistency</div>
                <div>{politician.policyConsistency}/100</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Market Volatility</div>
                <div>{politician.marketVolatility}/100</div>
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <div className="font-semibold">Regulatory Risk</div>
                <div>{politician.regulatoryRisk}/100</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sector Influence */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <TrendingUpIcon className="w-4 h-4 mr-2" />
            Sector Influence (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {politician.sectorInfluence.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {politician.sectorInfluence.map((sector: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {sector.name}: {sector.influence}% • Policy: {sector.policy}
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
        <span>Last updated: {politician.lastUpdated}</span>
        <button className="aiiq-button-sm">
          <Gavel className="w-3 h-3 mr-1" />
          View Policies
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-aiiq-darker text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-aiiq-display aiiq-gradient-text mb-4">
            🏛️ Political Influencers
          </h1>
          <p className="text-gray-300 text-lg">
            Political leaders whose decisions and statements impact markets through policy changes
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

        {/* Politician Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {politiciansData.map((politician) => (
            <button
              key={politician.id}
              onClick={() => setActivePolitician(politician.id)}
              className={`p-4 rounded-lg border transition-all ${
                activePolitician === politician.id
                  ? 'bg-aiiq-cyber text-white border-aiiq-cyber shadow-lg'
                  : 'bg-aiiq-dark text-gray-300 border-aiiq-cyber/30 hover:border-aiiq-cyber/60'
              }`}
            >
              <div className="text-lg font-semibold mb-1">{politician.name}</div>
              <div className="text-sm opacity-75">{politician.role}</div>
              <div className="text-xs opacity-60 mt-1">pAIt: {politician.aiScore}</div>
            </button>
          ))}
        </div>

        {/* Selected Politician Details */}
        <div className="space-y-6">
          {politiciansData.map(politician => 
            activePolitician === politician.id && renderPoliticianCard(politician)
          )}
        </div>

        {/* pAIt Methodology for Political Influencers */}
        <div className="mt-12 bg-gradient-to-r from-aiiq-cyber/20 to-aiiq-cyber/10 rounded-lg p-6 border border-aiiq-cyber/30">
          <h3 className="text-lg font-semibold text-aiiq-cyber mb-4"> pAIt Political Influencer Methodology</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Policy Impact Analysis</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-blue-400">Policy Impact:</span> How much their decisions move markets</li>
                <li>• <span className="text-green-400">Market Timing:</span> When they make key announcements</li>
                <li>• <span className="text-yellow-400">Sector Focus:</span> Which industries they influence most</li>
                <li>• <span className="text-purple-400">Legislative Success:</span> Bills passed vs. proposed</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Ollama Bot Data Collection</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-green-400">Voting Records:</span> How they vote on key bills</li>
                <li>• <span className="text-aiiq-cyber">Policy Proposals:</span> Bills introduced and status</li>
                <li>• <span className="text-yellow-400">Media Coverage:</span> News sentiment and frequency</li>
                <li>• <span className="text-red-400">Market Impact:</span> How their actions move stocks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
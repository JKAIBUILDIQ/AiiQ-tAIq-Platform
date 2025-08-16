"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, Star, Award, Target, BarChart3, Users, Calendar, TrendingDown, CheckCircle, AlertTriangle, Zap, Building2, Globe, DollarSign, PieChart, Eye, RefreshCw, Database, Bot, User, TrendingUp2, MessageSquare, ThumbsUp, Share2, Play, Search, Users as UsersIcon } from 'lucide-react'

export default function SocialMediaLowPage() {
  const [activeCreator, setActiveCreator] = useState('micro-trader')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('2025-01-15')

  // Data structure for Ollama bots to populate
  const [creatorsData, setCreatorsData] = useState([
    {
      id: 'micro-trader',
      name: 'Micro Trader',
      platform: 'YouTube',
      subscribers: '50K',
      strategy: 'Small Account Growth',
      monthlyReturn: 22.4,
      avg24Month: 28.7,
      aiScore: 91,
      riskRating: 'Medium',
      communityValidation: 85,
      strategyReplicability: 88,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      recentVideos: [],
      communityEngagement: {},
      strategyPerformance: [],
      socialMediaMentions: [],
      videoViews: 0,
      averageWatchTime: 0,
      commentSentiment: 'positive',
      subscriberGrowth: [],
      collaborationHistory: [],
      merchandiseSales: 0,
      // Low sub specific fields
      nicheFocus: '',
      communityQuality: 0,
      strategyInnovation: 0,
      riskTransparency: 0,
      marketTiming: 0
    },
    {
      id: 'options-scalper',
      name: 'Options Scalper',
      platform: 'YouTube',
      subscribers: '25K',
      strategy: 'Intraday Options',
      monthlyReturn: 35.8,
      avg24Month: 42.1,
      aiScore: 87,
      riskRating: 'Very High',
      communityValidation: 78,
      strategyReplicability: 72,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      recentVideos: [],
      communityEngagement: {},
      strategyPerformance: [],
      socialMediaMentions: [],
      videoViews: 0,
      averageWatchTime: 0,
      commentSentiment: 'mixed',
      subscriberGrowth: [],
      collaborationHistory: [],
      merchandiseSales: 0,
      // Low sub specific fields
      nicheFocus: '',
      communityQuality: 0,
      strategyInnovation: 0,
      riskTransparency: 0,
      marketTiming: 0
    },
    {
      id: 'crypto-miner',
      name: 'Crypto Miner',
      platform: 'YouTube',
      subscribers: '30K',
      strategy: 'DeFi Yield Farming',
      monthlyReturn: 28.9,
      avg24Month: 34.5,
      aiScore: 84,
      riskRating: 'High',
      communityValidation: 82,
      strategyReplicability: 75,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      recentVideos: [],
      communityEngagement: {},
      strategyPerformance: [],
      socialMediaMentions: [],
      videoViews: 0,
      averageWatchTime: 0,
      commentSentiment: 'positive',
      subscriberGrowth: [],
      collaborationHistory: [],
      merchandiseSales: 0,
      // Low sub specific fields
      nicheFocus: '',
      communityQuality: 0,
      strategyInnovation: 0,
      riskTransparency: 0,
      marketTiming: 0
    }
  ])

  // Function for Ollama bots to update data
  const updateCreatorData = (creatorId: string, newData: any) => {
    setCreatorsData(prev => prev.map(creator => 
      creator.id === creatorId ? { ...creator, ...newData } : creator
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

  const renderCreatorCard = (creator: any) => (
    <div key={creator.id} className="aiiq-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-semibold text-aiiq-cyber">
              {creator.name}
            </h3>
          </div>
          <p className="text-gray-400 text-sm mb-1">{creator.platform} • {creator.subscribers} subscribers</p>
          <p className="text-gray-400 text-sm mb-3">{creator.strategy}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-aiiq-cyber">{creator.aiScore}</div>
          <div className="text-sm text-gray-400">pAIt Score</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-400">{creator.monthlyReturn}%</div>
          <div className="text-xs text-gray-400">Monthly Return</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-aiiq-cyber">{creator.avg24Month}%</div>
          <div className="text-xs text-gray-400">24-Month Avg</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${
            creator.riskRating === 'Low' ? 'text-green-400' :
            creator.riskRating === 'Medium' ? 'text-yellow-400' :
            creator.riskRating === 'High' ? 'text-orange-400' :
            'text-red-400'
          }`}>
            {creator.riskRating}
          </div>
          <div className="text-xs text-gray-400">Risk Rating</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-400">{creator.subscribers}</div>
          <div className="text-xs text-gray-400">Subscribers</div>
        </div>
      </div>

      {/* pAIt Low Sub Analysis */}
      <div className="bg-aiiq-dark/50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-aiiq-cyber mb-3">pAIt Low Sub Creator Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-gray-400">Community Validation</div>
            <div className="text-lg font-semibold text-blue-400">{creator.communityValidation}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Strategy Replicability</div>
            <div className="text-lg font-semibold text-green-400">{creator.strategyReplicability}</div>
          </div>
        </div>
      </div>

      {/* Ollama Bot Data Areas */}
      <div className="space-y-4 mb-4">
        {/* Niche Analysis */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Search className="w-4 h-4 mr-2" />
            Niche Analysis (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {creator.nicheFocus ? (
              <div className="bg-aiiq-dark/50 p-2 rounded">
                <strong>Focus:</strong> {creator.nicheFocus}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Community Quality */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <UsersIcon className="w-4 h-4 mr-2" />
            Community Quality (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {creator.communityQuality > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-aiiq-dark/50 p-2 rounded">
                  Quality Score: {creator.communityQuality}/100
                </div>
                <div className="bg-aiiq-dark/50 p-2 rounded">
                  Engagement: {creator.communityEngagement.comments || 0} comments
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Strategy Innovation */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <TrendingUp2 className="w-4 h-4 mr-2" />
            Strategy Innovation (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {creator.strategyInnovation > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-aiiq-dark/50 p-2 rounded">
                  Innovation Score: {creator.strategyInnovation}/100
                </div>
                <div className="bg-aiiq-dark/50 p-2 rounded">
                  Risk Transparency: {creator.riskTransparency}/100
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Recent Performance */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Recent Performance (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {creator.strategyPerformance.length > 0 ? (
              <div className="space-y-1">
                {creator.strategyPerformance.map((performance: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {performance.strategy}: {performance.return}% ({performance.period})
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
            <Calendar className="w-4 h-4 mr-2" />
            Market Timing (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {creator.marketTiming > 0 ? (
              <div className="bg-aiiq-dark/50 p-2 rounded">
                Market Timing Score: {creator.marketTiming}/100
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Last updated: {creator.lastUpdated}</span>
        <button className="aiiq-button-sm">
          <Users className="w-3 h-3 mr-1" />
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
            🎯 Social Media Low Sub Count
          </h1>
          <p className="text-gray-300 text-lg">
            Hidden gems with smaller followings - often higher performance, lower visibility
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

        {/* Creator Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {creatorsData.map((creator) => (
            <button
              key={creator.id}
              onClick={() => setActiveCreator(creator.id)}
              className={`p-4 rounded-lg border transition-all ${
                activeCreator === creator.id
                  ? 'bg-aiiq-cyber text-white border-aiiq-cyber shadow-lg'
                  : 'bg-aiiq-dark text-gray-300 border-aiiq-cyber/30 hover:border-aiiq-cyber/60'
              }`}
            >
              <div className="text-lg font-semibold mb-1">{creator.name}</div>
              <div className="text-sm opacity-75">{creator.subscribers} subs</div>
              <div className="text-xs opacity-60 mt-1">pAIt: {creator.aiScore}</div>
            </button>
          ))}
        </div>

        {/* Selected Creator Details */}
        <div className="space-y-6">
          {creatorsData.map(creator => 
            activeCreator === creator.id && renderCreatorCard(creator)
          )}
        </div>

        {/* pAIt Methodology for Low Sub Creators */}
        <div className="mt-12 bg-gradient-to-r from-aiiq-cyber/20 to-aiiq-cyber/10 rounded-lg p-6 border border-aiiq-cyber/30">
          <h3 className="text-lg font-semibold text-aiiq-cyber mb-4"> pAIt Low Sub Creator Methodology</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Hidden Gem Analysis</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-blue-400">Performance vs. Visibility:</span> High returns, low followers</li>
                <li>• <span className="text-green-400">Strategy Authenticity:</span> Less commercial pressure</li>
                <li>• <span className="text-yellow-400">Community Quality:</span> Engaged vs. passive followers</li>
                <li>• <span className="text-purple-400">Innovation Level:</span> Unique approaches</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Ollama Bot Data Collection</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-green-400">Niche Analysis:</span> Specialized market focus</li>
                <li>• <span className="text-aiiq-cyber">Community Quality:</span> Engagement vs. follower count</li>
                <li>• <span className="text-yellow-400">Strategy Innovation:</span> Unique approaches</li>
                <li>• <span className="text-red-400">Risk Transparency:</span> Honesty about limitations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
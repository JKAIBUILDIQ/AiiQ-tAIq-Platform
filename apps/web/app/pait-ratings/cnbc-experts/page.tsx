"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, Star, Award, Target, BarChart3, Users, Calendar, TrendingDown, CheckCircle, AlertTriangle, Zap, Building2, Globe, DollarSign, PieChart, Eye, RefreshCw, Database, Bot, Tv, Mic, Newspaper, TrendingUp2, MessageSquare, Clock, Video, Radio, Quote } from 'lucide-react'

export default function CnbcExpertsPage() {
  const [activeExpert, setActiveExpert] = useState('tom-lee')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('2025-01-15')

  // Data structure for Ollama bots to populate
  const [expertsData, setExpertsData] = useState([
    {
      id: 'tom-lee',
      name: 'Tom Lee',
      show: 'Fundstrat',
      role: 'Managing Partner & Head of Research',
      focus: 'Market Strategy & Bitcoin',
      monthlyReturn: 8.9,
      avg24Month: 14.2,
      aiScore: 87,
      riskRating: 'Medium',
      predictionAccuracy: 82,
      mediaFrequency: 95,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      recentAppearances: [],
      predictionHistory: [],
      marketCalls: [],
      socialMediaActivity: [],
      interviewSentiment: 'positive',
      showAppearances: [],
      articlePublications: [],
      predictionAccuracy: 82,
      marketTiming: 78,
      riskAssessment: 85,
      // CNBC specific fields
      showFrequency: 0,
      segmentTypes: [],
      guestInterviews: [],
      marketMoves: []
    },
    {
      id: 'jim-cramer',
      name: 'Jim Cramer',
      show: 'Mad Money',
      role: 'Host & Market Commentator',
      focus: 'Stock Picks & Market Analysis',
      monthlyReturn: 6.4,
      avg24Month: 10.8,
      aiScore: 78,
      riskRating: 'Medium',
      predictionAccuracy: 71,
      mediaFrequency: 98,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      recentAppearances: [],
      predictionHistory: [],
      marketCalls: [],
      socialMediaActivity: [],
      interviewSentiment: 'mixed',
      showAppearances: [],
      articlePublications: [],
      predictionAccuracy: 71,
      marketTiming: 65,
      riskAssessment: 72,
      // CNBC specific fields
      showFrequency: 0,
      segmentTypes: [],
      guestInterviews: [],
      marketMoves: []
    },
    {
      id: 'karen-finerman',
      name: 'Karen Finerman',
      show: 'Fast Money',
      role: 'Panelist & Hedge Fund Manager',
      focus: 'Options & Risk Management',
      monthlyReturn: 9.2,
      avg24Month: 15.1,
      aiScore: 84,
      riskRating: 'Low',
      predictionAccuracy: 79,
      mediaFrequency: 88,
      lastUpdated: '2025-01-15',
      // Ollama bot data fields
      recentAppearances: [],
      predictionHistory: [],
      marketCalls: [],
      socialMediaActivity: [],
      interviewSentiment: 'positive',
      showAppearances: [],
      articlePublications: [],
      predictionAccuracy: 79,
      marketTiming: 82,
      riskAssessment: 88,
      // CNBC specific fields
      showFrequency: 0,
      segmentTypes: [],
      guestInterviews: [],
      marketMoves: []
    }
  ])

  // Function for Ollama bots to update data
  const updateExpertData = (expertId: string, newData: any) => {
    setExpertsData(prev => prev.map(expert => 
      expert.id === expertId ? { ...expert, ...newData } : expert
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

  const renderExpertCard = (expert: any) => (
    <div key={expert.id} className="aiiq-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Tv className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-semibold text-aiiq-cyber">
              {expert.name}
            </h3>
          </div>
          <p className="text-gray-400 text-sm mb-1">{expert.show} • {expert.role}</p>
          <p className="text-gray-400 text-sm mb-3">{expert.focus}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-aiiq-cyber">{expert.aiScore}</div>
          <div className="text-sm text-gray-400">pAIt Score</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-400">{expert.monthlyReturn}%</div>
          <div className="text-xs text-gray-400">Monthly Return</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-aiiq-cyber">{expert.avg24Month}%</div>
          <div className="text-xs text-gray-400">24-Month Avg</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${
            expert.riskRating === 'Low' ? 'text-green-400' :
            expert.riskRating === 'Medium' ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {expert.riskRating}
          </div>
          <div className="text-xs text-gray-400">Risk Rating</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-400">{expert.predictionAccuracy}%</div>
          <div className="text-xs text-gray-400">Accuracy</div>
        </div>
      </div>

      {/* pAIt CNBC Analysis */}
      <div className="bg-aiiq-dark/50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-aiiq-cyber mb-3">pAIt CNBC Expert Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-gray-400">Prediction Accuracy</div>
            <div className="text-lg font-semibold text-blue-400">{expert.predictionAccuracy}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Media Frequency</div>
            <div className="text-lg font-semibold text-green-400">{expert.mediaFrequency}</div>
          </div>
        </div>
      </div>

      {/* Ollama Bot Data Areas */}
      <div className="space-y-4 mb-4">
        {/* Recent Appearances */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Video className="w-4 h-4 mr-2" />
            Recent Appearances (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {expert.recentAppearances.length > 0 ? (
              <div className="space-y-1">
                {expert.recentAppearances.map((appearance: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {appearance.show} - {appearance.date} • {appearance.topic}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Prediction History */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Prediction History (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {expert.predictionHistory.length > 0 ? (
              <div className="space-y-1">
                {expert.predictionHistory.map((prediction: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {prediction.date}: {prediction.call} - {prediction.outcome} ({prediction.accuracy}%)
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Market Calls */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <TrendingUp2 className="w-4 h-4 mr-2" />
            Market Calls (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            {expert.marketCalls.length > 0 ? (
              <div className="space-y-1">
                {expert.marketCalls.map((call: any, index: number) => (
                  <div key={index} className="bg-aiiq-dark/50 p-2 rounded">
                    {call.symbol}: {call.action} @ {call.price} • {call.reason}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for Ollama bot data...</div>
            )}
          </div>
        </div>

        {/* Show Analysis */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <Tv className="w-4 h-4 mr-2" />
            Show Analysis (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-aiiq-dark/50 p-2 rounded">
                Show Frequency: {expert.showFrequency} appearances/month
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                Segment Types: {expert.segmentTypes.length > 0 ? expert.segmentTypes.join(', ') : 'N/A'}
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                Guest Interviews: {expert.guestInterviews.length} recent
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                Market Moves: {expert.marketMoves.length} tracked
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-aiiq-dark/30 rounded-lg p-3">
          <h5 className="text-sm font-semibold text-aiiq-cyber mb-2 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Sentiment Analysis (Ollama Data)
          </h5>
          <div className="text-xs text-gray-400">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-aiiq-dark/50 p-2 rounded">
                Interview Sentiment: {expert.interviewSentiment}
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                Market Timing: {expert.marketTiming}/100
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                Risk Assessment: {expert.riskAssessment}/100
              </div>
              <div className="bg-aiiq-dark/50 p-2 rounded">
                Social Activity: {expert.socialMediaActivity.length} posts
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Last updated: {expert.lastUpdated}</span>
        <button className="aiiq-button-sm">
          <Newspaper className="w-3 h-3 mr-1" />
          View Predictions
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-aiiq-darker text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-aiiq-display aiiq-gradient-text mb-4">
            📰 CNBC Experts
          </h1>
          <p className="text-gray-300 text-lg">
            Financial news analysts, prediction accuracy, and media influence analysis
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

        {/* Expert Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {expertsData.map((expert) => (
            <button
              key={expert.id}
              onClick={() => setActiveExpert(expert.id)}
              className={`p-4 rounded-lg border transition-all ${
                activeExpert === expert.id
                  ? 'bg-aiiq-cyber text-white border-aiiq-cyber shadow-lg'
                  : 'bg-aiiq-dark text-gray-300 border-aiiq-cyber/30 hover:border-aiiq-cyber/60'
              }`}
            >
              <div className="text-lg font-semibold mb-1">{expert.name}</div>
              <div className="text-sm opacity-75">{expert.show}</div>
              <div className="text-xs opacity-60 mt-1">pAIt: {expert.aiScore}</div>
            </button>
          ))}
        </div>

        {/* Selected Expert Details */}
        <div className="space-y-6">
          {expertsData.map(expert => 
            activeExpert === expert.id && renderExpertCard(expert)
          )}
        </div>

        {/* pAIt Methodology for CNBC Experts */}
        <div className="mt-12 bg-gradient-to-r from-aiiq-cyber/20 to-aiiq-cyber/10 rounded-lg p-6 border border-aiiq-cyber/30">
          <h3 className="text-lg font-semibold text-aiiq-cyber mb-4"> pAIt CNBC Expert Methodology</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Media Analysis</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-blue-400">Prediction Accuracy:</span> Track record of calls</li>
                <li>• <span className="text-green-400">Media Frequency:</span> CNBC appearances and coverage</li>
                <li>• <span className="text-yellow-400">Strategy Consistency:</span> Approach over time</li>
                <li>• <span className="text-purple-400">Risk Disclosure:</span> Honesty about market risks</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Ollama Bot Data Collection</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-green-400">Show Appearances:</span> Mad Money, Fast Money, etc.</li>
                <li>• <span className="text-aiiq-cyber">Prediction Tracking:</span> Call outcomes and accuracy</li>
                <li>• <span className="text-yellow-400">Strategy Analysis:</span> Investment approach</li>
                <li>• <span className="text-red-400">Market Impact:</span> How their calls move markets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
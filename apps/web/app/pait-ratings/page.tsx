"use client"

import React, { useState } from 'react'
import { TrendingUp, Star, Award, Target, BarChart3, Users, Calendar, TrendingDown, CheckCircle, AlertTriangle, Zap, Building2, Globe, DollarSign, PieChart, Eye, ArrowRight } from 'lucide-react'

export default function PaitRatingsPage() {
  const [activeCategory, setActiveCategory] = useState('top10')

  // Top performers from each category (not overwhelming data)
  const categoryHighlights = {
    top10: [
      {
        rank: 1,
        name: "RSI Divergence Strategy",
        source: "Technical Analysis",
        monthlyReturn: 8.5,
        aiScore: 94,
        riskRating: "Low",
        lastUpdated: "2025-01-15"
      },
      {
        rank: 2,
        name: "Earnings Momentum Play",
        source: "Fundamental Analysis",
        monthlyReturn: 6.8,
        aiScore: 91,
        riskRating: "Medium",
        lastUpdated: "2025-01-14"
      },
      {
        rank: 3,
        name: "Gamma Squeeze Scanner",
        source: "Options Flow",
        monthlyReturn: 15.2,
        aiScore: 88,
        riskRating: "High",
        lastUpdated: "2025-01-13"
      }
    ],
    superInfluencers: [
      {
        name: "Cathy Wood",
        firm: "ARK Invest",
        monthlyReturn: 12.5,
        aiScore: 89,
        riskRating: "High"
      },
      {
        name: "Warren Buffett",
        firm: "Berkshire Hathaway",
        monthlyReturn: 8.2,
        aiScore: 94,
        riskRating: "Low"
      },
      {
        name: "Ray Dalio",
        firm: "Bridgewater",
        monthlyReturn: 6.8,
        aiScore: 87,
        riskRating: "Medium"
      }
    ],
    institutionalFunds: [
      {
        name: "ARK Innovation ETF",
        ticker: "ARKK",
        monthlyReturn: 15.3,
        aiScore: 87,
        riskRating: "High"
      },
      {
        name: "SPDR S&P 500",
        ticker: "SPY",
        monthlyReturn: 6.8,
        aiScore: 92,
        riskRating: "Low"
      },
      {
        name: "Invesco QQQ",
        ticker: "QQQ",
        monthlyReturn: 8.9,
        aiScore: 89,
        riskRating: "Medium"
      }
    ],
    socialMediaHigh: [
      {
        name: "Trading Master Pro",
        subscribers: "2.1M",
        monthlyReturn: 18.7,
        aiScore: 89,
        riskRating: "High"
      },
      {
        name: "Options Guru",
        subscribers: "890K",
        monthlyReturn: 12.4,
        aiScore: 85,
        riskRating: "Medium"
      },
      {
        name: "Crypto Master",
        subscribers: "1.5M",
        monthlyReturn: 25.6,
        aiScore: 87,
        riskRating: "Very High"
      }
    ],
    socialMediaLow: [
      {
        name: "Micro Trader",
        subscribers: "50K",
        monthlyReturn: 22.4,
        aiScore: 91,
        riskRating: "Medium"
      },
      {
        name: "Options Scalper",
        subscribers: "25K",
        monthlyReturn: 35.8,
        aiScore: 87,
        riskRating: "Very High"
      },
      {
        name: "Crypto Miner",
        subscribers: "30K",
        monthlyReturn: 28.9,
        aiScore: 84,
        riskRating: "High"
      }
    ],
    cnbcExperts: [
      {
        name: "Tom Lee",
        show: "Fundstrat",
        monthlyReturn: 8.9,
        aiScore: 87,
        riskRating: "Medium"
      },
      {
        name: "Jim Cramer",
        show: "Mad Money",
        monthlyReturn: 6.4,
        aiScore: 78,
        riskRating: "Medium"
      },
      {
        name: "Karen Finerman",
        show: "Fast Money",
        monthlyReturn: 9.2,
        aiScore: 84,
        riskRating: "Low"
      }
    ],
    politicalInfluencers: [
      {
        name: "Nancy Pelosi",
        role: "Former Speaker",
        monthlyReturn: 18.7,
        aiScore: 89,
        riskRating: "Medium"
      },
      {
        name: "Donald Trump",
        role: "Former President",
        monthlyReturn: 22.4,
        aiScore: 85,
        riskRating: "High"
      },
      {
        name: "Elizabeth Warren",
        role: "US Senator",
        monthlyReturn: 12.8,
        aiScore: 82,
        riskRating: "Medium"
      }
    ]
  }

  const ratingCategories = [
    { id: 'top10', label: 'Top 10 Indicators', icon: '🏆', description: 'Highest rated strategies and indicators', color: 'from-yellow-400 to-orange-500' },
    { id: 'superInfluencers', label: 'Super Influencers', icon: '��', description: 'Institutional leaders and market movers', color: 'from-purple-400 to-pink-500' },
    { id: 'institutionalFunds', label: 'Institutional Funds', icon: '🏦', description: 'ETF strategies and fund performance', color: 'from-blue-400 to-cyan-500' },
    { id: 'socialMediaHigh', label: 'Social Media High', icon: '📺', description: 'High-subscriber content creators', color: 'from-red-400 to-pink-500' },
    { id: 'socialMediaLow', label: 'Social Media Low', icon: '🎯', description: 'Hidden gems with smaller followings', color: 'from-green-400 to-blue-500' },
    { id: 'cnbcExperts', label: 'CNBC Experts', icon: '📰', description: 'Financial news analysts and predictions', color: 'from-indigo-400 to-purple-500' },
    { id: 'politicalInfluencers', label: 'Political Influencers', icon: '🏛️', description: 'Policy makers and market movers', color: 'from-gray-400 to-blue-500' }
  ]

  const renderCategoryCard = (category: any) => (
    <button
      key={category.id}
      onClick={() => setActiveCategory(category.id)}
      className={`p-4 rounded-lg border transition-all ${
        activeCategory === category.id
          ? 'bg-aiiq-cyber text-white border-aiiq-cyber shadow-lg'
          : 'bg-aiiq-dark text-gray-300 border-aiiq-cyber/30 hover:border-aiiq-cyber/60'
      }`}
    >
      <div className="text-2xl mb-2">{category.icon}</div>
      <div className="text-sm font-semibold">{category.label}</div>
      <div className="text-xs opacity-75 mt-1">{category.description}</div>
    </button>
  )

  const renderHighlightCard = (item: any, category: string) => (
    <div key={item.name || item.rank} className="aiiq-card p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-aiiq-cyber mb-1">
            {item.rank ? `${item.rank}. ${item.name}` : item.name}
          </h3>
          <p className="text-gray-400 text-sm mb-2">
            {item.source || item.firm || item.show || item.role || item.subscribers}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-aiiq-cyber">{item.aiScore}</div>
          <div className="text-sm text-gray-400">pAIt Score</div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center">
          <div className="text-sm font-semibold text-green-400">{item.monthlyReturn}%</div>
          <div className="text-xs text-gray-400">Monthly</div>
        </div>
        <div className="text-center">
          <div className={`text-sm font-semibold ${
            item.riskRating === 'Low' ? 'text-green-400' :
            item.riskRating === 'Medium' ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {item.riskRating}
          </div>
          <div className="text-xs text-gray-400">Risk</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-purple-400">
            {item.ticker || item.subscribers || 'N/A'}
          </div>
          <div className="text-xs text-gray-400">
            {item.ticker ? 'Ticker' : item.subscribers ? 'Subs' : 'Info'}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>pAIt: {item.aiScore}</span>
        <button className="aiiq-button-sm">
          <Eye className="w-3 h-3 mr-1" />
          View Details
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-aiiq-darker text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-aiiq-display aiiq-gradient-text mb-4">
            pAIt Rating System
          </h1>
          <p className="text-gray-300 text-lg">
            Proof of Work AI-powered strategy rating and ranking system
          </p>
        </div>

        {/* Rating Categories - Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {ratingCategories.map((category) => renderCategoryCard(category))}
        </div>

        {/* Category Highlights - Not Overwhelming */}
        <div className="space-y-6">
          {activeCategory === 'top10' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-aiiq-cyber">🏆 Top 10 Indicators</h2>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">
                    <span className="text-green-400">●</span> Live Updates
                  </div>
                  <button className="aiiq-button-sm">
                    <Zap className="w-4 h-4 mr-2" />
                    Refresh Rankings
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {categoryHighlights.top10.map(item => renderHighlightCard(item, 'top10'))}
              </div>
            </div>
          )}

          {activeCategory === 'superInfluencers' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-aiiq-cyber">👑 Super Influencers</h2>
                <button className="aiiq-button-sm">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View Full Analysis
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {categoryHighlights.superInfluencers.map(item => renderHighlightCard(item, 'superInfluencers'))}
              </div>
            </div>
          )}

          {activeCategory === 'institutionalFunds' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-aiiq-cyber">🏦 Institutional Funds</h2>
                <button className="aiiq-button-sm">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View Full Analysis
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {categoryHighlights.institutionalFunds.map(item => renderHighlightCard(item, 'institutionalFunds'))}
              </div>
            </div>
          )}

          {activeCategory === 'socialMediaHigh' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-aiiq-cyber">📺 Social Media High Sub</h2>
                <button className="aiiq-button-sm">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View Full Analysis
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {categoryHighlights.socialMediaHigh.map(item => renderHighlightCard(item, 'socialMediaHigh'))}
              </div>
            </div>
          )}

          {activeCategory === 'socialMediaLow' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-aiiq-cyber">🎯 Social Media Low Sub</h2>
                <button className="aiiq-button-sm">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View Full Analysis
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {categoryHighlights.socialMediaLow.map(item => renderHighlightCard(item, 'socialMediaLow'))}
              </div>
            </div>
          )}

          {activeCategory === 'cnbcExperts' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-aiiq-cyber">�� CNBC Experts</h2>
                <button className="aiiq-button-sm">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View Full Analysis
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {categoryHighlights.cnbcExperts.map(item => renderHighlightCard(item, 'cnbcExperts'))}
              </div>
            </div>
          )}

          {activeCategory === 'politicalInfluencers' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-aiiq-cyber">🏛️ Political Influencers</h2>
                <button className="aiiq-button-sm">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View Full Analysis
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {categoryHighlights.politicalInfluencers.map(item => renderHighlightCard(item, 'politicalInfluencers'))}
              </div>
            </div>
          )}
        </div>

        {/* System Overview - Keep it Simple */}
        <div className="mt-12 bg-gradient-to-r from-aiiq-cyber/20 to-aiiq-cyber/10 rounded-lg p-6 border border-aiiq-cyber/30">
          <h3 className="text-lg font-semibold text-aiiq-cyber mb-4">🎯 pAIt Rating Methodology</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Scoring Components</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-blue-400">Logic Score:</span> Strategy reasoning and methodology</li>
                <li>• <span className="text-green-400">Backtest Score:</span> Historical performance validation</li>
                <li>• <span className="text-yellow-400">Economic Score:</span> Current market conditions alignment</li>
                <li>• <span className="text-purple-400">Risk Rating:</span> Volatility and drawdown assessment</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Performance Metrics</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-green-400">Monthly Returns:</span> Current month performance</li>
                <li>• <span className="text-aiiq-cyber">24-Month Average:</span> Long-term consistency</li>
                <li>• <span className="text-yellow-400">AI Score:</span> Composite rating (0-100)</li>
                <li>• <span className="text-red-400">Risk Level:</span> Low/Medium/High classification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import React, { useState, useEffect } from 'react'
import { Cpu, RefreshCw, Activity, TrendingUp, Users, Clock, Database } from 'lucide-react'

interface GPUData {
  super_influencers?: {
    portfolioHoldings?: Array<{
      symbol: string
      weight: number
      value: string
      change: string
    }>
    recentMoves?: Array<{
      action: string
      date: string
      impact: string
    }>
    publicStatements?: Array<{
      statement: string
      date: string
      sentiment: string
    }>
  }
  collected_at?: string
  gpu_models_used?: string[]
  data_source?: string
  collection_version?: string
}

export default function GPUDataPage() {
  const [gpuData, setGpuData] = useState<GPUData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  const fetchGPUData = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://146.190.188.208:8080/latest_collection')
      if (!response.ok) {
        throw new Error('Failed to fetch GPU data')
      }
      const data = await response.json()
      setGpuData(data)
      setLastUpdate(new Date().toLocaleTimeString())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGPUData()
    const interval = setInterval(fetchGPUData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'bullish': return 'text-green-400 bg-green-900/20'
      case 'bearish': return 'text-red-400 bg-red-900/20'
      case 'neutral': return 'text-yellow-400 bg-yellow-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'positive': return 'text-green-400'
      case 'negative': return 'text-red-400'
      case 'neutral': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  if (loading && !gpuData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-aiiq-darker via-aiiq-dark to-aiiq-darker p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 text-aiiq-cyber animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-aiiq-display text-white">Connecting to GPU Server...</h2>
              <p className="text-gray-400 mt-2">Fetching real-time data collection</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-aiiq-darker via-aiiq-dark to-aiiq-darker p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-aiiq-cyber/20 to-aiiq-rose/20 rounded-xl border border-aiiq-cyber/30">
              <Cpu className="h-8 w-8 text-aiiq-cyber" />
            </div>
            <div>
              <h1 className="text-3xl font-aiiq-display text-white">GPU Data Collection</h1>
              <p className="text-gray-400">Real-time market intelligence from AI-powered GPU models</p>
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="flex items-center gap-6 p-4 bg-aiiq-dark/50 rounded-xl border border-aiiq-light/20">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">LIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">Last Update: {lastUpdate || 'Never'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">Source: {gpuData?.data_source || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">Version: {gpuData?.collection_version || 'Unknown'}</span>
            </div>
            <button
              onClick={fetchGPUData}
              disabled={loading}
              className="ml-auto px-4 py-2 bg-aiiq-cyber/20 text-aiiq-cyber rounded-lg border border-aiiq-cyber/30 hover:bg-aiiq-cyber/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
            <p className="text-red-400">Error: {error}</p>
          </div>
        )}

        {/* GPU Models Status */}
        {gpuData?.gpu_models_used && (
          <div className="mb-8">
            <h2 className="text-xl font-aiiq-display text-white mb-4 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-aiiq-cyber" />
              Active GPU Models
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {gpuData.gpu_models_used.map((model, index) => (
                <div key={index} className="p-3 bg-aiiq-dark/50 rounded-lg border border-aiiq-light/20 text-center">
                  <div className="h-2 w-2 bg-green-400 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-gray-300 font-medium">{model}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Super Influencers Data */}
        {gpuData?.super_influencers && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Portfolio Holdings */}
            {gpuData.super_influencers.portfolioHoldings && (
              <div className="bg-aiiq-dark/50 rounded-xl border border-aiiq-light/20 p-6">
                <h3 className="text-lg font-aiiq-display text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-aiiq-cyber" />
                  Portfolio Holdings
                </h3>
                <div className="space-y-3">
                  {gpuData.super_influencers.portfolioHoldings.map((holding, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-aiiq-darker/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{holding.symbol}</p>
                        <p className="text-sm text-gray-400">{holding.value}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-aiiq-cyber font-medium">{holding.weight}%</p>
                        <p className={`text-sm ${holding.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {holding.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Moves */}
            {gpuData.super_influencers.recentMoves && (
              <div className="bg-aiiq-dark/50 rounded-xl border border-aiiq-light/20 p-6">
                <h3 className="text-lg font-aiiq-display text-white mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-aiiq-cyber" />
                  Recent Moves
                </h3>
                <div className="space-y-3">
                  {gpuData.super_influencers.recentMoves.map((move, index) => (
                    <div key={index} className="p-3 bg-aiiq-darker/50 rounded-lg">
                      <p className="text-white font-medium mb-1">{move.action}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{move.date}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getImpactColor(move.impact)}`}>
                          {move.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Public Statements */}
        {gpuData?.super_influencers?.publicStatements && (
          <div className="mt-8">
            <h3 className="text-lg font-aiiq-display text-white mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-aiiq-cyber" />
              Public Statements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gpuData.super_influencers.publicStatements.map((statement, index) => (
                <div key={index} className="p-4 bg-aiiq-dark/50 rounded-xl border border-aiiq-light/20">
                  <p className="text-white mb-3 italic">"{statement.statement}"</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{statement.date}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(statement.sentiment)}`}>
                      {statement.sentiment}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collection Metadata */}
        {gpuData?.collected_at && (
          <div className="mt-8 p-4 bg-aiiq-dark/30 rounded-xl border border-aiiq-light/10">
            <div className="text-center text-sm text-gray-400">
              <p>Data collected at: {new Date(gpuData.collected_at).toLocaleString()}</p>
              <p className="mt-1">Collection version: {gpuData.collection_version}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

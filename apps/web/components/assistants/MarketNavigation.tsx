'use client';

import React, { useState } from 'react';

interface MarketSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  status: 'online' | 'offline' | 'loading';
  dataSource: string;
  fallback?: string;
}

interface MarketNavigationProps {
  onMarketSelect: (market: string) => void;
  activeMarket?: string;
}

export default function MarketNavigation({ onMarketSelect, activeMarket = 'overview' }: MarketNavigationProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['equity', 'crypto']);

  const marketSections: MarketSection[] = [
    {
      id: 'overview',
      title: 'Portfolio Overview',
      icon: '📊',
      description: 'Multi-asset portfolio summary',
      status: 'online',
      dataSource: 'Local'
    },
    {
      id: 'equity',
      title: 'US Equity Markets',
      icon: '📈',
      description: 'SPY, AAPL, TSLA, NVDA, QQQ, IWM',
      status: 'online',
      dataSource: 'Alpha Vantage Premium',
      fallback: 'MarketData.app'
    },
    {
      id: 'crypto',
      title: 'Cryptocurrency',
      icon: '₿',
      description: 'BTC, ETH, SOL options & spot',
      status: 'online',
      dataSource: 'Deribit Live',
      fallback: 'Mock data'
    },
    {
      id: 'forex',
      title: 'Foreign Exchange',
      icon: '💱',
      description: 'Major currency pairs',
      status: 'online',
      dataSource: 'Alpha Vantage Premium',
      fallback: 'Mock rates'
    },
    {
      id: 'options',
      title: 'Options Chain',
      icon: '📋',
      description: 'US equity options data',
      status: 'online',
      dataSource: 'Alpha Vantage Premium',
      fallback: 'MarketData.app'
    },
    {
      id: 'intraday',
      title: 'Real-Time Intraday',
      icon: '⚡',
      description: '1min, 5min, 15min charts',
      status: 'online',
      dataSource: 'Alpha Vantage Premium',
      fallback: 'Daily data'
    },
    {
      id: 'technical',
      title: 'Technical Analysis',
      icon: '📊',
      description: 'RSI, MACD, VWAP indicators',
      status: 'online',
      dataSource: 'Alpha Vantage Premium',
      fallback: 'Basic indicators'
    },
    {
      id: 'news',
      title: 'Market News',
      icon: '📰',
      description: 'Financial news & sentiment',
      status: 'offline',
      dataSource: 'Alpha Vantage',
      fallback: 'RSS feeds'
    },
    {
      id: 'earnings',
      title: 'Earnings Calendar',
      icon: '📅',
      description: 'Upcoming earnings dates',
      status: 'offline',
      dataSource: 'Alpha Vantage',
      fallback: 'Manual calendar'
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      case 'loading': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '🟢';
      case 'offline': return '🔴';
      case 'loading': return '🟡';
      default: return '⚪';
    }
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Market Navigation</h2>
        <p className="text-xs text-gray-400 mt-1">Quick access to all markets</p>
      </div>

      {/* Market Sections */}
      <div className="p-2">
        {marketSections.map((section) => (
          <div key={section.id} className="mb-2">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                activeMarket === section.id 
                  ? 'bg-blue-600/20 border border-blue-500/30' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{section.icon}</span>
                <div className="text-left">
                  <div className="text-white font-medium text-sm">{section.title}</div>
                  <div className="text-gray-400 text-xs">{section.description}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs ${getStatusColor(section.status)}`}>
                  {getStatusIcon(section.status)}
                </span>
                <span className={`text-xs ${expandedSections.includes(section.id) ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
            </button>

            {/* Section Details */}
            {expandedSections.includes(section.id) && (
              <div className="ml-4 mt-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Data Source:</span>
                    <span className="text-white">{section.dataSource}</span>
                  </div>
                  {section.fallback && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fallback:</span>
                      <span className="text-yellow-400">{section.fallback}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={getStatusColor(section.status)}>
                      {section.status.charAt(0).toUpperCase() + section.status.slice(1)}
                    </span>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="pt-2 border-t border-gray-700">
                    <button
                      onClick={() => onMarketSelect(section.id)}
                      className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                    >
                      View {section.title}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Status */}
      <div className="p-4 border-t border-gray-700 mt-auto">
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Alpha Vantage:</span>
            <span className="text-green-400">Premium Active</span>
          </div>
          <div className="flex justify-between">
            <span>Deribit:</span>
            <span className="text-green-400">Live Crypto</span>
          </div>
          <div className="flex justify-between">
            <span>Rate Limit:</span>
            <span className="text-blue-400">150 calls/min</span>
          </div>
        </div>
      </div>
    </div>
  );
}


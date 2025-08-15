'use client';

import React from 'react';
import PremiumMarketData from './PremiumMarketData';
import CryptoMarketsOverview from './CryptoMarketsOverview';
import CryptoOptionsChain from './CryptoOptionsChain';
import ForexRates from './ForexRates';
import AlphaVantageOptions from './AlphaVantageOptions';
import RealTimeIntraday from './RealTimeIntraday';

interface MarketContentProps {
  activeMarket: string;
}

export default function MarketContent({ activeMarket }: MarketContentProps) {
  const renderMarketContent = () => {
    switch (activeMarket) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Portfolio Overview */}
            <div className="aiiq-tile p-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Multi-Asset Portfolio</h2>
              <p className="text-gray-400">Real-time crypto, forex, and equity positions with comprehensive market data</p>
            </div>

            {/* Quick Market Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="aiiq-tile p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Equity Markets</h3>
                <div className="text-3xl font-bold text-green-400">$2,847.50</div>
                <div className="text-sm text-gray-400">SPY +2.3% • AAPL +1.8%</div>
              </div>
              <div className="aiiq-tile p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Crypto Markets</h3>
                <div className="text-3xl font-bold text-blue-400">$43,250</div>
                <div className="text-sm text-gray-400">BTC +5.2% • ETH +3.7%</div>
              </div>
              <div className="aiiq-tile p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Forex Markets</h3>
                <div className="text-3xl font-bold text-purple-400">1.0875</div>
                <div className="text-sm text-gray-400">EUR/USD -0.1% • GBP/USD +0.2%</div>
              </div>
            </div>

            {/* Asset Allocation */}
            <div className="aiiq-tile p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Asset Allocation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">60%</div>
                  <div className="text-gray-400 text-sm">Crypto</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">25%</div>
                  <div className="text-gray-400 text-sm">Forex</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">15%</div>
                  <div className="text-gray-400 text-sm">Equities</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'equity':
        return (
          <div className="space-y-6">
            <div className="aiiq-tile p-6">
              <h2 className="text-2xl font-semibold text-white mb-2">US Equity Markets</h2>
              <p className="text-gray-400">Real-time quotes and analysis for major US equities</p>
            </div>
            <PremiumMarketData symbols={['SPY', 'AAPL', 'TSLA', 'NVDA', 'QQQ', 'IWM']} />
          </div>
        );

      case 'crypto':
        return (
          <div className="space-y-6">
            <div className="aiiq-tile p-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Cryptocurrency Markets</h2>
              <p className="text-gray-400">Live crypto data from Deribit and market overview</p>
            </div>
            <CryptoMarketsOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CryptoOptionsChain currency="BTC" limit={8} />
              <CryptoOptionsChain currency="ETH" limit={8} />
            </div>
          </div>
        );

      case 'forex':
        return (
          <div className="space-y-6">
            <div className="aiiq-tile p-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Foreign Exchange Markets</h2>
              <p className="text-gray-400">Real-time forex rates and currency analysis</p>
            </div>
            <ForexRates base="USD" />
          </div>
        );

      case 'options':
        return (
          <div className="space-y-6">
            <div className="aiiq-tile p-6">
              <h2 className="text-2xl font-semibold text-white mb-2">US Equity Options</h2>
              <p className="text-gray-400">Comprehensive options chain data from Alpha Vantage Premium</p>
            </div>
            <AlphaVantageOptions symbol="SPY" limit={20} />
          </div>
        );

      case 'intraday':
        return (
          <div className="space-y-6">
            <div className="aiiq-tile p-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Real-Time Intraday Data</h2>
              <p className="text-gray-400">Live 1-minute, 5-minute, and 15-minute market data with VWAP</p>
            </div>
            <RealTimeIntraday symbol="SPY" defaultInterval="5min" />
          </div>
        );

      case 'technical':
        return (
          <div className="space-y-6">
            <div className="aiiq-tile p-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Technical Analysis</h2>
              <p className="text-gray-400">Advanced technical indicators and chart analysis</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="aiiq-tile p-6">
                <h3 className="text-lg font-semibold text-white mb-4">RSI Analysis</h3>
                <div className="text-gray-400 text-center py-8">
                  RSI technical indicator data will be displayed here
                </div>
              </div>
              <div className="aiiq-tile p-6">
                <h3 className="text-lg font-semibold text-white mb-4">MACD Analysis</h3>
                <div className="text-gray-400 text-center py-8">
                  MACD technical indicator data will be displayed here
                </div>
              </div>
            </div>
          </div>
        );

      case 'news':
        return (
          <div className="space-y-6">
            <div className="aiiq-tile p-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Market News & Sentiment</h2>
              <p className="text-gray-400">Financial news and market sentiment analysis</p>
            </div>
            <div className="aiiq-tile p-6">
              <div className="text-gray-400 text-center py-8">
                Market news integration coming soon...
              </div>
            </div>
          </div>
        );

      case 'earnings':
        return (
          <div className="space-y-6">
            <div className="aiiq-tile p-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Earnings Calendar</h2>
              <p className="text-gray-400">Upcoming earnings dates and estimates</p>
            </div>
            <div className="aiiq-tile p-6">
              <div className="text-gray-400 text-center py-8">
                Earnings calendar integration coming soon...
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="aiiq-tile p-6">
            <div className="text-gray-400 text-center py-8">
              Select a market from the navigation to view data
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {renderMarketContent()}
    </div>
  );
}


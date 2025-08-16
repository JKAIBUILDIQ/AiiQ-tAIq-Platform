import React from 'react'

export default function OverviewPage() {
  return (
    <div className="min-h-screen bg-aiiq-darker text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-aiiq-display aiiq-gradient-text mb-4">
            Market Overview
          </h1>
          <p className="text-gray-300 text-lg">
            Comprehensive view of global markets, indices, and asset performance
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Indices */}
          <div className="aiiq-card">
            <h2 className="text-xl font-semibold text-aiiq-cyber mb-4">Major Indices</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-aiiq-lighter rounded-lg">
                <span className="font-medium">S&P 500</span>
                <div className="text-right">
                  <div className="text-white">6,483.7</div>
                  <div className="text-aiiq-success text-sm">+15.60 (+0.24%)</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-aiiq-lighter rounded-lg">
                <span className="font-medium">NASDAQ 100</span>
                <div className="text-right">
                  <div className="text-white">23,853.1</div>
                  <div className="text-aiiq-danger text-sm">-57.90 (-0.24%)</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-aiiq-lighter rounded-lg">
                <span className="font-medium">DOW 30</span>
                <div className="text-right">
                  <div className="text-white">38,109.4</div>
                  <div className="text-aiiq-success text-sm">+45.20 (+0.12%)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Currency Pairs */}
          <div className="aiiq-card">
            <h2 className="text-xl font-semibold text-aiiq-cyber mb-4">Forex</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-aiiq-lighter rounded-lg">
                <span className="font-medium">EUR/USD</span>
                <div className="text-right">
                  <div className="text-white">1.16768</div>
                  <div className="text-aiiq-success text-sm">+0.00 (+0.24%)</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-aiiq-lighter rounded-lg">
                <span className="font-medium">GBP/USD</span>
                <div className="text-right">
                  <div className="text-white">1.2845</div>
                  <div className="text-aiiq-danger text-sm">-0.0023 (-0.18%)</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-aiiq-lighter rounded-lg">
                <span className="font-medium">USD/JPY</span>
                <div className="text-right">
                  <div className="text-white">148.25</div>
                  <div className="text-aiiq-success text-sm">+0.15 (+0.10%)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Crypto */}
          <div className="aiiq-card">
            <h2 className="text-xl font-semibold text-aiiq-cyber mb-4">Cryptocurrency</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-aiiq-lighter rounded-lg">
                <span className="font-medium">Bitcoin</span>
                <div className="text-right">
                  <div className="text-white">$118,945</div>
                  <div className="text-aiiq-success text-sm">+551.00 (+0.47%)</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-aiiq-lighter rounded-lg">
                <span className="font-medium">Ethereum</span>
                <div className="text-right">
                  <div className="text-white">$4,644.7</div>
                  <div className="text-aiiq-success text-sm">+93.80 (+2.06%)</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-aiiq-lighter rounded-lg">
                <span className="font-medium">Solana</span>
                <div className="text-right">
                  <div className="text-white">$110.66</div>
                  <div className="text-aiiq-success text-sm">+15.80 (+16.67%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Sentiment */}
        <div className="mt-8">
          <div className="aiiq-card">
            <h2 className="text-xl font-semibold text-aiiq-cyber mb-4">Market Sentiment</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-aiiq-lighter rounded-lg">
                <div className="text-2xl font-bold text-aiiq-success">Bullish</div>
                <div className="text-gray-300 text-sm">Market Outlook</div>
              </div>
              <div className="text-center p-4 bg-aiiq-lighter rounded-lg">
                <div className="text-2xl font-bold text-aiiq-cyber">65%</div>
                <div className="text-gray-300 text-sm">Risk Level</div>
              </div>
              <div className="text-center p-4 bg-aiiq-lighter rounded-lg">
                <div className="text-2xl font-bold text-aiiq-gold">Stable</div>
                <div className="text-gray-300 text-sm">Volatility</div>
              </div>
              <div className="text-center p-4 bg-aiiq-lighter rounded-lg">
                <div className="text-2xl font-bold text-aiiq-rose">High</div>
                <div className="text-gray-300 text-sm">Liquidity</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

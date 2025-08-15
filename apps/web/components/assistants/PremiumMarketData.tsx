'use client';

import React, { useState, useEffect } from 'react';

interface MarketQuote {
  symbol: string;
  price: number;
  change: number;
  change_percent: string;
  volume: number;
  high: number;
  low: number;
  open: number;
  previous_close: number;
  last_refreshed: string;
  source: string;
}

interface TechnicalData {
  symbol: string;
  indicator: string;
  interval: string;
  time_period: number;
  data: Array<{ date: string; value: number }>;
  source: string;
}

interface PremiumMarketDataProps {
  symbols?: string[];
}

export default function PremiumMarketData({ symbols = ['SPY', 'AAPL', 'TSLA', 'NVDA'] }: PremiumMarketDataProps) {
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [technicalData, setTechnicalData] = useState<TechnicalData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState('SPY');

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const quotePromises = symbols.map(async (symbol) => {
        const response = await fetch(`http://localhost:8080/alpha/quote/${symbol}`);
        return response.json();
      });
      
      const results = await Promise.all(quotePromises);
      const validQuotes = results.filter(result => !result.error);
      setQuotes(validQuotes);
      
      if (validQuotes.length === 0) {
        setError('No quote data available');
      }
    } catch (err) {
      setError('Failed to fetch market quotes');
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicalData = async (symbol: string) => {
    try {
      const response = await fetch(`http://localhost:8080/alpha/technical/${symbol}?function=RSI&interval=daily&time_period=14`);
      const data = await response.json();
      
      if (!data.error) {
        setTechnicalData(prev => {
          const filtered = prev.filter(item => item.symbol !== symbol);
          return [...filtered, data];
        });
      }
    } catch (err) {
      console.error(`Failed to fetch technical data for ${symbol}:`, err);
    }
  };

  useEffect(() => {
    fetchQuotes();
    const interval = setInterval(fetchQuotes, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [symbols]);

  useEffect(() => {
    if (selectedSymbol) {
      fetchTechnicalData(selectedSymbol);
    }
  }, [selectedSymbol]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-300';
  };

  const getChangeBgColor = (change: number) => {
    if (change > 0) return 'bg-green-600/20';
    if (change < 0) return 'bg-red-600/20';
    return 'bg-gray-600/20';
  };

  if (loading && quotes.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Premium Market Data (Alpha Vantage)
        </h3>
        <div className="text-xs text-gray-400">
          150 calls/min • Real-time quotes
        </div>
      </div>
      
      {error && (
        <div className="text-red-400 text-sm mb-4 p-3 bg-red-900/20 rounded">
          Error: {error}
        </div>
      )}
      
      {/* Market Quotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {quotes.map((quote, index) => (
          <div key={index} className="bg-gray-700/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">{quote.symbol}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getChangeBgColor(quote.change)} ${getChangeColor(quote.change)}`}>
                {quote.change_percent}
              </span>
            </div>
            
            <div className="text-2xl font-bold text-white mb-2">
              {formatPrice(quote.price)}
            </div>
            
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Change</span>
                <span className={getChangeColor(quote.change)}>
                  {quote.change > 0 ? '+' : ''}{formatPrice(quote.change)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Volume</span>
                <span className="text-gray-300">{formatVolume(quote.volume)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">High</span>
                <span className="text-gray-300">{formatPrice(quote.high)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Low</span>
                <span className="text-gray-300">{formatPrice(quote.low)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Technical Analysis */}
      <div className="bg-gray-700/50 rounded-lg p-4">
        <h4 className="text-md font-semibold text-white mb-3">Technical Analysis</h4>
        <div className="flex items-center space-x-4 mb-4">
          <label className="text-gray-300 text-sm">Symbol:</label>
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="bg-gray-600 text-white px-3 py-1 rounded border border-gray-500 text-sm"
          >
            {symbols.map(symbol => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>
        </div>
        
        {technicalData.find(item => item.symbol === selectedSymbol) ? (
          <div className="space-y-2">
            {technicalData
              .filter(item => item.symbol === selectedSymbol)
              .map((item, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between text-gray-300 mb-1">
                    <span>{item.indicator} ({item.interval})</span>
                    <span>Period: {item.time_period}</span>
                  </div>
                  {item.data.slice(0, 5).map((point, idx) => (
                    <div key={idx} className="flex justify-between text-gray-400 text-xs">
                      <span>{point.date}</span>
                      <span>{point.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-4">
            Select a symbol to view technical indicators
          </div>
        )}
      </div>
      
      <div className="mt-3 text-xs text-gray-500 text-center">
        Source: Alpha Vantage Premium • {quotes.length} symbols loaded
      </div>
    </div>
  );
}


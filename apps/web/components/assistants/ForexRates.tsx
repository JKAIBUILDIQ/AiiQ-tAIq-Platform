'use client';

import React, { useState, useEffect } from 'react';

interface ForexPair {
  from: string;
  to: string;
  rate: number;
  change: number;
}

interface ForexRatesProps {
  base?: string;
}

export default function ForexRates({ base = 'USD' }: ForexRatesProps) {
  const [pairs, setPairs] = useState<ForexPair[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForexRates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8080/forex/rates?base=${base}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setPairs(data.pairs || []);
      }
    } catch (err) {
      setError('Failed to fetch forex rates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForexRates();
    // Refresh every 60 seconds
    const interval = setInterval(fetchForexRates, 60000);
    return () => clearInterval(interval);
  }, [base]);

  const formatRate = (rate: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(rate);
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    const sign = isPositive ? '+' : '';
    return (
      <span className={`${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {sign}{change.toFixed(4)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-red-400 text-sm mb-2">Error: {error}</div>
        <button 
          onClick={fetchForexRates}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Forex Exchange Rates
        </h3>
        <div className="flex items-center space-x-2">
          <select 
            value={base} 
            onChange={(e) => setPairs([])} // Will trigger useEffect to refetch
            className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
          >
            <option value="USD">USD Base</option>
            <option value="EUR">EUR Base</option>
            <option value="GBP">GBP Base</option>
            <option value="ALL">All Pairs</option>
          </select>
          <button
            onClick={fetchForexRates}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
      
      {pairs.length === 0 ? (
        <div className="text-gray-400 text-center py-8">No forex data available</div>
      ) : (
        <div className="space-y-3">
          {pairs.map((pair, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="text-white font-medium">
                  {pair.from}/{pair.to}
                </div>
                <div className="text-gray-400 text-sm">
                  {pair.from === base ? 'Base' : 'Quote'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-mono text-lg">
                  {formatRate(pair.rate)}
                </div>
                <div className="text-sm">
                  {formatChange(pair.change)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500 text-center">
        Source: MarketData • Updates every 60s
      </div>
    </div>
  );
}


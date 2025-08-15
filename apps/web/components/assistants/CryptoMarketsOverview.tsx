'use client';

import React, { useState, useEffect } from 'react';

interface CryptoMarket {
  symbol: string;
  name: string;
  type: string;
  status: string;
  endpoints: string[];
}

export default function CryptoMarketsOverview() {
  const [markets, setMarkets] = useState<CryptoMarket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptoMarkets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8080/crypto/markets');
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setMarkets(data.markets || []);
      }
    } catch (err) {
      setError('Failed to fetch crypto markets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoMarkets();
    // Refresh every 5 minutes
    const interval = setInterval(fetchCryptoMarkets, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
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
          onClick={fetchCryptoMarkets}
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
          Crypto Markets Overview
        </h3>
        <button
          onClick={fetchCryptoMarkets}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
        >
          Refresh
        </button>
      </div>
      
      {markets.length === 0 ? (
        <div className="text-gray-400 text-center py-8">No crypto markets available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {markets.map((market, index) => (
            <div key={index} className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="text-white font-semibold text-lg">
                  {market.symbol}
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  market.status === 'active' 
                    ? 'bg-green-600/20 text-green-400' 
                    : 'bg-red-600/20 text-red-400'
                }`}>
                  {market.status.toUpperCase()}
                </span>
              </div>
              
              <div className="text-gray-300 text-sm mb-3">
                {market.name}
              </div>
              
              <div className="text-gray-400 text-xs">
                <div className="mb-1">Type: {market.type}</div>
                <div className="mb-1">Available Data:</div>
                <ul className="list-disc list-inside space-y-1">
                  {market.endpoints.map((endpoint, idx) => (
                    <li key={idx} className="text-blue-400">
                      {endpoint.replace('/crypto/', '').replace('/btc', 'BTC').replace('/eth', 'ETH').replace('/sol', 'SOL')}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Source: Deribit • {markets.length} markets available
      </div>
    </div>
  );
}

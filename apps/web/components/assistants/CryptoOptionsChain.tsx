'use client';

import React, { useState, useEffect } from 'react';

interface CryptoOption {
  underlying: string;
  contract: string;
  strike: number;
  type: 'call' | 'put';
  expiration: number;
  volume: number;
  openInterest: number;
  source: string;
}

interface CryptoOptionsChainProps {
  currency?: string;
  limit?: number;
}

export default function CryptoOptionsChain({ currency = 'BTC', limit = 10 }: CryptoOptionsChainProps) {
  const [options, setOptions] = useState<CryptoOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptoOptions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8080/crypto/options/${currency.toLowerCase()}?limit=${limit}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setOptions(data.data || []);
      }
    } catch (err) {
      setError('Failed to fetch crypto options data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoOptions();
    // Refresh every 30 seconds
    const interval = setInterval(fetchCryptoOptions, 30000);
    return () => clearInterval(interval);
  }, [currency, limit]);

  const formatExpiration = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: '2-digit' 
    });
  };

  const formatStrike = (strike: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(strike);
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
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
          onClick={fetchCryptoOptions}
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
          Most Active {currency} Options
        </h3>
        <button
          onClick={fetchCryptoOptions}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
        >
          Refresh
        </button>
      </div>
      
      {options.length === 0 ? (
        <div className="text-gray-400 text-center py-8">No {currency} options data available</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-300">
                <th className="text-left py-2">Contract</th>
                <th className="text-left py-2">Strike</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Expiration</th>
                <th className="text-right py-2">Volume</th>
                <th className="text-right py-2">Open Interest</th>
              </tr>
            </thead>
            <tbody>
              {options.map((option, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="py-2 text-white font-mono text-xs">
                    {option.contract}
                  </td>
                  <td className="py-2 text-gray-300">
                    {formatStrike(option.strike)}
                  </td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      option.type === 'call' 
                        ? 'bg-green-600/20 text-green-400' 
                        : 'bg-red-600/20 text-red-400'
                    }`}>
                      {option.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2 text-gray-300">
                    {formatExpiration(option.expiration)}
                  </td>
                  <td className="py-2 text-right text-gray-300">
                    {option.volume.toLocaleString()}
                  </td>
                  <td className="py-2 text-right text-gray-300">
                    {option.openInterest.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500 text-center">
        Source: Deribit • Updates every 30s
      </div>
    </div>
  );
}


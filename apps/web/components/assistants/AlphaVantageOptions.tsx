'use client';

import React, { useState, useEffect } from 'react';

interface AlphaVantageOption {
  underlying: string;
  contract: string;
  strike: number;
  type: 'call' | 'put';
  expiration: string;
  bid: number;
  ask: number;
  last: number;
  volume: number;
  openInterest: number;
  source: string;
}

interface AlphaVantageOptionsProps {
  symbol?: string;
  limit?: number;
}

export default function AlphaVantageOptions({ symbol = 'SPY', limit = 20 }: AlphaVantageOptionsProps) {
  const [options, setOptions] = useState<AlphaVantageOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputSymbol, setInputSymbol] = useState(symbol);

  const fetchOptions = async () => {
    if (!inputSymbol.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8080/alpha/options/chain?symbol=${inputSymbol.trim().toUpperCase()}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        // Sort by volume and take top options
        const sortedOptions = (data.options || [])
          .sort((a: AlphaVantageOption, b: AlphaVantageOption) => b.volume - a.volume)
          .slice(0, limit);
        setOptions(sortedOptions);
      }
    } catch (err) {
      setError('Failed to fetch options data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inputSymbol) {
      fetchOptions();
    }
  }, [inputSymbol]);

  const formatStrike = (strike: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(strike);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
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

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          US Options Chain (Alpha Vantage)
        </h3>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputSymbol}
            onChange={(e) => setInputSymbol(e.target.value)}
            placeholder="Enter symbol (e.g., SPY)"
            className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && fetchOptions()}
          />
          <button
            onClick={fetchOptions}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            Search
          </button>
        </div>
      </div>
      
      {error && (
        <div className="text-red-400 text-sm mb-4 p-3 bg-red-900/20 rounded">
          Error: {error}
        </div>
      )}
      
      {options.length === 0 && !loading && !error ? (
        <div className="text-gray-400 text-center py-8">
          Enter a symbol above to search for options
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-300">
                <th className="text-left py-2">Contract</th>
                <th className="text-left py-2">Strike</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Expiration</th>
                <th className="text-right py-2">Bid</th>
                <th className="text-right py-2">Ask</th>
                <th className="text-right py-2">Last</th>
                <th className="text-right py-2">Volume</th>
                <th className="text-right py-2">OI</th>
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
                    {option.expiration}
                  </td>
                  <td className="py-2 text-right text-gray-300">
                    {formatPrice(option.bid)}
                  </td>
                  <td className="py-2 text-right text-gray-300">
                    {formatPrice(option.ask)}
                  </td>
                  <td className="py-2 text-right text-gray-300">
                    {formatPrice(option.last)}
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
        Source: Alpha Vantage • {options.length} options found
      </div>
    </div>
  );
}



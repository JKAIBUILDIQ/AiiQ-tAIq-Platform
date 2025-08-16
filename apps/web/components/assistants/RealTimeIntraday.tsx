'use client';

import React, { useState, useEffect } from 'react';

interface IntradayPoint {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface VWAPPoint {
  timestamp: string;
  vwap: number;
}

interface RealTimeIntradayProps {
  symbol?: string;
  defaultInterval?: string;
}

export default function RealTimeIntraday({ symbol = 'SPY', defaultInterval = '5min' }: RealTimeIntradayProps) {
  const [intradayData, setIntradayData] = useState<IntradayPoint[]>([]);
  const [vwapData, setVwapData] = useState<VWAPPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInterval, setSelectedInterval] = useState(defaultInterval);
  const [selectedSymbol, setSelectedSymbol] = useState(symbol);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const intervals = [
    { value: '1min', label: '1 Minute', description: 'Real-time' },
    { value: '5min', label: '5 Minutes', description: 'Real-time' },
    { value: '15min', label: '15 Minutes', description: 'Real-time' },
    { value: '30min', label: '30 Minutes', description: 'Real-time' },
    { value: '60min', label: '1 Hour', description: 'Real-time' }
  ];

  const fetchIntradayData = async () => {
    if (!selectedSymbol.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [intradayResponse, vwapResponse] = await Promise.all([
        fetch(`http://localhost:8080/alpha/intraday/${selectedSymbol.trim().toUpperCase()}?interval=${selectedInterval}`),
        fetch(`http://localhost:8080/alpha/vwap/${selectedSymbol.trim().toUpperCase()}?interval=${selectedInterval}`)
      ]);
      
      const intradayData = await intradayResponse.json();
      const vwapData = await vwapResponse.json();
      
      if (intradayData.error) {
        setError(intradayData.error);
      } else {
        setIntradayData(intradayData.data || []);
      }
      
      if (!vwapData.error) {
        setVwapData(vwapData.data || []);
      }
      
    } catch (err) {
      setError('Failed to fetch intraday data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSymbol && selectedInterval) {
      fetchIntradayData();
    }
  }, [selectedSymbol, selectedInterval]);

  useEffect(() => {
    if (autoRefresh && selectedSymbol && selectedInterval) {
      const interval = setInterval(fetchIntradayData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedSymbol, selectedInterval]);

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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getPriceChange = (current: number, previous: number) => {
    const change = current - previous;
    const percentChange = (change / previous) * 100;
    return { change, percentChange };
  };

  if (loading && intradayData.length === 0) {
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
          Real-Time Intraday Data
        </h3>
        <div className="text-xs text-green-400">
          ⚡ Premium • Extended Hours • 150 calls/min
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <label className="text-gray-300 text-sm">Symbol:</label>
          <input
            type="text"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            placeholder="Enter symbol"
            className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 text-sm w-20"
            onKeyPress={(e) => e.key === 'Enter' && fetchIntradayData()}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-gray-300 text-sm">Interval:</label>
          <select
            value={selectedInterval}
            onChange={(e) => setSelectedInterval(e.target.value)}
            className="bg-gray-600 text-white px-3 py-1 rounded border border-gray-500 text-sm"
          >
            {intervals.map(interval => (
              <option key={interval.value} value={interval.value}>
                {interval.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-gray-300 text-sm">Auto-refresh:</label>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="rounded"
          />
        </div>
        
        <button
          onClick={fetchIntradayData}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
        >
          Refresh
        </button>
      </div>
      
      {error && (
        <div className="text-red-400 text-sm mb-4 p-3 bg-red-900/20 rounded">
          Error: {error}
        </div>
      )}
      
      {/* Current Price & VWAP */}
      {intradayData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-gray-400 text-xs">Current Price</div>
            <div className="text-2xl font-bold text-white">
              {formatPrice(intradayData[0].close)}
            </div>
            {intradayData.length > 1 && (
              <div className={`text-sm ${getPriceChange(intradayData[0].close, intradayData[1].close).change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {getPriceChange(intradayData[0].close, intradayData[1].close).change >= 0 ? '+' : ''}
                {formatPrice(getPriceChange(intradayData[0].close, intradayData[1].close).change)}
                ({getPriceChange(intradayData[0].close, intradayData[1].close).percentChange.toFixed(2)}%)
              </div>
            )}
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-gray-400 text-xs">VWAP</div>
            <div className="text-2xl font-bold text-white">
              {vwapData.length > 0 ? formatPrice(vwapData[0].vwap) : 'N/A'}
            </div>
            <div className="text-gray-400 text-xs">Volume Weighted</div>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-gray-400 text-xs">Session Range</div>
            <div className="text-lg font-semibold text-white">
              H: {formatPrice(Math.max(...intradayData.map(d => d.high)))}
            </div>
            <div className="text-lg font-semibold text-white">
              L: {formatPrice(Math.min(...intradayData.map(d => d.low)))}
            </div>
          </div>
        </div>
      )}
      
      {/* Intraday Data Table */}
      {intradayData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-300">
                <th className="text-left py-2">Time</th>
                <th className="text-right py-2">Open</th>
                <th className="text-right py-2">High</th>
                <th className="text-right py-2">Low</th>
                <th className="text-right py-2">Close</th>
                <th className="text-right py-2">Volume</th>
                <th className="text-right py-2">Change</th>
              </tr>
            </thead>
            <tbody>
              {intradayData.slice(0, 20).map((point, index) => {
                const change = index < intradayData.length - 1 ? 
                  getPriceChange(point.close, intradayData[index + 1].close) : { change: 0, percentChange: 0 };
                
                return (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-2 text-gray-300">
                      {formatTimestamp(point.timestamp)}
                    </td>
                    <td className="py-2 text-right text-gray-300">
                      {formatPrice(point.open)}
                    </td>
                    <td className="py-2 text-right text-gray-300">
                      {formatPrice(point.high)}
                    </td>
                    <td className="py-2 text-right text-gray-300">
                      {formatPrice(point.low)}
                    </td>
                    <td className="py-2 text-right text-white font-medium">
                      {formatPrice(point.close)}
                    </td>
                    <td className="py-2 text-right text-gray-300">
                      {formatVolume(point.volume)}
                    </td>
                    <td className={`py-2 text-right text-sm font-medium ${
                      change.change > 0 ? 'text-green-400' : 
                      change.change < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {change.change > 0 ? '+' : ''}{formatPrice(change.change)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-400 text-center py-8">
          Enter a symbol above to view real-time intraday data
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500 text-center">
        Source: Alpha Vantage Premium • Real-time data • Extended hours included
      </div>
    </div>
  );
}



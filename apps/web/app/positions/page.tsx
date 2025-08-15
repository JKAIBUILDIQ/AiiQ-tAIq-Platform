"use client"

import React, { useState } from 'react';
import MarketNavigation from '../../components/assistants/MarketNavigation';
import MarketContent from '../../components/assistants/MarketContent';

export default function PositionsPage() {
  const [activeMarket, setActiveMarket] = useState('overview');

  const handleMarketSelect = (market: string) => {
    setActiveMarket(market);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Market Navigation Sidebar */}
      <MarketNavigation 
        onMarketSelect={handleMarketSelect}
        activeMarket={activeMarket}
      />
      
      {/* Market Content Area */}
      <MarketContent activeMarket={activeMarket} />
    </div>
  );
}



import { DashboardHero } from '@/components/dashboard-hero'
import { Watchlist } from '@/components/watchlist'
import { QuickPositions } from '@/components/quick-positions'
import { RiskBanner } from '@/components/risk-banner'
import { MarketOverview } from '@/components/market-overview'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-aiiq-dark">
      {/* Hero Section with AiiQ Branding */}
      <DashboardHero />
      
      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Risk Banner - Always Visible */}
        <RiskBanner />
        
        {/* Market Overview */}
        <MarketOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Watchlist */}
          <div className="lg:col-span-2">
            <Watchlist />
          </div>
          
          {/* Quick Positions */}
          <div>
            <QuickPositions />
          </div>
        </div>
      </div>
    </div>
  )
}

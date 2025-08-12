'use client'

import { Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RiskBannerProps {
  riskLevel?: 'low' | 'medium' | 'high'
  currentVaR?: number
  maxVaR?: number
  riskPolicy?: string
}

export function RiskBanner({ 
  riskLevel = 'low', 
  currentVaR = 0.02, 
  maxVaR = 0.05,
  riskPolicy = "Max 1% per trade; VaR≤5%"
}: RiskBannerProps) {
  const riskPercentage = (currentVaR / maxVaR) * 100
  const isHighRisk = riskPercentage > 80
  const isMediumRisk = riskPercentage > 50

  const getRiskIcon = () => {
    if (isHighRisk) return <AlertTriangle className="h-5 w-5 text-aiiq-danger" />
    if (isMediumRisk) return <AlertTriangle className="h-5 w-5 text-aiiq-warning" />
    return <CheckCircle className="h-5 w-5 text-aiiq-success" />
  }

  const getRiskColor = () => {
    if (isHighRisk) return 'border-aiiq-danger bg-aiiq-danger/10'
    if (isMediumRisk) return 'border-aiiq-warning bg-aiiq-warning/10'
    return 'border-aiiq-success bg-aiiq-success/10'
  }

  return (
    <div className={cn(
      'border rounded-lg p-4 transition-all duration-200',
      getRiskColor()
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6 text-aiiq-cyber" />
          <div>
            <h3 className="font-semibold text-white">Risk Management</h3>
            <p className="text-sm text-gray-300">{riskPolicy}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-300">Current VaR</p>
            <p className="text-lg font-bold text-white">
              {(currentVaR * 100).toFixed(2)}%
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-300">Max VaR</p>
            <p className="text-lg font-bold text-white">
              {(maxVaR * 100).toFixed(2)}%
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {getRiskIcon()}
            <span className={cn(
              'text-sm font-medium',
              isHighRisk ? 'text-aiiq-danger' : 
              isMediumRisk ? 'text-aiiq-warning' : 'text-aiiq-success'
            )}>
              {riskLevel.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Risk Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Risk Level</span>
          <span>{riskPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-aiiq-light rounded-full h-2">
          <div 
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              isHighRisk ? 'bg-aiiq-danger' : 
              isMediumRisk ? 'bg-aiiq-warning' : 'bg-aiiq-success'
            )}
            style={{ width: `${Math.min(riskPercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useRef, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion'
import Link from 'next/link'
import SideRail from './SideRail'
import {
  Gauge,
  DollarSign,
  BarChart2,
  FileText,
  MessageSquare,
  Flag,
  Zap,
  Home,
  Crown,
  MapPin,
  Bot,
  Brain,
  Activity,
  Server,
  Database,
  Users,
  Settings,
  Terminal,
  LineChart,
  GitBranch,
  Shield,
  Eye,
  Cpu,
  Network,
  Lock,
  Code,
  Palette,
  Wand2,
  Power,
  X,
} from 'lucide-react'
import { WidgetsShelf } from '@/components/widgets/shelf'
import { MarketOverview } from '@/components/market-overview'
import Constellation from './Constellation'
import TilesRow from './TilesRow'
import dynamic from 'next/dynamic'
const OptionsChain = dynamic(() => import('@/components/widgets/options-chain.client'), { ssr: false })
import StrategyPlayground from '@/components/tradingview/StrategyPlayground'
import SymbolSelector from './SymbolSelector'
import { useUIStore } from '@/lib/ui-store'

type LucideIcon = React.ComponentType<{ className?: string }>

interface LenderUpdate {
  id: string
  title: string
  description: string
  date: string
  priority: 'high' | 'medium' | 'low'
  read: boolean
}

interface NavItem { icon: LucideIcon; label: string; href: string; badge?: string; count?: string }
interface NavSection { section: string; items: NavItem[] }

interface AssistantStats {
  name: string
  status: 'active' | 'inactive'
  messages: { daily: number; weekly: number; monthly: number }
  avgResponseTime: string
  type: 'core' | 'assistant' | 'staff' | 'member'
  lastActive: string
  imageId: string
  size: string
  age: string
  cpuUsage: number
  memoryUsage: number
  uptime: number
  errorRate: number
  queueLength: number
  successRate: number
}

interface AssistantLimits {
  type: AssistantStats['type']
  maxDailyMessages: number
  maxConcurrentUsers: number
  maxContextLength: number
  maxResponseTime: number
  features: { apiAccess: boolean; fileUploads: boolean; customization: boolean; priorityQueue: boolean; systemAccess: boolean }
  resourceLimits: { cpuLimit: number; memoryLimit: number; storageLimit: number }
}

const sideNavItems: NavSection[] = [
  { section: 'DASHBOARD FEATURES', items: [
      { icon: Bot, label: 'Builders/Developers', href: '#builders', badge: 'NEW' },
      { icon: Users, label: 'Brokers', href: '#brokers', badge: 'NEW' },
      { icon: DollarSign, label: 'Lenders', href: '#lenders', badge: 'NEW' },
      { icon: Brain, label: 'Bot Training', href: '#bot-training', badge: 'NEW' },
      { icon: BarChart2, label: 'Financial Overview', href: '#financial', badge: 'NEW' },
  ]},
  { section: 'COMMON AREAS', items: [
      { icon: Eye, label: 'AiiQ Vision', href: '#vision' },
      { icon: GitBranch, label: '3 Step Process', href: '#process' },
      { icon: Database, label: 'Lender Matching', href: '#matching' },
      { icon: FileText, label: 'Project Evaluation', href: '#evaluation' },
      { icon: MessageSquare, label: 'Whiteboard Room', href: '#whiteboard' },
      { icon: Users, label: 'CyberCafe', href: '#cyber-cafe' },
      { icon: Crown, label: 'Executive Suite', href: '#executive', badge: 'VIP' },
  ]},
]

const assistantData: AssistantStats[] = [
  { name: 'JBot', status: 'active', messages: { daily: 150, weekly: 842, monthly: 3256 }, avgResponseTime: '1.2s', type: 'core', lastActive: 'Now', imageId: 'fbd6873b', size: '3.8 GB', age: '43h', cpuUsage: 45, memoryUsage: 2.8, uptime: 99.9, errorRate: 0.1, queueLength: 0, successRate: 99.9 },
]

const assistantLimits: Record<AssistantStats['type'], AssistantLimits> = {
  core: { type: 'core', maxDailyMessages: 10000, maxConcurrentUsers: 100, maxContextLength: 8192, maxResponseTime: 30, features: { apiAccess: true, fileUploads: true, customization: true, priorityQueue: true, systemAccess: true }, resourceLimits: { cpuLimit: 100, memoryLimit: 16384, storageLimit: 100 } },
  assistant: { type: 'assistant', maxDailyMessages: 5000, maxConcurrentUsers: 50, maxContextLength: 4096, maxResponseTime: 60, features: { apiAccess: true, fileUploads: true, customization: false, priorityQueue: false, systemAccess: false }, resourceLimits: { cpuLimit: 50, memoryLimit: 8192, storageLimit: 50 } },
  staff: { type: 'staff', maxDailyMessages: 2000, maxConcurrentUsers: 20, maxContextLength: 2048, maxResponseTime: 90, features: { apiAccess: false, fileUploads: true, customization: false, priorityQueue: false, systemAccess: false }, resourceLimits: { cpuLimit: 30, memoryLimit: 4096, storageLimit: 20 } },
  member: { type: 'member', maxDailyMessages: 1000, maxConcurrentUsers: 10, maxContextLength: 1024, maxResponseTime: 120, features: { apiAccess: false, fileUploads: false, customization: false, priorityQueue: false, systemAccess: false }, resourceLimits: { cpuLimit: 20, memoryLimit: 2048, storageLimit: 10 } },
}

export default function FerrariDashboard() {
  const sortedStats = [...assistantData]
  const selectedSymbol = useUIStore((s)=>s.selectedSymbol)
  return (
    <div className="flex min-h-[90vh] bg-[#0a0b0f] rounded-2xl border border-aiiq-light/30 overflow-hidden">
      <SideRail />

      {/* Main area over background visual */}
      <div className="relative flex-1">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/images/ferrari_cruise.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <Constellation />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/0" />

        <div className="relative z-10 p-6 space-y-6">
          <div className="bg-black/50 border border-aiiq-light/30 rounded-xl p-6 backdrop-blur-md aura-tile">
            <h1 className="text-2xl font-aiiq-display">JBot Ferrari <span className="text-aiiq-rose">Dashboard</span></h1>
            <p className="text-gray-400 text-sm mt-1">Professional virtual suite with performance widgets.</p>
            <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
              <TilesRow />
              <SymbolSelector />
            </div>
          </div>

          {/* Options widgets row */}
          <div id="widgets" className="space-y-4">
            <WidgetsShelf />
          </div>

          <div id="overview" className="bg-black/50 border border-aiiq-light/30 rounded-xl p-6 backdrop-blur-md aura-tile">
            <MarketOverview />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-black/50 border border-aiiq-light/30 rounded-xl p-6 backdrop-blur-md aura-tile">
              <h2 className="text-lg mb-3">Assistant Status</h2>
              <div className="space-y-3">
                {sortedStats.map((assistant) => (
                  <div key={assistant.name} className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-aiiq-light/20">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${assistant.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                      <div>
                        <div className="text-sm font-medium text-white">{assistant.name}</div>
                        <div className="text-xs text-gray-400">{assistant.imageId} • {assistant.size}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">CPU {assistant.cpuUsage}% • RAM {assistant.memoryUsage}GB</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-black/50 border border-aiiq-light/30 rounded-xl p-6 backdrop-blur-md aura-tile">
              <h2 className="text-lg mb-3">System Metrics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 p-4 rounded-lg border border-aiiq-light/20">
                  <div className="text-sm text-gray-400">System Load</div>
                  <div className="text-2xl">32.4%</div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg border border-aiiq-light/20">
                  <div className="text-sm text-gray-400">Response Time</div>
                  <div className="text-2xl">1.7s</div>
                </div>
              </div>
            </div>
          </div>

          {/* Options chain (live if orchestrator WS available; otherwise placeholder) */}
          <OptionsChain symbol={selectedSymbol} />

          {/* TradingView-like strategy sandbox (placeholder data) */}
          <div id="strategies"><StrategyPlayground /></div>
        </div>
      </div>
    </div>
  )
}



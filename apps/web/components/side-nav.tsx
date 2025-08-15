'use client'

import React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  LineChart,
  BarChart3,
  CandlestickChart,
  Wallet,
  Briefcase,
  Shield,
  Settings,
  Bot,
  BookOpen,
  FileText,
  Gauge,
  TrendingUp,
  PieChart,
  Zap,
  Target,
  Car,
  Cpu,
} from 'lucide-react'

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  isSpecial?: boolean
}

// ... existing code ...

const items: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Overview', href: '/overview', icon: Gauge },
  { label: 'Watchlist', href: '/watchlist', icon: LineChart },
  { label: 'Positions', href: '/positions', icon: Briefcase },
  { label: 'Widgets', href: '/widgets', icon: PieChart },
  { label: 'Wallet', href: '/wallet', icon: Wallet },
  { label: 'Assistants', href: '/assistants', icon: Bot },
  { label: 'JBot Ferrari Dashboard', href: '/ferrari', icon: Car, isSpecial: true },
  { label: 'Strategy Builder', href: '/assistants/strategy-builder', icon: Target },
  { label: 'GPU Data Collection', href: '/gpu-data', icon: Cpu, badge: 'LIVE' },
  { label: 'Reports', href: '/reports', icon: FileText },
  { label: 'Docs', href: '/docs', icon: BookOpen },
  { label: 'Risk', href: '/risk', icon: Shield },
  { label: 'Settings', href: '/settings', icon: Settings },
  // New pAIt Rating System
  { label: 'pAIt Ratings', href: '/pait-ratings', icon: TrendingUp, badge: 'NEW' },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 w-24 md:w-72 border-r border-aiiq-light/30 bg-aiiq-darker/95 backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 flex items-center justify-center md:justify-start gap-3 border-b border-aiiq-light/30 bg-gradient-to-r from-aiiq-darker to-aiiq-dark">
          <img src="/images/IconOnly_transp.png" alt="AiiQ" className="h-8 w-8" />
          <span className="hidden md:inline text-base font-aiiq-display aiiq-gradient-text">AiiQ VIP Suite</span>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {items.map((item) => {
            const isActive = pathname === item.href
            const isSpecial = item.isSpecial
            
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-aiiq-rose/20 to-aiiq-cyber/20 border border-aiiq-rose/40 shadow-lg shadow-aiiq-rose/10'
                    : 'text-gray-300 hover:text-white hover:bg-aiiq-light/20 border border-transparent hover:border-aiiq-light/30'
                } ${
                  isSpecial 
                    ? 'bg-gradient-to-r from-aiiq-rose/10 to-aiiq-gold/10 border-aiiq-rose/30 hover:border-aiiq-gold/40' 
                    : ''
                }`}
              >
                <item.icon className={`h-4 w-4 ${
                  isActive ? 'text-aiiq-rose' : isSpecial ? 'text-aiiq-gold' : 'text-gray-400 group-hover:text-white'
                }`} />
                <span className="hidden md:inline font-medium">{item.label}</span>
                {item.badge && (
                  <span className="hidden md:inline ml-auto px-2 py-1 text-xs bg-aiiq-rose/20 text-aiiq-rose rounded-full">
                    {item.badge}
                  </span>
                )}
                {isSpecial && (
                  <span className="hidden md:inline ml-auto px-2 py-1 text-xs bg-gradient-to-r from-aiiq-rose/20 to-aiiq-gold/20 text-aiiq-gold rounded-full border border-aiiq-gold/30">
                    VIP
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        
        {/* Service Status Footer */}
        <ServiceStatusFooter />
      </div>
    </aside>
  )
}

export default SideNav

function StatusDot({ ok }: { ok: boolean | null }) {
  const color = ok === null ? 'bg-gray-500' : ok ? 'bg-green-500' : 'bg-red-500'
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />
}

function BotStatusDot({ ok, botName }: { ok: boolean | null; botName: string }) {
  const [collectionCount, setCollectionCount] = React.useState(0)
  const [lastCollection, setLastCollection] = React.useState<string>('')
  
  // Get real-time bot status from API
  React.useEffect(() => {
    async function fetchBotStatus() {
      try {
        const response = await fetch('/api/bot-status')
        const data = await response.json()
        
        if (data.bots && data.bots[botName]) {
          const bot = data.bots[botName]
          setCollectionCount(bot.collections || 0)
          setLastCollection(bot.lastCollection || '')
        }
      } catch (error) {
        console.error('Failed to fetch bot status:', error)
      }
    }
    
    fetchBotStatus()
    const interval = setInterval(fetchBotStatus, 10000) // Update every 10 seconds
    
    return () => clearInterval(interval)
  }, [botName])
  
  const color = ok === null ? 'bg-gray-500' : ok ? 'bg-green-500' : 'bg-red-500'
  const tooltip = `${botName}\nStatus: ${ok === null ? 'Unknown' : ok ? 'Active' : 'Down'}\nCollections: ${collectionCount}\nLast: ${lastCollection || 'Never'}`
  
  return (
    <div className="flex items-center gap-1">
      <span 
        className={`inline-block h-2.5 w-2.5 rounded-full ${color} cursor-help`} 
        title={tooltip}
      />
      {collectionCount > 0 && (
        <span className="text-[8px] text-gray-500 bg-gray-800 px-1 py-0.5 rounded">
          {collectionCount}
        </span>
      )}
    </div>
  )
}

function useServiceHealth(url: string) {
  const [ok, setOk] = React.useState<boolean | null>(null)
  React.useEffect(() => {
    let mounted = true
    async function ping() {
      try {
        const res = await fetch(url, { cache: 'no-store', mode: 'cors' })
        if (!mounted) return
        setOk(res.ok)
      } catch {
        if (mounted) setOk(false)
      }
    }
    ping()
    const id = setInterval(ping, 5000)
    return () => { mounted = false; clearInterval(id) }
  }, [url])
  return ok
}

function ServiceStatusFooter() {
  const orchOk = useServiceHealth('http://localhost:8080/health')
  const stratOk = useServiceHealth('http://localhost:8788/health')
  const webOk = true
  
  // GPU Data Collection Status
  const [gpuStatus, setGpuStatus] = React.useState({
    status: null as boolean | null,
    lastCollection: '',
    dataCount: 0,
    models: [] as string[],
    collectionTime: ''
  })
  
  // Fetch GPU status from your GPU server
  React.useEffect(() => {
    async function fetchGPUStatus() {
      try {
        const response = await fetch('http://146.190.188.208:8080/latest_collection')
        const data = await response.json()
        
        setGpuStatus({
          status: true, // If we get data, server is up
          lastCollection: data.collected_at || '',
          dataCount: Object.keys(data).length - 3, // Exclude metadata fields
          models: data.gpu_models_used || [],
          collectionTime: data.collected_at ? new Date(data.collected_at).toLocaleTimeString() : ''
        })
      } catch (error) {
        setGpuStatus({
          status: false,
          lastCollection: '',
          dataCount: 0,
          models: [],
          collectionTime: ''
        })
      }
    }
    
    fetchGPUStatus()
    const interval = setInterval(fetchGPUStatus, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  // Ollama Bot Status - Use our API endpoint instead of direct Ollama calls
  const [botStatus, setBotStatus] = React.useState({
    mixtral: null,
    'deepseek-r1:8b': null,
    'deepseek-coder:6.7b': null,
    assetClassPerformance: {
      super_influencers: { rate: 0 },
      options_strategies: { rate: 0 },
      forex_strategies: { rate: 0 },
      crypto_strategies: { rate: 0 }
    }
  })
  
  // Fetch bot status from our API
  React.useEffect(() => {
    async function fetchBotStatus() {
      try {
        const response = await fetch('/api/bot-status')
        const data = await response.json()
        
        if (data.bots) {
          setBotStatus({
            mixtral: data.bots.mixtral?.status === 'active',
            'deepseek-r1:8b': data.bots['deepseek-r1:8b']?.status === 'active',
            'deepseek-coder:6.7b': data.bots['deepseek-coder:6.7b']?.status === 'active',
            assetClassPerformance: data.assetClassPerformance || {
              super_influencers: { rate: 0 },
              options_strategies: { rate: 0 },
              forex_strategies: { rate: 0 },
              crypto_strategies: { rate: 0 }
            }
          })
        }
      } catch (error) {
        console.error('Failed to fetch bot status:', error)
      }
    }
    
    fetchBotStatus()
    const interval = setInterval(fetchBotStatus, 10000) // Update every 10 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  const mixtralOk = botStatus.mixtral
  const deepseekR1Ok = botStatus['deepseek-r1:8b']
  const deepseekCoderOk = botStatus['deepseek-coder:6.7b']
  
  return (
    <div className="border-t border-aiiq-light/30 px-3 py-3 text-[11px] text-gray-400 bg-gradient-to-t from-aiiq-darker to-transparent">
      {/* Core Services */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">Web</span>
        <StatusDot ok={webOk} />
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">Orchestrator</span>
        <StatusDot ok={orchOk} />
      </div>
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-1 font-medium">
          Strategy Engine
          <CopyCmdTooltip cmd={`..\\..\\.venv\\Scripts\\python.exe -m uvicorn --app-dir D:\\Gringots001\\AiiQ_vault001\\AiiQ-tAIq\\services\\ollama-strategy-engine main:app --host 0.0.0.0 --port 8787 --reload`} />
        </span>
        <StatusDot ok={stratOk} />
      </div>
      
      {/* GPU Data Collection Status */}
      <div className="border-t border-aiiq-light/20 pt-2 mb-2">
        <div className="text-[10px] text-gray-500 mb-2 font-medium">GPU DATA COLLECTION</div>
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-[10px]">GPU Server</span>
          <div className="flex items-center gap-1">
            <StatusDot ok={gpuStatus.status} />
            {gpuStatus.status && (
              <span className="text-[8px] text-green-400 bg-green-900/20 px-1 py-0.5 rounded">
                LIVE
              </span>
            )}
          </div>
        </div>
        {gpuStatus.status && (
          <>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-gray-500">Data Points</span>
              <span className="text-[8px] text-aiiq-cyber font-medium">{gpuStatus.dataCount}</span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-gray-500">Last Update</span>
              <span className="text-[8px] text-aiiq-cyber font-medium">{gpuStatus.collectionTime}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] text-gray-500">Models Active</span>
              <span className="text-[8px] text-aiiq-cyber font-medium">{gpuStatus.models.length}</span>
            </div>
          </>
        )}
      </div>
      
      {/* Ollama Bot Status */}
      <div className="border-t border-aiiq-light/20 pt-2 mb-2">
        <div className="text-[10px] text-gray-500 mb-2 font-medium">OLLAMA BOTS</div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-[10px]">Mixtral</span>
            <BotStatusDot ok={mixtralOk} botName="mixtral" />
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-[10px]">DeepSeek-R1</span>
            <BotStatusDot ok={deepseekR1Ok} botName="deepseek-r1:8b" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-[10px]">DeepSeek-Coder</span>
            <BotStatusDot ok={deepseekCoderOk} botName="deepseek-coder:6.7b" />
          </div>
          
          {/* Asset Class Performance */}
          <div className="border-t border-aiiq-light/10 pt-2">
            <div className="text-[9px] text-gray-500 mb-1 font-medium">ASSET CLASS EFFICIENCY</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[8px]">
                <span>Super Influencers</span>
                <span className="text-aiiq-cyber">{botStatus.assetClassPerformance?.super_influencers?.rate || 0}%</span>
              </div>
              <div className="flex items-center justify-between text-[8px]">
                <span>Options</span>
                <span className="text-aiiq-cyber">{botStatus.assetClassPerformance?.options_strategies?.rate || 0}%</span>
              </div>
              <div className="flex items-center justify-between text-[8px]">
                <span>Forex</span>
                <span className="text-aiiq-cyber">{botStatus.assetClassPerformance?.forex_strategies?.rate || 0}%</span>
              </div>
              <div className="flex items-center justify-between text-[8px]">
                <span>Crypto</span>
                <span className="text-aiiq-cyber">{botStatus.assetClassPerformance?.crypto_strategies?.rate || 0}%</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

function CopyCmdTooltip({ cmd }: { cmd: string }) {
  const [copied, setCopied] = React.useState(false)
  const title = `Restart (PowerShell):\n${cmd}`
  return (
    <button
      type="button"
      title={title}
      onClick={async () => {
        try { await navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch {}
      }}
      className="text-xs px-1 py-0.5 border border-aiiq-light/40 rounded hover:bg-aiiq-light/30 text-gray-300 hover:text-white transition-colors"
    >
      {copied ? 'Copied' : 'cmd'}
    </button>
  )
}



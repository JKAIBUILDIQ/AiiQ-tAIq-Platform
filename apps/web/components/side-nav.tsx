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
} from 'lucide-react'

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const items: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Overview', href: '/', icon: Gauge },
  { label: 'Watchlist', href: '/watchlist', icon: LineChart },
  { label: 'Positions', href: '/positions', icon: Briefcase },
  { label: 'Greeks', href: '/greeks', icon: BarChart3 },
  { label: 'Flow', href: '/flow', icon: CandlestickChart },
  { label: 'Widgets', href: '/widgets', icon: LineChart },
  { label: 'Wallet', href: '/wallet', icon: Wallet },
  { label: 'Assistants', href: '/assistants', icon: Bot },
  { label: 'Strategy Builder', href: '/assistants/strategy-builder', icon: Bot },
  { label: 'Reports', href: '/reports', icon: FileText },
  { label: 'Docs', href: '/docs', icon: BookOpen },
  { label: 'Risk', href: '/risk', icon: Shield },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Ferrari', href: '/ferrari', icon: LayoutDashboard },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 w-24 md:w-72 border-r border-aiiq-light/30 bg-aiiq-darker/85 backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 flex items-center justify-center md:justify-start gap-3 border-b border-aiiq-light/30">
          <img src="/images/IconOnly_transp.png" alt="AiiQ" className="h-8 w-8" />
          <span className="hidden md:inline text-base font-aiiq-display aiiq-gradient-text">AiiQ VIP Suite</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {items.map((it) => {
            const handleClick: React.MouseEventHandler<HTMLAnchorElement> = () => {}
            return (
              <Link
                key={it.label}
                href={it.href}
                onClick={handleClick}
                className="group flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-aiiq-light/60 border border-transparent hover:border-aiiq-light/40 transition-colors"
              >
                <it.icon className="h-4 w-4" />
                <span className="hidden md:inline">{it.label}</span>
              </Link>
            )
          })}
        </nav>
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
  const stratOk = useServiceHealth('http://localhost:8787/health')
  const webOk = true
  return (
    <div className="border-t border-aiiq-light/30 px-3 py-2 text-[11px] text-gray-400">
      <div className="flex items-center justify-between mb-1">
        <span>Web</span>
        <StatusDot ok={webOk} />
      </div>
      <div className="flex items-center justify-between mb-1">
        <span>Orchestrator</span>
        <StatusDot ok={orchOk} />
      </div>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1">
          Strategy Engine
          <CopyCmdTooltip cmd={`..\\..\\.venv\\Scripts\\python.exe -m uvicorn --app-dir D:\\Gringots001\\AiiQ_vault001\\AiiQ-tAIq\\services\\ollama-strategy-engine main:app --host 0.0.0.0 --port 8787 --reload`} />
        </span>
        <StatusDot ok={stratOk} />
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
      className="text-xs px-1 py-0.5 border border-aiiq-light/40 rounded hover:bg-aiiq-light/30 text-gray-300 hover:text-white"
    >
      {copied ? 'Copied' : 'cmd'}
    </button>
  )
}



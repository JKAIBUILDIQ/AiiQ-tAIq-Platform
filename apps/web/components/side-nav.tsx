'use client'

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
  { label: 'Overview', href: '#overview', icon: Gauge },
  { label: 'Watchlist', href: '#watchlist', icon: LineChart },
  { label: 'Positions', href: '#positions', icon: Briefcase },
  { label: 'Greeks', href: '#greeks', icon: BarChart3 },
  { label: 'Flow', href: '#flow', icon: CandlestickChart },
  { label: 'Widgets', href: '#widgets', icon: LineChart },
  { label: 'Wallet', href: '#wallet', icon: Wallet },
  { label: 'Assistants', href: '#assistants', icon: Bot },
  { label: 'Reports', href: '#reports', icon: FileText },
  { label: 'Docs', href: '#docs', icon: BookOpen },
  { label: 'Risk', href: '#risk', icon: Shield },
  { label: 'Settings', href: '#settings', icon: Settings },
  { label: 'Ferrari', href: '/ferrari', icon: LayoutDashboard },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-3 top-3 bottom-3 z-50 w-18 md:w-60 rounded-2xl border border-aiiq-light/30 bg-aiiq-dark/60 backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="p-3 flex items-center justify-center md:justify-start gap-3 border-b border-aiiq-light/30">
          <img src="/Logo_rose.svg" alt="AiiQ" className="h-8 w-8" />
          <span className="hidden md:inline text-sm font-aiiq-display aiiq-gradient-text">AiiQ VIP Suite</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {items.map((it) => (
            <Link key={it.label} href={it.href} className="group flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-aiiq-light/60 border border-transparent hover:border-aiiq-light/40 transition-colors">
              <it.icon className="h-4 w-4" />
              <span className="hidden md:inline">{it.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default SideNav



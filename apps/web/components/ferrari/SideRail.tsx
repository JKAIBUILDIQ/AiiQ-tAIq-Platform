'use client'

import Link from 'next/link'
import {
  LayoutDashboard,
  Gauge,
  LineChart,
  Briefcase,
  BarChart3,
  CandlestickChart,
  Wallet,
  Bot,
  FileText,
  BookOpen,
  Shield,
  Settings,
} from 'lucide-react'

const links = [
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
]

export default function SideRail() {
  return (
    <aside className="w-60 bg-black/40 backdrop-blur-xl border-r border-aiiq-light/30 p-3 space-y-2 rounded-l-2xl">
      {links.map((l) => (
        <Link key={l.label} href={l.href} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-aiiq-light/40 hover:text-white">
          <l.icon className="h-4 w-4" />
          <span>{l.label}</span>
        </Link>
      ))}
      <Link href="/ferrari" className="mt-4 block px-3 py-2 rounded-lg text-sm bg-aiiq-rose/20 text-aiiq-rose hover:bg-aiiq-rose/30">Ferrari View</Link>
    </aside>
  )
}



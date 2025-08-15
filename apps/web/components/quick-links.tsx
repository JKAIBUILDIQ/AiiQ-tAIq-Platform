'use client'

import Link from 'next/link'
import { Github, BarChart3, LineChart, Wallet, Newspaper, LayoutDashboard, Cpu } from 'lucide-react'

type QuickLink = {
  label: string
  href: string
  icon: (props: { className?: string }) => JSX.Element
}

const links: QuickLink[] = [
  { label: 'Dashboard', href: '/', icon: (p) => <LayoutDashboard {...p} /> },
  { label: 'Charts', href: '/chart/BTC', icon: (p) => <LineChart {...p} /> },
  { label: 'Portfolio', href: '/portfolio', icon: (p) => <BarChart3 {...p} /> },
  { label: 'Strategy', href: '/builder', icon: (p) => <BarChart3 {...p} /> },
  { label: 'GPU Data', href: '/gpu-data', icon: (p) => <Cpu {...p} /> },
  { label: 'Risk', href: '/risk', icon: (p) => <LineChart {...p} /> },
  { label: 'News', href: '#', icon: (p) => <Newspaper {...p} /> },
  { label: 'GitHub', href: 'https://github.com', icon: (p) => <Github {...p} /> },
  { label: 'Wallet', href: '#', icon: (p) => <Wallet {...p} /> },
]

export function QuickLinks() {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex gap-4 md:gap-6 px-2 py-2 rounded-2xl bg-aiiq-dark/40 backdrop-blur-xl border border-aiiq-light/30 shadow-lg">
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="group flex flex-col items-center justify-center w-20 select-none"
          >
            <div className="aiiq-glow-tile">
              <l.icon className="h-5 w-5" />
            </div>
            <span className="mt-2 text-xs text-white/90">{l.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}



'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletConnect } from './wallet-connect'
import { cn } from '@/lib/utils'
import { 
  BarChart3, 
  PieChart, 
  Settings, 
  TrendingUp,
  Zap,
  Shield
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Charts', href: '/chart/BTC', icon: TrendingUp },
  { name: 'Portfolio', href: '/portfolio', icon: PieChart },
  { name: 'Strategy Builder', href: '/builder', icon: Zap },
  { name: 'Risk Management', href: '/risk', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-aiiq-darker border-b border-aiiq-light sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/Logo_rose.svg" 
                alt="AiiQ Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-aiiq-display font-bold aiq-gradient-text">
                AiiQ_tAIq
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-aiiq-rose text-white'
                      : 'text-gray-300 hover:text-white hover:bg-aiiq-light'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Wallet Connect */}
          <div className="flex items-center space-x-4">
            <WalletConnect />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-aiiq-light">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-aiiq-rose text-white'
                    : 'text-gray-300 hover:text-white hover:bg-aiiq-light'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Footer } from '@/components/footer'
import SideNav from '@/components/side-nav'
import { GlobalTradingHeader } from '@/components/global-trading-header'

export const metadata: Metadata = {
  title: 'AiiQ_tAIq - Options Trading Platform',
  description: 'Professional options and crypto trading platform with real-time charts, Greeks, and strategy builder',
  keywords: 'options trading, crypto, derivatives, Greeks, IV surface, Solana, Deribit',
  icons: {
    icon: '/images/IconOnly_transp.png',
    apple: '/images/IconOnly_transp.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-aiiq-dark text-white min-h-screen font-aiiq">
        <Providers>
          <SideNav />
          <div className="h-screen overflow-hidden">
            <main id="app-scroll" data-scroll="app" className="h-full overflow-y-auto pl-24 md:pl-72 pr-3 pt-3 pb-3">
              <div className="min-h-full flex flex-col">
                <GlobalTradingHeader />
                {children}
                <Footer />
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'AiiQ_tAIq - Options Trading Platform',
  description: 'Professional options and crypto trading platform with real-time charts, Greeks, and strategy builder',
  keywords: 'options trading, crypto, derivatives, Greeks, IV surface, Solana, Deribit',
  icons: {
    icon: '/Logo_rose.svg',
    apple: '/Logo_rose.svg',
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
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}

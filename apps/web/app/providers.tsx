'use client'

import { ReactNode } from 'react'
import { WalletProvider } from '@/components/wallet-provider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WalletProvider>
      {children}
    </WalletProvider>
  )
}

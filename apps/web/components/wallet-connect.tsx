'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { WalletIcon } from 'lucide-react'

export function WalletConnect() {
  const { connected, wallet } = useWallet()

  if (connected) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-aiiq-light px-3 py-2 rounded-lg border border-aiiq-lighter">
          <WalletIcon className="h-4 w-4 text-aiiq-cyber" />
          <span className="text-sm text-white">
            {wallet?.adapter.name || 'Connected'}
          </span>
        </div>
        <WalletMultiButton className="aiq-button-secondary text-sm px-3 py-1" />
      </div>
    )
  }

  return (
    <WalletMultiButton className="aiq-button-primary text-sm px-4 py-2" />
  )
}

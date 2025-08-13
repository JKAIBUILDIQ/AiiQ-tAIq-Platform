'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Zap, Shield, BarChart3 } from 'lucide-react'
import { ReactNode } from 'react'
import { QuickLinks } from './quick-links'
import { useUIStore } from '@/lib/ui-store'

interface DashboardHeroProps {
  children?: ReactNode
}

export function DashboardHero({ children }: DashboardHeroProps) {
  const { toggleShelf, toggleGreeks, toggleFlow } = useUIStore()
  return (
    <div className="relative overflow-hidden bg-aiiq-darker/80 rounded-2xl mx-4 mt-6 border border-aiiq-light/30 backdrop-blur-md min-h-[85vh]" onMouseMove={(e) => {
      const el = e.currentTarget
      const rect = el.getBoundingClientRect()
      const dx = (e.clientX - rect.left) / rect.width - 0.5
      const dy = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transform = `perspective(1000px) rotateY(${dx * 2}deg) rotateX(${ -dy * 2}deg)`
    }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-cyber-grid opacity-5"></div>
      
      {/* VIP Executive Suite Background */}
      {/* Background image layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/vip_exec.svg" 
          alt="VIP Executive Suite" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Readability overlays above image, below content */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/35 via-black/15 to-black/5" />
      <div className="aiiq-stars z-10" />

      {/* Foreground content */}
      <div className="relative z-20 container mx-auto px-8 pt-10 pb-16 max-w-[1600px] flex flex-col gap-10 h-full">
        <div className="text-center space-y-8 w-full">
          {/* Main Logo and Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="flex justify-center">
              <img 
                src="/images/IconOnly_transp.png" 
                alt="AiiQ Logo" 
                className="h-20 w-20 aiiq-pulse"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-aiiq-display font-bold">
              <span className="aiiq-gradient-text">AiiQ_tAIq</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Trading Quant Wrapped Around AI — Professional Options & Crypto Trading Platform
            </p>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-aiiq-rose/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-aiiq-rose" />
              </div>
              <h3 className="font-semibold text-white">Real-Time Charts</h3>
              <p className="text-sm text-gray-400">Live OHLCV & Indicators</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-aiiq-cyber/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-aiiq-cyber" />
              </div>
              <h3 className="font-semibold text-white">Options Chain</h3>
              <p className="text-sm text-gray-400">Greeks & IV Surface</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-aiiq-gold/20 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-aiiq-gold" />
              </div>
              <h3 className="font-semibold text-white">Strategy Builder</h3>
              <p className="text-sm text-gray-400">Spreads & Iron Condors</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-aiiq-success/20 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-aiiq-success" />
              </div>
              <h3 className="font-semibold text-white">Risk Management</h3>
              <p className="text-sm text-gray-400">Portfolio & Limits</p>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="aiiq-button-primary text-lg px-8 py-3">
                Start Trading
              </button>
              <button className="aiiq-button-secondary text-lg px-8 py-3">
                View Demo
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Connect your Solana wallet to access the full platform
            </p>
          </motion.div>
        </div>

        {/* Edge-style horizontal quick links */}
        <QuickLinks />

        {/* Overlay dashboard content inside hero boundaries */}
        {children ? (
          <div className="absolute inset-x-6 md:inset-x-10 bottom-8 z-20">
            {children}
          </div>
        ) : null}
      </div>

      {/* Bottom Border with AiiQ Colors */}
      <div className="h-1 bg-gradient-to-r from-aiiq-rose via-aiiq-cyber to-aiiq-gold"></div>

      {/* Bottom floating dock with quick actions / widgets placeholders */}
      <div className="aiiq-dock">
        <button className="aiiq-button-secondary text-sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Top</button>
        <button className="aiiq-button-secondary text-sm" onClick={toggleShelf}>Toggle Shelf</button>
        <button className="aiiq-button-secondary text-sm" onClick={toggleGreeks}>Toggle Greeks</button>
        <button className="aiiq-button-secondary text-sm" onClick={toggleFlow}>Toggle Flow</button>
        <button className="aiiq-button-secondary text-sm" onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>Overview</button>
        <button className="aiiq-button-secondary text-sm" onClick={() => document.getElementById('watchlist')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>Watchlist</button>
        <button className="aiiq-button-secondary text-sm" onClick={() => document.getElementById('positions')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>Positions</button>
      </div>
    </div>
  )
}

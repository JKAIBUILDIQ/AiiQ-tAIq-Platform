'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Zap, Shield, BarChart3 } from 'lucide-react'

export function DashboardHero() {
  return (
    <div className="relative overflow-hidden bg-aiiq-darker">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-cyber-grid opacity-5"></div>
      
      {/* VIP Executive Suite Background */}
      <div className="absolute inset-0">
        <img 
          src="/vip_exec.svg" 
          alt="VIP Executive Suite" 
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Main Logo and Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="flex justify-center">
              <img 
                src="/Logo_rose.svg" 
                alt="AiiQ Logo" 
                className="h-20 w-20 aiq-pulse"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-aiiq-display font-bold">
              <span className="aiq-gradient-text">AiiQ_tAIq</span>
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
              <button className="aiq-button-primary text-lg px-8 py-3">
                Start Trading
              </button>
              <button className="aiq-button-secondary text-lg px-8 py-3">
                View Demo
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Connect your Solana wallet to access the full platform
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom Border with AiiQ Colors */}
      <div className="h-1 aiq-gradient"></div>
    </div>
  )
}

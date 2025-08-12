'use client'

import { ExternalLink, Github, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-aiiq-darker border-t border-aiiq-light mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/Logo_rose.svg" 
                alt="AiiQ Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-aiiq-display font-bold aiq-gradient-text">
                AiiQ_tAIq
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Trading Quant Wrapped Around AI — Professional options and crypto trading platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-aiiq-cyber transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-aiiq-cyber transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-aiiq-cyber transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/chart/BTC" className="text-gray-400 hover:text-aiiq-cyber transition-colors">
                  Trading Charts
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-400 hover:text-aiiq-cyber transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/builder" className="text-gray-400 hover:text-aiiq-cyber transition-colors">
                  Strategy Builder
                </Link>
              </li>
              <li>
                <Link href="/risk" className="text-gray-400 hover:text-aiiq-cyber transition-colors">
                  Risk Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Markets */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Markets</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-aiiq-cyber transition-colors">
                  Bitcoin Options
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-aiiq-cyber transition-colors">
                  Ethereum Options
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-aiiq-cyber transition-colors">
                  Solana Options
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-aiiq-cyber transition-colors">
                  Equity Options
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-aiiq-cyber transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-aiiq-cyber transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-aiiq-cyber transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-aiiq-cyber transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-aiiq-light">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 AiiQ_tAIq. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-aiiq-cyber transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-aiiq-cyber transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-aiiq-cyber transition-colors">
                Risk Disclosure
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

'use client'

import { useEffect, useRef } from 'react'

export default function TickerTape() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500 Index' },
        { proName: 'FOREXCOM:NSXUSD', title: 'US 100 Cash CFD' },
        { proName: 'FX_IDC:EURUSD', title: 'EUR to USD' },
        { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
        { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
      ],
      colorTheme: 'dark',
      locale: 'en',
      isTransparent: true,
      showSymbolLogo: true,
      displayMode: 'adaptive',
    })
    const widget = document.createElement('div')
    widget.className = 'tradingview-widget-container__widget'
    const root = document.createElement('div')
    root.className = 'tradingview-widget-container'
    root.appendChild(widget)
    containerRef.current.appendChild(root)
    containerRef.current.appendChild(script)
    return () => {
      // cleanup
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [])

  return (
    <div className="w-full">
      <div ref={containerRef} />
    </div>
  )
}



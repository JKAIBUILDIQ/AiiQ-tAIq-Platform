'use client'

import { useEffect, useRef } from 'react'

type Props = {
  symbols?: string[]
  symbol?: string
  theme?: 'dark' | 'light'
  height?: number | string
}

export default function TradingViewSymbolOverview({ symbols, symbol, theme = 'dark', height = 360 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const list = symbol ? [symbol] : (symbols && symbols.length ? symbols : ['AAPL'])
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      lineWidth: 2,
      lineType: 0,
      chartType: 'area',
      colorTheme: theme,
      isTransparent: false,
      locale: 'en',
      autosize: true,
      height,
      width: '100%',
      symbols: list.map((s) => [s, `${s}|1D`]),
      dateRanges: ['1d|1', '1m|30', '3m|60', '12m|1D', '60m|1W', 'all|1M'],
    })
    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(script)
  }, [symbols, symbol, theme, height])

  return (
    <div className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget" ref={containerRef} />
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Quotes by TradingView</span></a></div>
    </div>
  )
}



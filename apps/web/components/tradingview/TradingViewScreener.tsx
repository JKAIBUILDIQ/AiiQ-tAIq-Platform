'use client'

import { useEffect, useRef } from 'react'

type ScreenerType = 'crypto_mkt' | 'stock_mkt' | 'forex' | 'futures'

type Props = {
  /** TradingView screener_type */
  screenerType?: ScreenerType
  /** dark or light */
  theme?: 'dark' | 'light'
  /** width/height passed to widget */
  width?: string | number
  height?: string | number
  /** TradingView defaultScreen, e.g. 'most_traded', 'top_gainers' */
  defaultScreen?: string
}

export default function TradingViewScreener({
  screenerType = 'crypto_mkt',
  theme = 'dark',
  width = '100%',
  height = 550,
  defaultScreen,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js'
    script.type = 'text/javascript'
    script.async = true
    const config: Record<string, unknown> = {
      defaultColumn: 'overview',
      screener_type: screenerType,
      displayCurrency: 'USD',
      colorTheme: theme,
      isTransparent: false,
      locale: 'en',
      width,
      height,
    }
    if (defaultScreen) config.defaultScreen = defaultScreen
    script.innerHTML = JSON.stringify(config)

    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(script)
  }, [screenerType, theme, width, height, defaultScreen])

  return (
    <div className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget" ref={containerRef} />
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Powered by TradingView</span>
        </a>
      </div>
    </div>
  )
}



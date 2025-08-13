'use client'

import { useUIStore } from '@/lib/ui-store'

const DEFAULTS = [
  'BTC','ETH','SOL',
  'SPY','QQQ','IWM','VIX',
  'TSLA','NVDA','MSFT','AAPL','AMD','AVGO','META','GOOGL',
  'PANW','CRWD','ZS','FTNT','SNOW','SHOP'
]

export default function SymbolSelector() {
  const symbol = useUIStore((s) => s.selectedSymbol)
  const setSymbol = useUIStore((s) => s.setSymbol)

  return (
    <div className="flex flex-wrap gap-2">
      {DEFAULTS.map((s) => (
        <button
          key={s}
          onClick={() => setSymbol(s)}
          className={`px-3 py-1 rounded-full text-xs border ${symbol===s? 'bg-aiiq-rose/30 border-aiiq-rose text-white':'bg-black/40 border-aiiq-light/30 text-gray-300 hover:bg-aiiq-light/40'}`}
        >{s}</button>
      ))}
    </div>
  )
}



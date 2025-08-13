'use client'

import { useUIStore } from '@/lib/ui-store'

const symbols = [
  'BTC','ETH','SOL',
  'SPY','QQQ','IWM','VIX',
  'TSLA','NVDA','MSFT','AAPL','AMD','AVGO','META','GOOGL',
  'PANW','CRWD','ZS','FTNT','SNOW','SHOP'
]

export default function TopSymbolLinks() {
  const selected = useUIStore((s) => s.selectedSymbol)
  const setSymbol = useUIStore((s) => (s as any).setSymbol ?? (s as any).setSelectedSymbol)

  const handleClick = (sym: string) => {
    if (typeof setSymbol === 'function') setSymbol(sym)
    // Intentionally do not auto-scroll; keep windows locked in place
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-3 min-w-max">
        {symbols.map((sym) => (
          <button
            key={sym}
            onClick={() => handleClick(sym)}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              selected === sym
                ? 'bg-aiiq-rose text-white border-aiiq-rose'
                : 'bg-aiiq-dark/70 text-gray-300 border-aiiq-light/30 hover:bg-aiiq-light/50'
            }`}
          >
            {sym}
          </button>
        ))}
      </div>
    </div>
  )
}



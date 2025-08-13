export type ChainRow = {
  strike: number
  callIV: number
  callBid: number
  callAsk: number
  putBid: number
  putAsk: number
  putIV: number
}

export type ChainSnapshot = {
  symbol: string
  expiry: string
  rows: ChainRow[]
  isLive: boolean
}

const FALLBACK_EXPIRY = '30D'

export function mockChain(symbol: string): ChainSnapshot {
  const base = 50
  const rows: ChainRow[] = Array.from({ length: 16 }, (_, i) => {
    const k = (base + i) * 2
    return {
      strike: 50_000 + k * 100,
      callIV: 0.45 + (Math.sin(i / 3) * 0.05),
      callBid: 900 - i * 14 + Math.random() * 10,
      callAsk: 920 - i * 13 + Math.random() * 10,
      putBid: 880 + i * 12 + Math.random() * 10,
      putAsk: 900 + i * 13 + Math.random() * 10,
      putIV: 0.42 + (Math.cos(i / 4) * 0.05),
    }
  })
  return { symbol, expiry: FALLBACK_EXPIRY, rows, isLive: false }
}

export function connectChainStream(symbol: string, onSnapshot: (s: ChainSnapshot) => void) {
  let ws: WebSocket | null = null
  let timer: number | null = null

  try {
    const base = (typeof window !== 'undefined' && (window as any).__NEXT_PUBLIC_ORCH_WS) || process.env.NEXT_PUBLIC_ORCH_WS || 'ws://127.0.0.1:8080'
    const url = base + `/chain?symbol=${encodeURIComponent(symbol)}`
    ws = new WebSocket(url)
    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data)
        if (data && data.rows) onSnapshot({ ...data, isLive: true })
      } catch {}
    }
    ws.onerror = () => {
      // fall through to mock
      if (!timer) startMock()
    }
    ws.onclose = () => {
      if (!timer) startMock()
    }
  } catch {
    startMock()
  }

  function startMock() {
    const tick = () => {
      const snap = mockChain(symbol)
      onSnapshot(snap)
    }
    tick()
    // @ts-ignore
    timer = setInterval(tick, 1500)
  }

  return () => {
    if (ws) ws.close()
    if (timer) clearInterval(timer as any)
  }
}



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
  let httpTimer: number | null = null

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
      // fall through to HTTP poll, then mock
      if (!httpTimer) startHttpPoll()
    }
    ws.onclose = () => {
      if (!httpTimer) startHttpPoll()
    }
  } catch {
    startHttpPoll()
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

  function startHttpPoll() {
    const httpBase = (typeof window !== 'undefined' && (window as any).__NEXT_PUBLIC_ORCH_HTTP) || process.env.NEXT_PUBLIC_ORCH_HTTP || 'http://127.0.0.1:8080'
    const poll = async () => {
      try {
        const res = await fetch(`${httpBase}/options/chain?underlying=${encodeURIComponent(symbol)}`)
        if (!res.ok) throw new Error('bad status')
        const json = await res.json()
        const chain = Array.isArray(json?.chain) ? json.chain : []
        const rows: ChainRow[] = chain.slice(0, 20).map((q: any) => ({
          strike: Number(q.strike ?? q.k ?? q.K ?? 0),
          callIV: Number(q.call_iv ?? q.callIV ?? q.iv_call ?? q.ivC ?? 0),
          callBid: Number(q.call_bid ?? q.callBid ?? q.bid_call ?? q.bidC ?? 0),
          callAsk: Number(q.call_ask ?? q.callAsk ?? q.ask_call ?? q.askC ?? 0),
          putBid: Number(q.put_bid ?? q.putBid ?? q.bid_put ?? q.bidP ?? 0),
          putAsk: Number(q.put_ask ?? q.putAsk ?? q.ask_put ?? q.askP ?? 0),
          putIV: Number(q.put_iv ?? q.putIV ?? q.iv_put ?? q.ivP ?? 0),
        }))
        onSnapshot({ symbol: json?.underlying ?? symbol, expiry: json?.expiry ?? FALLBACK_EXPIRY, rows, isLive: true })
      } catch {
        if (!timer) startMock()
        clearInterval(httpTimer as any)
        httpTimer = null
      }
    }
    // @ts-ignore
    httpTimer = setInterval(poll, 3000)
    poll()
  }

  return () => {
    if (ws) ws.close()
    if (timer) clearInterval(timer as any)
    if (httpTimer) clearInterval(httpTimer as any)
  }
}



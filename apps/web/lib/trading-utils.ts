export type Candle = { time: number; open: number; high: number; low: number; close: number }

export type EquityPoint = { time: number; value: number }

// Very simple equity curve: buy-and-hold on closes (placeholder for presets)
export function computeEquity(candles: Candle[]): EquityPoint[] {
  if (!candles.length) return []
  const first = candles[0].close
  let equity = 1
  const out: EquityPoint[] = []
  for (let i = 0; i < candles.length; i++) {
    const ret = i === 0 ? 0 : (candles[i].close - candles[i - 1].close) / candles[i - 1].close
    equity *= 1 + ret
    out.push({ time: candles[i].time, value: equity })
  }
  return out
}

export function computeStats(candles: Candle[], equity: EquityPoint[]) {
  if (!candles.length || !equity.length) return { pnlPct: 0, sharpe: 0, winRate: 0, maxDD: 0 }
  const rets: number[] = []
  for (let i = 1; i < candles.length; i++) {
    const r = (candles[i].close - candles[i - 1].close) / candles[i - 1].close
    rets.push(r)
  }
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length
  const std = Math.sqrt(rets.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / Math.max(1, rets.length - 1))
  const sharpe = std > 0 ? (mean / std) * Math.sqrt(252) : 0
  const winRate = rets.filter((r) => r > 0).length / rets.length
  const pnlPct = (equity[equity.length - 1].value - 1) * 100
  // Max drawdown
  let peak = equity[0].value
  let maxDD = 0
  for (const p of equity) {
    if (p.value > peak) peak = p.value
    const dd = peak > 0 ? (peak - p.value) / peak : 0
    if (dd > maxDD) maxDD = dd
  }
  return { pnlPct, sharpe, winRate, maxDD: maxDD * 100 }
}

function sma(values: number[], period: number): number[] {
  const out: number[] = []
  let sum = 0
  for (let i = 0; i < values.length; i++) {
    sum += values[i]
    if (i >= period) sum -= values[i - period]
    out.push(i >= period - 1 ? sum / period : NaN)
  }
  return out
}

function rsi(values: number[], period = 14): number[] {
  const out: number[] = []
  let avgGain = 0
  let avgLoss = 0
  for (let i = 1; i < values.length; i++) {
    const change = values[i] - values[i - 1]
    const gain = Math.max(0, change)
    const loss = Math.max(0, -change)
    if (i <= period) {
      avgGain += gain
      avgLoss += loss
      out.push(NaN)
      if (i === period) {
        avgGain /= period
        avgLoss /= period
        const rs = avgLoss === 0 ? 100 : avgGain / (avgLoss || 1e-12)
        out[i - 1] = 100 - 100 / (1 + rs)
      }
      continue
    }
    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
    const rs = avgLoss === 0 ? 100 : avgGain / (avgLoss || 1e-12)
    out.push(100 - 100 / (1 + rs))
  }
  out.unshift(NaN) // align length to values
  return out
}

export type StrategyKind = 'SMA Cross' | 'Breakout' | 'RSI Mean Reversion'

export function computeStrategyEquity(candles: Candle[], kind: StrategyKind): EquityPoint[] {
  if (candles.length === 0) return []
  const closes = candles.map((c) => c.close)
  let inPos = false
  let equity = 1
  const out: EquityPoint[] = []
  const push = (i: number) => out.push({ time: candles[i].time, value: equity })

  if (kind === 'SMA Cross') {
    const fast = sma(closes, 20)
    const slow = sma(closes, 50)
    for (let i = 1; i < candles.length; i++) {
      const enter = !inPos && fast[i] > slow[i] && !isNaN(fast[i]) && !isNaN(slow[i])
      const exit = inPos && fast[i] < slow[i]
      if (enter) inPos = true
      if (exit) inPos = false
      const ret = (closes[i] - closes[i - 1]) / closes[i - 1]
      if (inPos) equity *= 1 + ret
      push(i)
    }
  } else if (kind === 'RSI Mean Reversion') {
    const r = rsi(closes, 14)
    for (let i = 1; i < candles.length; i++) {
      const enter = !inPos && r[i] < 30
      const exit = inPos && r[i] > 55
      if (enter) inPos = true
      if (exit) inPos = false
      const ret = (closes[i] - closes[i - 1]) / closes[i - 1]
      if (inPos) equity *= 1 + ret
      push(i)
    }
  } else if (kind === 'Breakout') {
    const lookback = 20
    for (let i = 1; i < candles.length; i++) {
      const start = Math.max(0, i - lookback)
      const windowHigh = Math.max(...closes.slice(start, i))
      const windowLow = Math.min(...closes.slice(start, i))
      const enter = !inPos && closes[i] > windowHigh
      const exit = inPos && closes[i] < windowLow
      if (enter) inPos = true
      if (exit) inPos = false
      const ret = (closes[i] - closes[i - 1]) / closes[i - 1]
      if (inPos) equity *= 1 + ret
      push(i)
    }
  }
  if (out.length === 0) return computeEquity(candles)
  return out
}




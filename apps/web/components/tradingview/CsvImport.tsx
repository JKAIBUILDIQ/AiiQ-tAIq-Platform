'use client'

import { useRef } from 'react'

export type Candle = { time: number; open: number; high: number; low: number; close: number }

export default function CsvImport({ onLoad }: { onLoad: (rows: Candle[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handle = async (file: File) => {
    const text = await file.text()
    // Expect headers: time,open,high,low,close (unix sec or ISO)
    const lines = text.split(/\r?\n/).filter(Boolean)
    const hdr = lines[0].toLowerCase()
    const rows: Candle[] = []
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',')
      if (parts.length < 5) continue
      const [t, o, h, l, c] = parts
      const time = /\D/.test(t) ? Math.floor(new Date(t).getTime() / 1000) : Number(t)
      rows.push({ time, open: Number(o), high: Number(h), low: Number(l), close: Number(c) })
    }
    onLoad(rows)
  }

  return (
    <div className="flex items-center gap-2">
      <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={(e)=>{ const f=e.target.files?.[0]; if (f) handle(f) }} />
      <button className="px-3 py-1 rounded-lg text-sm bg-black/40 border border-aiiq-light/30 hover:bg-aiiq-light/40" onClick={()=>inputRef.current?.click()}>
        Import CSV
      </button>
    </div>
  )
}





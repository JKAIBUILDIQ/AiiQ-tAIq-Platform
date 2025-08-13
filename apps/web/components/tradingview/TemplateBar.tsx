'use client'

import { StrategyControls } from './StrategyControlsDrawer'

export default function TemplateBar({ controls, onLoad }: { controls: StrategyControls; onLoad: (c: StrategyControls) => void }) {
  const save = () => {
    const key = 'aiiq_strategy_templates'
    const list: StrategyControls[] = JSON.parse(localStorage.getItem(key) || '[]')
    list.unshift(controls)
    localStorage.setItem(key, JSON.stringify(list.slice(0, 20)))
    const url = new URL(window.location.href)
    url.searchParams.set('tpl', btoa(encodeURIComponent(JSON.stringify(controls))))
    history.replaceState(null, '', url.toString())
  }
  const load = () => {
    const key = 'aiiq_strategy_templates'
    const list: StrategyControls[] = JSON.parse(localStorage.getItem(key) || '[]')
    if (list[0]) onLoad(list[0])
  }
  const loadFromUrl = () => {
    const q = new URLSearchParams(window.location.search)
    const raw = q.get('tpl')
    if (!raw) return
    try { onLoad(JSON.parse(decodeURIComponent(atob(raw)))) } catch {}
  }
  return (
    <div className="flex items-center gap-2 text-xs">
      <button className="px-3 py-1 rounded-lg bg-black/40 border border-aiiq-light/30 hover:bg-aiiq-light/40" onClick={save}>Save</button>
      <button className="px-3 py-1 rounded-lg bg-black/40 border border-aiiq-light/30 hover:bg-aiiq-light/40" onClick={load}>Load</button>
      <button className="px-3 py-1 rounded-lg bg-black/40 border border-aiiq-light/30 hover:bg-aiiq-light/40" onClick={loadFromUrl}>Load from URL</button>
    </div>
  )
}



'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

export function SearchBar() {
  const [q, setQ] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const url = `https://www.bing.com/search?q=${encodeURIComponent(q)}`
    window.open(url, '_blank')
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-2xl relative"
      role="search"
      aria-label="Search the web"
    >
      <div className="flex items-center rounded-full bg-white/95 text-aiiq-dark shadow-xl ring-1 ring-black/5 focus-within:ring-aiiq-cyber">
        <span className="pl-4 text-gray-500">
          <Search className="h-5 w-5" />
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the web"
          className="w-full bg-transparent px-3 py-3 outline-none placeholder:text-gray-500"
        />
        <button
          type="submit"
          className="mr-2 rounded-full bg-aiiq-cyber px-4 py-2 text-sm font-semibold text-aiiq-dark hover:bg-teal-300 transition"
        >
          Search
        </button>
      </div>
    </form>
  )
}





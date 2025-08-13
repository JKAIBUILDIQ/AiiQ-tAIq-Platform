'use client'

import { create } from 'zustand'

type UIState = {
  showShelf: boolean
  showGreeks: boolean
  showFlow: boolean
  selectedSymbol: string
  toggleShelf: () => void
  toggleGreeks: () => void
  toggleFlow: () => void
  setSymbol: (s: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  showShelf: true,
  showGreeks: true,
  showFlow: true,
  selectedSymbol: 'BTC',
  toggleShelf: () => set((s) => ({ showShelf: !s.showShelf })),
  toggleGreeks: () => set((s) => ({ showGreeks: !s.showGreeks })),
  toggleFlow: () => set((s) => ({ showFlow: !s.showFlow })),
  setSymbol: (s) => set(() => ({ selectedSymbol: s })),
}))



import { create } from 'zustand'

export interface GameState {
  hp: number
  maxHp: number
  ammo: number
  maxAmmo: number
  kills: number
  zoneRadius: number
  zoneMinRadius: number
  isGameOver: boolean
  setHp: (hp: number) => void
  setAmmo: (ammo: number) => void
  addKill: () => void
  updateZone: (delta: number) => void
  reset: () => void
}

export const useStore = create<GameState>((set) => ({
  hp: 100,
  maxHp: 100,
  ammo: 30,
  maxAmmo: 30,
  kills: 0,
  zoneRadius: 80,
  zoneMinRadius: 15,
  isGameOver: false,
  setHp: (hp) => set({ hp }),
  setAmmo: (ammo) => set({ ammo }),
  addKill: () => set((state) => ({ kills: state.kills + 1 })),
  updateZone: (delta) => set((state) => {
    if (state.isGameOver) return state
    const newRadius = Math.max(state.zoneMinRadius, state.zoneRadius - delta * 0.5)
    return { zoneRadius: newRadius }
  }),
  reset: () => set({ hp: 100, ammo: 30, kills: 0, zoneRadius: 80, isGameOver: false })
}))

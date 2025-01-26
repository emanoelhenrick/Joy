import { create } from "zustand";

interface TrendingProps {
  matches: any[]
  updateMatches: (matches: any[]) => void
}

export const useTrending = create<TrendingProps>((set) => ({
  matches: [],
  updateMatches: (updatedMatches: any[]) => set({ matches: updatedMatches })
}))
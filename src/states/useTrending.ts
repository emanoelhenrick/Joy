import { MovieMatch } from "electron/core/services/fetchTmdbTrending";
import { create } from "zustand";

interface TrendingProps {
  matches: MovieMatch[]
  updateMatches: (matches: MovieMatch[]) => void
}

export const useTrending = create<TrendingProps>((set) => ({
  matches: [],
  updateMatches: (updatedMatches: any[]) => set({ matches: updatedMatches })
}))
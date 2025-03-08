import { LivePlaylistProps } from "electron/core/models/LiveModels";
import { SeriesPlaylistProps } from "electron/core/models/SeriesModels";
import { VodPlaylistProps, VodProps } from "electron/core/models/VodModels";
import { MovieMatch } from "electron/core/services/fetchTmdbTrending";
import Fuse from "fuse.js";
import { create } from "zustand";

interface VodPlaylistState {
  data: VodPlaylistProps
  update: (data: VodPlaylistProps) => void
}

interface SeriesPlaylistState {
  data: SeriesPlaylistProps
  update: (data: SeriesPlaylistProps) => void
}

interface LivePlaylistState {
  data: LivePlaylistProps
  update: (data: LivePlaylistProps) => void
}

export const useVodPlaylist = create<VodPlaylistState>((set) => ({
  data: { categories: [], playlist: [] },
  update: (data: VodPlaylistProps) => set(() => ({ data: data }))
}))

export const useSeriesPlaylist = create<SeriesPlaylistState>((set) => ({
  data: { categories: [], playlist: [] },
  update: (data: SeriesPlaylistProps) => set(() => ({ data: data }))
}))

export const useLivePlaylist = create<LivePlaylistState>((set) => ({
  lastUpdated: Date.now(),
  data: { categories: [], playlist: [] },
  update: (data: LivePlaylistProps) => set(() => ({ data: data }))
}))

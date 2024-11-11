import electronApi from '@/config/electronApi'
import { UserDataProps } from 'electron/core/models/UserData'
import { create } from 'zustand'

export interface UserDataState {
  userData: UserDataProps
  reset: () => void
  updateUserData: (data: UserDataProps) => void
  updateFavorite: (id: string, type: string) => void
  updateVodStatus: (id: string, currentTime: number, duration: number, watching: boolean) => void
  updateSeriesStatus: (id: string, season: string, episodeId: string, currentTime: number, number: number, watching: boolean) => void
  updateSeason: (id: string, season: string) => void
}

export const useUserData = create<UserDataState>((set, get) => ({
  userData: { vod: [], series: [], live: []},
  reset: () => set({ userData: { vod: [], series: [], live: []} }),
  updateUserData: (data) => set({ userData: data }),
  updateFavorite: (id: string, type: string) => {
    set(prev => {
        const hasType = Object.hasOwn(prev.userData, type)
        if (!hasType) {
          Object.defineProperty(prev.userData, type, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [{ id, favorite: true }],
          })
          return prev
        }
        const list = Object.getOwnPropertyDescriptor(prev.userData, type)!.value
        const exists = list.find((v: { id: string }) => v.id == id)
        if (!exists) {
          list.push({ id, favorite: true })
          Object.defineProperty(prev.userData, type, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: list,
          })
        } else {
          exists.favorite = exists.favorite ? false : true
          const newVod = list.map((v: { id: string }) => {
            if (v.id == id) {
              return exists
            }
            return v
          })
          Object.defineProperty(prev.userData, type, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: newVod,
          })
        }
        electronApi.updateUserData(prev.userData)
        return prev
    })
  },
  updateVodStatus: (id: string, currentTime: number, duration: number, watching: boolean) => {
    set(prev => {
      if (!prev.userData.vod) {
        prev.userData.vod = [{ id, currentTime, duration, favorite: false, updatedAt: Date.now() }]
        return prev
      }

      const vod = prev.userData.vod.find(v => v.id == id)
      if (!vod) {
        prev.userData.vod.push({ id, currentTime, duration, favorite: false, watching, updatedAt: Date.now() })
        return prev
      }

      const updated = prev.userData.vod.map(v => {
        if (v.id == id) {
          return {...v, currentTime, duration, watching, updatedAt: Date.now()}
        }
        return v
      })

      prev.userData.vod = updated
      electronApi.updateUserData(prev.userData)
      return prev
    })
  },
  updateSeriesStatus: (id, season, episodeId, currentTime, duration, watching) => {
    let prevSeries = get().userData.series
    const calculateSeries = () => {
      if (!prevSeries) {
        return [{ id, updatedAt: Date.now(), favorite: false, episodes: [{ season, episodeId, currentTime, duration, watching }] }]
      }

      const series = prevSeries.find(s => s.id == id)
      if (!series) {
        prevSeries.push({ id, updatedAt: Date.now(), favorite: false, episodes: [{ season, episodeId, currentTime, duration, watching }] })
        return prevSeries
      }

      const updated = prevSeries.map(s => {
        if (s.id == id) {
          s.updatedAt = Date.now()

          if (!s.episodes) {
            s.episodes = [{ season, episodeId, currentTime, duration, watching }]
          }

          const episode = s.episodes.find(e => (e.episodeId == episodeId) && (e.season == season))
          if (!episode) {
            s.episodes.push({ season, episodeId, currentTime, duration, watching })
          }

          const updated = s.episodes.map(e => {
            if ((e.episodeId == episodeId) && (e.season == season)) {
              return {...e, currentTime, duration, watching }
            }
            return e
          })
          s.episodes = updated
        }
        return s
      })

      prevSeries = updated
      return prevSeries
    }

    const newSeries = calculateSeries()
    
    set(prev => ({
      userData: {
        ...prev.userData, series: newSeries
      }
    }))

    electronApi.updateUserData(get().userData)
  },
  updateSeason: (id: string, season: string) => {
    const newSeries = get().userData.series!.map((s) => {
      console.log(s);
      
      if (s.id == id) s.season = season
      return s
    })

    set(prev => ({
      userData: {
        ...prev.userData, series: newSeries
      }
    }))
  }
}))
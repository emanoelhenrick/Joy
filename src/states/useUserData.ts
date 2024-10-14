import electronApi from '@/config/electronApi'
import { UserDataProps } from 'electron/core/models/UserData'
import { create } from 'zustand'

export interface UserDataState {
  userData: UserDataProps
  updateUserData: (data: UserDataProps) => void
  updateFavorite: (id: string, type: string) => void
  updateVodStatus: (id: string, currentTime: number, duration: number) => void
  updateSeriesStatus: (id: string, season: string, episodeId: string, currentTime: number, number: number) => void
}

export const useUserData = create<UserDataState>((set, get) => ({
  userData: { vod: [], series: [], live: []},
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
  updateVodStatus: (id: string, currentTime: number, duration: number) => {
    set(prev => {
      if (!prev.userData.vod) {
        prev.userData.vod = [{ id, currentTime, duration, favorite: false }]
        return prev
      }

      const vod = prev.userData.vod.find(v => v.id == id)
      if (!vod) {
        prev.userData.vod.push({ id, currentTime, duration, favorite: false })
        return prev
      }

      const updated = prev.userData.vod.map(v => {
        if (v.id == id) {
          return {...v, currentTime, duration}
        }
        return v
      })

      prev.userData.vod = updated
      electronApi.updateUserData(prev.userData)
      return prev
    })
  },
  updateSeriesStatus: (id, season, episodeId, currentTime, duration) => {
    let prevSeries = get().userData.series
    const calculateSeries = () => {
      if (!prevSeries) {
        return [{ id, favorite: false, episodes: [{ season, episodeId, currentTime, duration }] }]
      }

      const series = prevSeries.find(s => s.id == id)
      if (!series) {
        prevSeries.push({ id, favorite: false, episodes: [{ season, episodeId, currentTime, duration }] })
        return prevSeries
      }

      const updated = prevSeries.map(s => {
        if (s.id == id) {
          if (!s.episodes) {
            s.episodes = [{ season, episodeId, currentTime, duration }]
          }

          const episode = s.episodes.find(e => (e.episodeId == episodeId) && (e.season == season))
          if (!episode) {
            s.episodes.push({ season, episodeId, currentTime, duration })
          }

          const updated = s.episodes.map(e => {
            if ((e.episodeId == episodeId) && (e.season == season)) {
              return {...e, currentTime, duration}
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
}))
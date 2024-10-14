import { PlaylistInfo } from 'electron/core/models/PlaylistInfo'
import { create } from 'zustand'

export interface PlaylistUrls {
  getAllVodUrl: string,
  getAllVodCategoriesUrl: string,
  getAllSeriesUrl: string,
  getAllSeriesCategoriesUrl: string
  getAllLiveUrl: string,
  getAllLiveCategoriesUrl: string
  getVodInfoUrl: string,
  getSeriesInfoUrl: string,
  getAuthenticateUrl: string,
  getVodStreamUrl: string,
  getSeriesStreamUrl: string,
  getLiveStreamUrl: string
}

export interface PlaylistUrlsState {
  urls: PlaylistUrls,
  updateUrls: (urls: PlaylistUrls) => void
}


export const usePlaylistUrl = create<PlaylistUrlsState>((set) => ({
  urls: {
    getAllVodUrl: '',
    getAllVodCategoriesUrl: '',
    getVodInfoUrl: '',
    getAllSeriesUrl: '',
    getAllSeriesCategoriesUrl: '',
    getSeriesInfoUrl: '',
    getAllLiveUrl: '',
    getAllLiveCategoriesUrl: '',
    getAuthenticateUrl: '',
    getVodStreamUrl: '',
    getSeriesStreamUrl: '',
    getLiveStreamUrl: ''
  },
  updateUrls: (urls: any) => set({ urls })
}))

export function makeUrls(playlistInfo: PlaylistInfo) {
  const { url, username, password } = playlistInfo
  return {
    getAuthenticateUrl: `${url}/player_api.php?username=${username}&password=${password}`,
    getAllVodUrl: `${url}/player_api.php?username=${username}&password=${password}&action=get_vod_streams`,
    getAllVodCategoriesUrl: `${url}/player_api.php?username=${username}&password=${password}&action=get_vod_categories`,
    getVodStreamUrl: `${url}/movie/${username}/${password}/`,
    getVodInfoUrl: `${url}/player_api.php?username=${username}&password=${password}&action=get_vod_info&vod_id=`,
    getAllSeriesUrl: `${url}/player_api.php?username=${username}&password=${password}&action=get_series`,
    getAllSeriesCategoriesUrl: `${url}/player_api.php?username=${username}&password=${password}&action=get_series_categories`,
    getSeriesInfoUrl: `${url}/player_api.php?username=${username}&password=${password}&action=get_series_info&series_id=`,
    getSeriesStreamUrl: `${url}/series/${username}/${password}/`,
    getAllLiveUrl: `${url}/player_api.php?username=${username}&password=${password}&action=get_live_streams`,
    getAllLiveCategoriesUrl: `${url}/player_api.php?username=${username}&password=${password}&action=get_live_categories`,
    getLiveStreamUrl: `${url}/live/${username}/${password}/`,
  }
}

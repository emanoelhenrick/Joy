import { LivePlaylistProps } from "electron/core/models/LiveModels";
import { MetaProps } from "electron/core/models/MetaProps"
import { PlaylistInfo } from "electron/core/models/PlaylistInfo";
import { SerieInfoProps, SeriesPlaylistProps } from "electron/core/models/SeriesModels";
import { UserDataProps } from "electron/core/models/UserData";
import { VodInfoProps, VodPlaylistProps } from "electron/core/models/VodModels";

interface PlaylistUrlsProps {
  playlistUrl: string
  categoriesUrl: string
  name: string
}

export interface Api {
  getMetadata: () => Promise<MetaProps>
  addNewPlaylist: (playlistInfo: PlaylistInfo) => Promise<Boolean>
  updateVod: (playlistUrls: PlaylistUrlsProps) => Promise<Boolean>
  updateSeries: (playlistUrls: PlaylistUrlsProps) => Promise<Boolean>
  updateLive: (playlistUrls: PlaylistUrlsProps) => Promise<Boolean>
  authenticateUser: (url: string) => Promise<Boolean>
  addPlaylistToMeta: (playlistInfo: PlaylistInfo) => Promise<Boolean>
  getLocalVodPlaylist: (playlistName: string) => Promise<VodPlaylistProps>
  getLocalSeriesPlaylist: (playlistName: string) => Promise<SeriesPlaylistProps>
  getLocalLivePlaylist: (playlistName: string) => Promise<LivePlaylistProps>
  getPlaylistInfo: (url: string) => Promise<PlaylistInfo | undefined>
  getVodInfo: (url: string) => Promise<VodInfoProps | undefined>
  getSerieInfo: (url: string) => Promise<SerieInfoProps | undefined>
  getUserData: (playlistName: string) => Promise<UserDataProps>
  updateUserData: (data: UserDataProps) => Promise<UserDataProps>
}

const electronApi = window.ipcRenderer as unknown as Api
export default electronApi
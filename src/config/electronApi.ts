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

interface GetUserDataProps {
  playlistName: string,
  profile: string
} 

export interface Api {
  getMetadata: () => Promise<MetaProps>
  updateVod: (playlistUrls: PlaylistUrlsProps) => Promise<VodPlaylistProps>
  updateSeries: (playlistUrls: PlaylistUrlsProps) => Promise<SeriesPlaylistProps>
  updateLive: (playlistUrls: PlaylistUrlsProps) => Promise<LivePlaylistProps>
  authenticateUser: (url: string) => Promise<Boolean>
  addPlaylistToMeta: (playlistInfo: PlaylistInfo) => Promise<Boolean>
  getLocalVodPlaylist: (playlistName: string) => Promise<VodPlaylistProps>
  getLocalSeriesPlaylist: (playlistName: string) => Promise<SeriesPlaylistProps>
  getLocalLivePlaylist: (playlistName: string) => Promise<LivePlaylistProps>
  getPlaylistInfo: (url: string) => Promise<PlaylistInfo | undefined>
  getVodInfo: (url: string) => Promise<VodInfoProps | undefined>
  getSerieInfo: (url: string) => Promise<SerieInfoProps | undefined>
  getUserData: (data: GetUserDataProps) => Promise<UserDataProps>
  updateUserData: (data: UserDataProps) => Promise<UserDataProps>
  changeCurrentPlaylist: (playlistName: string) => Promise<Boolean>
  updatedAtPlaylist: (playlistName: string) => Promise<Boolean>
  createProfile: (data: GetUserDataProps) => Promise<boolean>
  switchProfile: (profile: string) => Promise<boolean>
}

const electronApi = window.ipcRenderer as unknown as Api
export default electronApi
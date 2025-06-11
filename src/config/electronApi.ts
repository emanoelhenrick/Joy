import { LivePlaylistProps } from "electron/core/models/LiveModels";
import { MetaProps } from "electron/core/models/MetaProps"
import { PlaylistInfo } from "electron/core/models/PlaylistInfo";
import { SerieInfoProps, SeriesPlaylistProps } from "electron/core/models/SeriesModels";
import { UserDataProps } from "electron/core/models/UserData";
import { VodInfoProps, VodPlaylistProps } from "electron/core/models/VodModels";
import { AuthRes } from "electron/core/services/authenticateUser";
import { EditPlaylistInfoProps } from "electron/core/services/editPlaylistInfo";
import { VlcState } from "electron/core/services/vlc/getVLCState";
import { LaunchVlcProps } from "electron/core/services/vlc/launchVLC";

interface PlaylistUrlsProps {
  playlistUrl: string
  categoriesUrl: string
  name: string
}

interface RenameProfileProps {
  profile: string
  newName: string
} 

export interface Api {
  getPlatform: () => string
  getMetadata: () => Promise<MetaProps>
  updateCurrentPlaylist: () => Promise<{ isSuccess: boolean, data: any }>
  updateVod: (playlistName: string) => Promise<VodPlaylistProps>
  updateSeries: (playlistName: string) => Promise<SeriesPlaylistProps>
  updateLive: (playlistName: string) => Promise<LivePlaylistProps>
  authenticateUser: (url: string) => Promise<AuthRes>
  fetchTmdbTrending: () => Promise<undefined>
  getLocalTmdbTrending: () => Promise<any[]>
  addPlaylistToMeta: (playlistInfo: PlaylistInfo) => Promise<Boolean>
  editPlaylistInfo: (data: EditPlaylistInfoProps) => Promise<void>
  removePlaylist: (playlistName: string) => Promise<MetaProps>
  getLocalVodPlaylist: (playlistName: string) => Promise<VodPlaylistProps>
  getLocalSeriesPlaylist: (playlistName: string) => Promise<SeriesPlaylistProps>
  getLocalLivePlaylist: (playlistName: string) => Promise<LivePlaylistProps>
  getPlaylistInfo: (url: string) => Promise<PlaylistInfo | undefined>
  getVodInfo: (url: string) => Promise<VodInfoProps | undefined>
  getSerieInfo: (url: string) => Promise<SerieInfoProps | undefined>
  getUserData: (profile: string) => Promise<UserDataProps>
  updateUserData: (data: UserDataProps) => Promise<UserDataProps>
  changeCurrentPlaylist: (playlistName: string) => Promise<Boolean>
  updatedAtPlaylist: (playlistName: string) => Promise<Boolean>
  createProfile: (profile: string) => Promise<boolean>
  switchProfile: (profile: string) => Promise<boolean>
  renameProfile: (data: RenameProfileProps) => Promise<boolean>
  removeProfile: (profile: string) => Promise<void>
  launchVLC: (props: LaunchVlcProps) => Promise<number>
  getVLCState: () => Promise<VlcState>
  updateVLCPath: () => Promise<undefined>
  removeAllListeners: (listenerName: string) => void
}

const electronApi = window.ipcRenderer as unknown as Api
export default electronApi
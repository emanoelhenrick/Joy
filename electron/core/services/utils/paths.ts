import { app } from "electron"
import path from "path"

const SessionDataDir = app.getPath('sessionData')
const PLAYLIST_DIR =  path.join(SessionDataDir, 'Playlists')
export const META_PATH =  path.join(PLAYLIST_DIR, 'meta.json')

export const getPlaylistFolderPath = (playlistName: string) => path.join(SessionDataDir, `Playlists/${playlistName}`)
export const getSnapshotsFolder = () => path.join(SessionDataDir, `Playlists/Snapshots`)
export const getUserDataPath = (playlistName: string, profile: string) => path.join(SessionDataDir, `Playlists/${playlistName}/user/${profile}.json`)
export const getVodPath = (playlistName: string) => path.join(SessionDataDir, `Playlists/${playlistName}/vod.json`)
export const getSeriesPath = (playlistName: string) => path.join(SessionDataDir, `Playlists/${playlistName}/series.json`)
export const getLivePath = (playlistName: string) => path.join(SessionDataDir, `Playlists/${playlistName}/live.json`)
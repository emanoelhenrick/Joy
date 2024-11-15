import { app } from "electron"
import path from "path"

const SessionDataDir = app.getPath('sessionData')
const PLAYLIST_DIR =  path.join(SessionDataDir, 'playlists')
export const META_PATH =  path.join(PLAYLIST_DIR, 'meta.json')
export const getUserDataPath = (playlistName: string, profile: string) => path.join(SessionDataDir, `playlists/${playlistName}/user/${profile}.json`)
export const getVodPath = (playlistName: string) => path.join(SessionDataDir, `playlists/${playlistName}/vod.json`)
export const getSeriesPath = (playlistName: string) => path.join(SessionDataDir, `playlists/${playlistName}/series.json`)
export const getLivePath = (playlistName: string) => path.join(SessionDataDir, `playlists/${playlistName}/live.json`)
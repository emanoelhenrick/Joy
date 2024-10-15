import { app } from "electron"
import { readAsync, writeAsync } from "fs-jetpack"
import path from "path"
import { MetaProps } from "../models/MetaProps"
import { PlaylistInfo } from "../models/PlaylistInfo"

export async function addPlaylistToMeta(playlistInfo: PlaylistInfo) {
  try {
    const SessionDataDir = app.getPath('sessionData')
    const PLAYLIST_DIR =  path.join(SessionDataDir, 'playlists')
    const META_PATH =  path.join(PLAYLIST_DIR, 'meta.json')

    const metadata: MetaProps = await readAsync(META_PATH, 'json')

    if (metadata.playlists) {
      for (const playlist of metadata.playlists) {
        if (playlist.name == playlistInfo.name) return false
      }
      metadata.playlists.push(playlistInfo)
    } else {
      metadata.playlists = [playlistInfo]
    }

    metadata.currentPlaylist = playlistInfo.name
    
    await writeAsync(META_PATH, metadata)
    return true
  } catch (error) {
    console.log(error);
    return false
  }
}
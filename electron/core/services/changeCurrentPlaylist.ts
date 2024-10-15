import { app } from "electron"
import { readAsync, writeAsync } from "fs-jetpack"
import path from "path"
import { MetaProps } from "../models/MetaProps"

export async function changeCurrentPlaylist(playlistName: string) {
  try {
    const SessionDataDir = app.getPath('sessionData')
    const PLAYLIST_DIR =  path.join(SessionDataDir, 'playlists')
    const META_PATH =  path.join(PLAYLIST_DIR, 'meta.json')

    const metadata: MetaProps = await readAsync(META_PATH, 'json')

    const exists = metadata.playlists.find(p => p.name == playlistName)
    if (!exists) return false

    metadata.currentPlaylist = playlistName
    
    await writeAsync(META_PATH, metadata)
    return true
  } catch (error) {
    console.log(error);
    return false
  }
}
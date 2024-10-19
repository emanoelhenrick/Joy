import { app } from "electron";
import path from "path";
import { readAsync, writeAsync } from "fs-jetpack";
import { MetaProps } from "../models/MetaProps";

export async function updatedAtPlaylist(playlistName: string) {
  const SessionDataDir = app.getPath('sessionData')
  const PLAYLIST_DIR =  path.join(SessionDataDir, 'playlists')
  const META_PATH =  path.join(PLAYLIST_DIR, 'meta.json')

  const meta: MetaProps = await readAsync(META_PATH, 'json')
  const updated = meta.playlists.map(p => {
    if (p.name == playlistName) {
      p.updatedAt = new Date()
      return p
    }
    return p
  })

  meta.playlists = updated

  await writeAsync(META_PATH, meta)
  return new Promise(resolve => resolve(true))
}
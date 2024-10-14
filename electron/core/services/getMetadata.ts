import { app } from 'electron';
import { existsAsync, readAsync, writeAsync } from 'fs-jetpack'
import path from 'path';
import { MetaProps } from '../models/MetaProps';

export async function getMetadata(): Promise<MetaProps> {
  const SessionDataDir = app.getPath('sessionData')
  const PLAYLIST_DIR =  path.join(SessionDataDir, 'playlists')
  const META_PATH =  path.join(PLAYLIST_DIR, 'meta.json')

  const isPlaylist = await existsAsync(META_PATH)

  if (!isPlaylist) {
    const newMeta = { currentPlaylist: '', playlists: [] }
    await writeAsync(META_PATH, newMeta)
    return new Promise(resolve => resolve(newMeta))
  }

  const metadata = await readAsync(META_PATH, 'json')
  return new Promise(resolve => resolve(metadata))
}
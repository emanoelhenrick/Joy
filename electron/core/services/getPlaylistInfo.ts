import { app } from 'electron';
import { readAsync } from 'fs-jetpack'
import path from 'path';
import { PlaylistInfo } from '../models/PlaylistInfo';

export async function getPlaylistInfo(playlistName: string): Promise<PlaylistInfo | undefined> {
  const SessionDataDir = app.getPath('sessionData')
  const PLAYLIST_DIR =  path.join(SessionDataDir, 'playlists')
  const INFO_PATH =  path.join(PLAYLIST_DIR, `${playlistName}/info.json`)

  return await readAsync(INFO_PATH, 'json')
}
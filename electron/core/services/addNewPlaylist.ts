import { PlaylistInfo } from '../models/PlaylistInfo';
import path from 'path';
import { app } from 'electron';
import { writeAsync } from 'fs-jetpack';

export async function addNewPlaylist(playlistInfo: PlaylistInfo) {
  try {
    const SessionDataDir = app.getPath('sessionData')
    const PLAYLIST_DIR =  path.join(SessionDataDir, `playlists/${playlistInfo.name}/info.json`)

    await writeAsync(PLAYLIST_DIR, playlistInfo)
    return new Promise(resolve => resolve(true))

  } catch (error) {
    return new Promise((_resolve, reject) => {
      console.log(error);
      reject(false)
    })
  }
}
import { readAsync } from 'fs-jetpack';
import { VodPlaylistProps } from '../../models/VodModels';
import { app } from 'electron';
import path from 'path';

export async function getLocalVodPlaylist(playlistName: string) {
  const SessionDataDir = app.getPath('sessionData')
  const VOD_PATH =  path.join(SessionDataDir, `playlists/${playlistName}/vod.json`)
  const VodPlaylist = await readAsync(VOD_PATH, 'json');
  return VodPlaylist as VodPlaylistProps
}
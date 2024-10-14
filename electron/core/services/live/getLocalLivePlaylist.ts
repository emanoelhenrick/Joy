import { app } from 'electron';
import path from 'path';
import { readAsync } from 'fs-jetpack';
import { LivePlaylistProps } from 'electron/core/models/LiveModels';

export async function getLocalLivePlaylist(playlistName: string) {
  const SessionDataDir = app.getPath('sessionData')
  const LIVE_PATH =  path.join(SessionDataDir, `playlists/${playlistName}/live.json`)
  const LivePlaylist = await readAsync(LIVE_PATH, 'json');
  return LivePlaylist as LivePlaylistProps
}
import { readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import { LivePlaylistProps } from '../models/LiveModels';

export async function getLocalLivePlaylist(playlistName: string) {
  const VodPlaylist = await readTextFile(`playlists/${playlistName}/live.json`, { baseDir: BaseDirectory.AppLocalData });
  return JSON.parse(VodPlaylist) as LivePlaylistProps
}
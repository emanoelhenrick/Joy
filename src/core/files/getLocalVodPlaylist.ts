import { readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import { VodPlaylistProps } from '../models/VodModels';

export async function getLocalVodPlaylist(playlistName: string) {
  const VodPlaylist = await readTextFile(`playlists/${playlistName}/vod.json`, { baseDir: BaseDirectory.AppLocalData });
  return JSON.parse(VodPlaylist) as VodPlaylistProps
}
import { readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import { SeriesPlaylistProps } from '../models/SeriesModels';

export async function getLocalSeriesPlaylist(playlistName: string) {
  const SeriesPlaylist = await readTextFile(`playlists/${playlistName}/series.json`, { baseDir: BaseDirectory.AppLocalData });
  return JSON.parse(SeriesPlaylist) as SeriesPlaylistProps
}
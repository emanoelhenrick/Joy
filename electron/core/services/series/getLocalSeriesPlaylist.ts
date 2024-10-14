import { app } from 'electron';
import { SeriesPlaylistProps } from '../../models/SeriesModels';
import path from 'path';
import { readAsync } from 'fs-jetpack';

export async function getLocalSeriesPlaylist(playlistName: string) {
  const SessionDataDir = app.getPath('sessionData')
  const SERIES_PATH =  path.join(SessionDataDir, `playlists/${playlistName}/series.json`)
  const SeriesPlaylist = await readAsync(SERIES_PATH, 'json');
  return SeriesPlaylist as SeriesPlaylistProps
}
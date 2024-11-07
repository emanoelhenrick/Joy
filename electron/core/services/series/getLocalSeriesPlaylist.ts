import { SeriesPlaylistProps } from '../../models/SeriesModels';
import { readAsync } from 'fs-jetpack';
import { getSeriesPath } from 'electron/core/utils/paths';

export async function getLocalSeriesPlaylist(playlistName: string) {
  const SeriesPlaylist = await readAsync(getSeriesPath(playlistName), 'json');
  return SeriesPlaylist as SeriesPlaylistProps
}
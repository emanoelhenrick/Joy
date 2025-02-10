import { readAsync } from 'fs-jetpack';
import { VodPlaylistProps } from '../../models/VodModels';
import { getVodPath } from '../paths';

export async function getLocalVodPlaylist(playlistName: string) {
  const VOD_PATH =  getVodPath(playlistName)
  const VodPlaylist = await readAsync(VOD_PATH, 'json');
  return VodPlaylist as VodPlaylistProps
}
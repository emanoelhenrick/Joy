import { readAsync } from 'fs-jetpack'
import { PlaylistInfo } from '../../models/PlaylistInfo';
import { MetaProps } from '../../models/MetaProps';
import { META_PATH } from '../utils/paths';

export async function getPlaylistInfo(playlistName: string): Promise<PlaylistInfo | undefined> {
  const meta: MetaProps = await readAsync(META_PATH, 'json')
  return meta.playlists.find(p => p.name == playlistName)
}
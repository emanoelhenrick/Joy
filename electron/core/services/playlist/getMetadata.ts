import { readAsync, writeAsync } from 'fs-jetpack'
import { MetaProps } from '../../models/MetaProps';
import { META_PATH } from '../utils/paths';

export async function getMetadata(): Promise<MetaProps> {
  const metadata = await readAsync(META_PATH, 'json')
  if (!metadata) {
    const newMeta = { currentPlaylist: { name: '', profile: '' }, playlists: [], vlcPath: '' }
    if (process.platform === 'linux') newMeta.vlcPath = 'vlc'
    await writeAsync(META_PATH, newMeta)
    return newMeta
  }
  return metadata
}
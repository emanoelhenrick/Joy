import { readAsync, writeAsync } from 'fs-jetpack'
import { MetaProps } from '../models/MetaProps';
import { META_PATH } from './paths';

export async function getMetadata(): Promise<MetaProps> {
  const metadata = await readAsync(META_PATH, 'json')
  if (!metadata) {
    const newMeta = { currentPlaylist: '', playlists: [] }
    await writeAsync(META_PATH, newMeta)
    return newMeta
  }
  return metadata
}
import { readAsync, writeAsync } from 'fs-jetpack'
import { getUserDataPath, META_PATH } from '../paths';
import { getMetadata } from '../getMetadata';

export async function createProfile(profile: string): Promise<boolean> {
  const metadata = await getMetadata()
  const USERDATA_PATH = getUserDataPath(metadata.currentPlaylist.name, profile)
  const currentPlaylist = metadata.playlists.find(p => p.name === metadata.currentPlaylist.name)
  const profileExists = currentPlaylist?.profiles.find(p => p === profile)
  if (profileExists) return false
  const updatedPlaylist = metadata.playlists.map(p => {
    if (p.name === metadata.currentPlaylist.name) p.profiles.push(profile)
    return p
  })
  metadata.playlists = updatedPlaylist
  await writeAsync(META_PATH, metadata)
  let userData = await readAsync(getUserDataPath(metadata.currentPlaylist.name, profile), 'json')
  if (!userData) {
    userData = { vod: [], series: [], live: [] }
    await writeAsync(USERDATA_PATH, userData)
    return true
  }
  return false
}
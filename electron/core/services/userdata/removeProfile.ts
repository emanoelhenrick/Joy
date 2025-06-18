import { removeAsync, writeAsync } from 'fs-jetpack'
import { getUserDataPath, META_PATH } from '../utils/paths';
import { getMetadata } from '../playlist/getMetadata';

export async function removeProfile(profile: string): Promise<void> {
  const metadata = await getMetadata()

  let updatedProfiles: string[] = [];
  const updatedPlaylists = metadata.playlists.map(p => {
    if (p.name === metadata.currentPlaylist.name) {
      const newProfiles = p.profiles.filter(prof => prof !== profile)
      p.profiles = newProfiles
      updatedProfiles = newProfiles
    }
    return p
  })

  metadata.currentPlaylist.profile = updatedProfiles[0]
  metadata.playlists = updatedPlaylists

  await writeAsync(META_PATH, metadata)

  const USERDATA_PATH = getUserDataPath(metadata.currentPlaylist.name, profile)
  await removeAsync(USERDATA_PATH)
}
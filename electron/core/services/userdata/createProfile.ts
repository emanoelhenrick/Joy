import { readAsync, writeAsync } from 'fs-jetpack'
import { getUserDataPath, META_PATH } from '../paths';
import { MetaProps } from 'electron/core/models/MetaProps';

interface GetUserDataProps {
  playlistName: string,
  profile: string
}

export async function createProfile({ playlistName, profile }: GetUserDataProps ): Promise<boolean> {
  const USERDATA_PATH = getUserDataPath(playlistName, profile)

  const metadata: MetaProps = await readAsync(META_PATH, 'json')
  const currentPlaylist = metadata.playlists.find(p => p.name === playlistName)
  const profileExists = currentPlaylist?.profiles.find(p => p === profile)
  if (profileExists) return false

  const updatedPlaylist = metadata.playlists.map(p => {
    if (p.name === playlistName) {
      p.profiles.push(profile)
    }
    return p
  })

  metadata.playlists = updatedPlaylist
  
  await writeAsync(META_PATH, metadata)

  let userData = await readAsync(getUserDataPath(playlistName, profile), 'json')
  if (!userData) {
    userData = { profile, vod: [], series: [], live: [] }
    await writeAsync(USERDATA_PATH, userData)
    return true
  }
  return false
}
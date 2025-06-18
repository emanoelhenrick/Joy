import { readAsync, writeAsync } from 'fs-jetpack'
import { UserDataProps } from '../../models/UserData';
import { getUserDataPath } from '../utils/paths';
import { getMetadata } from '../playlist/getMetadata';

export async function getUserData(profile: string): Promise<UserDataProps | undefined> {
  const { currentPlaylist } = await getMetadata()
  const USERDATA_PATH = getUserDataPath(currentPlaylist.name, profile)
  let userData = await readAsync(getUserDataPath(currentPlaylist.name, profile), 'json')
  if (!userData) {
    userData = { vod: [], series: [], live: [] }
    await writeAsync(USERDATA_PATH, userData)
  }
  return userData
}
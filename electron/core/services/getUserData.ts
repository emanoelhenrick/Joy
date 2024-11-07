import { readAsync, writeAsync } from 'fs-jetpack'
import { UserDataProps } from '../models/UserData';
import { getUserDataPath } from '../utils/paths';

export async function getUserData(playlistName: string): Promise<UserDataProps | undefined> {
  const USERDATA_PATH = getUserDataPath(playlistName)
  let userData = await readAsync(getUserDataPath(playlistName), 'json')
  if (!userData) {
    userData = { vod: [], series: [], live: [] }
    await writeAsync(USERDATA_PATH, userData)
  }
  return userData
}
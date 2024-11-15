import { readAsync, writeAsync } from 'fs-jetpack'
import { UserDataProps } from '../../models/UserData';
import { getUserDataPath } from '../paths';

interface GetUserDataProps {
  playlistName: string,
  profile: string
}

export async function getUserData({ playlistName, profile }: GetUserDataProps ): Promise<UserDataProps | undefined> {
  const USERDATA_PATH = getUserDataPath(playlistName, profile)
  let userData = await readAsync(getUserDataPath(playlistName, profile), 'json')
  if (!userData) {
    userData = { vod: [], series: [], live: [] }
    await writeAsync(USERDATA_PATH, userData)
  }
  return userData
}
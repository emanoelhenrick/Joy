import { app } from 'electron';
import { readAsync, writeAsync } from 'fs-jetpack'
import path from 'path';
import { UserDataProps } from '../models/UserData';

export async function getUserData(playlistName: string): Promise<UserDataProps | undefined> {
  const SessionDataDir = app.getPath('sessionData')
  const USERDATA_PATH =  path.join(SessionDataDir, `playlists/${playlistName}/userdata.json`)
  let userData = await readAsync(USERDATA_PATH, 'json')
  if (!userData) {
    userData = { vod: [], series: [], live: [] }
    await writeAsync(USERDATA_PATH, userData)
  }
  return userData
}
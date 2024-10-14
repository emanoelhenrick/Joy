import { writeAsync } from "fs-jetpack";
import { app } from "electron";
import path from "node:path";
import { UserVodDataProps } from "electron/core/models/VodModels";
import { getUserData } from "../getUserData";

interface UpdateUserDataProps {
  userVodData: UserVodDataProps
  playlistName: string
}

export async function updateUserVodData({ userVodData, playlistName }: UpdateUserDataProps) {
  const SessionDataDir = app.getPath('sessionData')
  const USERDATA_PATH =  path.join(SessionDataDir, `playlists/${playlistName}/userdata.json`)
  const userData = await getUserData(playlistName)

  if (!userData) {
    const newUserData = { vod: [userVodData] }
    return await writeAsync(USERDATA_PATH, newUserData)
  }

  if (!userData.vod) {
    userData.vod = [userVodData]
    return await writeAsync(USERDATA_PATH, userData)
  }

  const exists = userData.vod.find(v => v.id == userVodData.id)

  if (exists) {
    const newVodData = userData.vod!.map(v => {
      if (v.id == userVodData.id) return userVodData
      return userVodData
    })
    userData.vod = newVodData
    return await writeAsync(USERDATA_PATH, userData)
  }

  userData.vod!.push(userVodData)
  await writeAsync(USERDATA_PATH, userVodData)
  return new Promise(resolve => resolve(userVodData))
}
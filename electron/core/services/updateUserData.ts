import { writeAsync } from "fs-jetpack";
import { UserDataProps } from "../models/UserData";
import { app } from "electron";
import path from "node:path";
import { getMetadata } from "./getMetadata";

export interface UpdateUserDataProps {
  userData: UserDataProps
  playlistName: string
}

export async function updateUserData(data: UserDataProps) {
  const { currentPlaylist } = await getMetadata()
  const SessionDataDir = app.getPath('sessionData')
  const USERDATA_PATH =  path.join(SessionDataDir, `playlists/${currentPlaylist}/userdata.json`)
  await writeAsync(USERDATA_PATH, data)
  return new Promise(resolve => resolve(data))
}
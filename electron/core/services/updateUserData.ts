import { writeAsync } from "fs-jetpack";
import { UserDataProps } from "../models/UserData";
import { getMetadata } from "./getMetadata";
import { getUserDataPath } from "./paths";

export async function updateUserData(data: UserDataProps) {
  const { currentPlaylist } = await getMetadata()
  const USERDATA_PATH =  getUserDataPath(currentPlaylist)
  await writeAsync(USERDATA_PATH, data)
  return data
}
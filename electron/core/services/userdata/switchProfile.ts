import { readAsync, writeAsync } from "fs-jetpack"
import { META_PATH } from "../paths"
import { MetaProps } from "electron/core/models/MetaProps"

export async function switchProfile(profile: string) {
  const metadata: MetaProps = await readAsync(META_PATH, 'json')
  metadata.currentPlaylist.profile = profile
  await writeAsync(META_PATH, metadata)
  return true
}
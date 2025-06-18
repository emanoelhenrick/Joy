import { readAsync, writeAsync } from "fs-jetpack"
import { MetaProps } from "../../models/MetaProps"
import { META_PATH } from "../utils/paths"

export async function changeCurrentPlaylist(playlistName: string) {
  const metadata: MetaProps = await readAsync(META_PATH, 'json')
  const exists = metadata.playlists.find(p => p.name == playlistName)
  if (!exists) return false
  metadata.currentPlaylist = {
    name: playlistName,
    profile: exists.profiles[0]
  }
  await writeAsync(META_PATH, metadata)
  return true
}
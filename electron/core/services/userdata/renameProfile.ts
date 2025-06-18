import { renameAsync, writeAsync } from "fs-jetpack"
import { getUserDataPath, META_PATH } from "../utils/paths"
import { getMetadata } from "../playlist/getMetadata"

interface GetUserDataProps {
  profile: string
  newName: string
}

export async function renameProfile({ profile, newName }: GetUserDataProps) {
  const meta = await getMetadata()
  const USERDATA_PATH = getUserDataPath(meta.currentPlaylist.name, profile)
  meta.currentPlaylist.profile = newName
  const updatedPlaylist = meta.playlists.map(p => {
    if (p.name === meta.currentPlaylist.name) {
      const p1 = p.profiles.filter(pf => pf !== profile)
      p1.push(newName)
      p.profiles = p1
    }
    return p
  })
  meta.playlists = updatedPlaylist
  await writeAsync(META_PATH, meta)
  return await renameAsync(USERDATA_PATH, `${newName}.json`)
}
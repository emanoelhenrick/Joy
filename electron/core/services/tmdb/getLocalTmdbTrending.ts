import { readAsync } from "fs-jetpack"
import { getMetadata } from "../playlist/getMetadata"
import { getPlaylistFolderPath } from "../utils/paths"
import path from "path"

export async function getLocalTmdbTrending() {
  const metadata = await getMetadata()
  const currentPlaylist = metadata.currentPlaylist.name
  const trending = await readAsync(path.join(getPlaylistFolderPath(currentPlaylist), 'trending.json'), 'json')
  return trending || []
}
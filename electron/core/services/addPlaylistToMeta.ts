import { readAsync, writeAsync } from "fs-jetpack"
import { MetaProps } from "../models/MetaProps"
import { PlaylistInfo } from "../models/PlaylistInfo"
import { META_PATH } from "./paths"

export async function addPlaylistToMeta(playlistInfo: PlaylistInfo) {
  const metadata: MetaProps = await readAsync(META_PATH, 'json')
  if (metadata.playlists) {
    for (const playlist of metadata.playlists) {
      if (playlist.name == playlistInfo.name) return false
    }
    metadata.playlists.push(playlistInfo)
  } else {
    metadata.playlists = [playlistInfo]
  }
  metadata.currentPlaylist = playlistInfo.name
  return await writeAsync(META_PATH, metadata)
}
import { readAsync, writeAsync, removeAsync } from "fs-jetpack"
import { MetaProps } from "../models/MetaProps"
import { getPlaylistFolderPath, META_PATH } from "./paths"
import { getMetadata } from "./getMetadata";

export async function removePlaylist(playlistName: string) {
  const metadata: MetaProps = await getMetadata()

  if (metadata.playlists) {
    const updatedPlaylists = metadata.playlists.filter(p => p.name !== playlistName)
    metadata.playlists = updatedPlaylists
  }

  if (metadata.playlists.length === 0) {
    metadata.currentPlaylist = {
      name: '',
      profile: ''
    }
  } else {
    metadata.currentPlaylist = {
      name: metadata.playlists[0].name,
      profile: 'Default'
    }
  }

  await removeAsync(getPlaylistFolderPath(playlistName))
  await writeAsync(META_PATH, metadata)
  return metadata
}
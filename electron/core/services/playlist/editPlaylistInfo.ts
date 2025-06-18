import { readAsync, renameAsync, writeAsync } from "fs-jetpack";
import { PlaylistInfo } from "../../models/PlaylistInfo";
import { getPlaylistFolderPath, META_PATH } from "../utils/paths";
import { MetaProps } from "../../models/MetaProps";

export interface EditPlaylistInfoProps { 
  playlistName: string
  newPlaylistInfo: PlaylistInfo
}

export async function editPlaylistInfo({ playlistName, newPlaylistInfo }: EditPlaylistInfoProps) {
  const metadata: MetaProps = await readAsync(META_PATH, 'json')
  const updatedPlaylists = metadata.playlists.map(playlist => {
    if (playlist.name === playlistName) return { ...newPlaylistInfo, profiles: playlist.profiles }
    return playlist
  })
  metadata.currentPlaylist = { name: newPlaylistInfo.name, profile: 'Default' }
  metadata.playlists = updatedPlaylists
  await renameAsync(getPlaylistFolderPath(playlistName), newPlaylistInfo.name)
  return await writeAsync(META_PATH, metadata)
}
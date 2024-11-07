import { readAsync, writeAsync } from "fs-jetpack";
import { MetaProps } from "../models/MetaProps";
import { META_PATH } from "../utils/paths";

export async function updatedAtPlaylist(playlistName: string) {
  const meta: MetaProps = await readAsync(META_PATH, 'json')
  const updated = meta.playlists.map(p => {
    if (p.name == playlistName) {
      p.updatedAt = new Date()
      return p
    }
    return p
  })
  meta.playlists = updated
  return await writeAsync(META_PATH, meta)
}
import { PlaylistInfo } from "./PlaylistInfo"

export interface MetaProps {
  currentPlaylist: {
    name: string,
    profile: string
  }
  playlists: PlaylistInfo[],
  // tmdbKey: string
}
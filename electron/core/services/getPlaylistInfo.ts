import { app } from 'electron';
import { readAsync } from 'fs-jetpack'
import path from 'path';
import { PlaylistInfo } from '../models/PlaylistInfo';
import { MetaProps } from '../models/MetaProps';

export async function getPlaylistInfo(playlistName: string): Promise<PlaylistInfo | undefined> {
  const SessionDataDir = app.getPath('sessionData')
  const PLAYLIST_DIR =  path.join(SessionDataDir, 'playlists')
  const META_PATH =  path.join(PLAYLIST_DIR, 'meta.json')

  const meta: MetaProps = await readAsync(META_PATH, 'json')
  const playlist = meta.playlists.find(p => p.name == playlistName)
  return playlist
}
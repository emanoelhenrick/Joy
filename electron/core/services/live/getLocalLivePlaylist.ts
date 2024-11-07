import { readAsync } from 'fs-jetpack';
import { LivePlaylistProps } from 'electron/core/models/LiveModels';
import { getLivePath } from 'electron/core/utils/paths';

export async function getLocalLivePlaylist(playlistName: string) {
  const LivePlaylist = await readAsync(getLivePath(playlistName), 'json');
  return LivePlaylist as LivePlaylistProps
}
import { create, BaseDirectory, mkdir } from '@tauri-apps/plugin-fs';
import { updateVod } from './updateVod';
import { updateSeries } from './updateSeries';
import { updateLive } from './updateLive';
import { addPlaylistToMeta } from './addPlaylistToMeta';

interface PlaylistInfo {
  name: string
  username: string
  password: string
  url: string
}

export async function addNewPLaylist(playlistInfo: PlaylistInfo) {
  try {
    await mkdir(`playlists/${playlistInfo.name}`, { baseDir: BaseDirectory.AppLocalData })
   
    const info = await create(`playlists/${playlistInfo.name}/info.json`, { baseDir: BaseDirectory.AppLocalData })
    await info.write(new TextEncoder().encode(JSON.stringify(playlistInfo)));
    await info.close();

    await updateVod(playlistInfo)
    await updateSeries(playlistInfo)
    await updateLive(playlistInfo)

    await addPlaylistToMeta(playlistInfo.name)

    return new Promise((resolve) => resolve(true))
  } catch (error) {
    return new Promise((_resolve, reject) => {
      console.log(error);
      reject(false)
    })
  }
}
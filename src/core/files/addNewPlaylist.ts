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

export async function* addNewPLaylist(playlistInfo: PlaylistInfo) {
  try {
    await mkdir(`playlists/${playlistInfo.name}`, { baseDir: BaseDirectory.AppLocalData })
   
    const info = await create(`playlists/${playlistInfo.name}/info.json`, { baseDir: BaseDirectory.AppLocalData })
    await info.write(new TextEncoder().encode(JSON.stringify(playlistInfo)));
    await info.close();

    yield { msg: 'Downloading VOD playlist...', value: 20}
    await updateVod(playlistInfo)

    yield { msg: 'Downloading Series playlist...', value: 50}
    await updateSeries(playlistInfo)

    yield { msg: 'Downloading Live playlist...', value: 80}
    await updateLive(playlistInfo)

    yield { msg: 'Updating configs...', value: 90}
    await addPlaylistToMeta(playlistInfo.name)

    yield { msg: 'Finished.', value: 100}
  } catch (error) {
    return new Promise((_resolve, reject) => {
      console.log(error);
      reject(false)
    })
  }
}
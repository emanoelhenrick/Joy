import axios from 'axios';
import { create, BaseDirectory, exists, writeTextFile } from '@tauri-apps/plugin-fs';
import { CategoriesProps, VodProps } from '../models/VodModels';
import { PlaylistInfo } from '../models/PlaylistInfo';

export async function updateVod(playlistInfo: PlaylistInfo) {
  const playlistResponse = await axios.get(`${playlistInfo.url}/player_api.php?username=${playlistInfo.username}&password=${playlistInfo.password}&action=get_vod_streams`)
  const categoriesResponse = await axios.get(`${playlistInfo.url}/player_api.php?username=${playlistInfo.username}&password=${playlistInfo.password}&action=get_vod_categories`)

  const data = {
    playlist: playlistResponse.data as VodProps,
    categories: categoriesResponse.data as CategoriesProps
  }

  const tokenExists = await exists(`playlists/${playlistInfo.name}/vod.json`, { baseDir: BaseDirectory.AppLocalData });

  if (!tokenExists) {
    const file = await create(`playlists/${playlistInfo.name}/vod.json`, { baseDir: BaseDirectory.AppLocalData })
    await file.write(new TextEncoder().encode(JSON.stringify(data)));
    return await file.close();
  }
  
  await writeTextFile(`playlists/${playlistInfo.name}/vod.json`, JSON.stringify(data), { baseDir: BaseDirectory.AppLocalData });

}
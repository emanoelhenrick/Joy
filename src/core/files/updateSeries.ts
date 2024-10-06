import axios from 'axios';
import { create, BaseDirectory, exists, writeTextFile } from '@tauri-apps/plugin-fs';
import { PlaylistInfo } from '../models/PlaylistInfo';

export async function updateSeries(playlistInfo: PlaylistInfo) {
  try {
    const playlistResponse = await axios.get(`${playlistInfo.url}/player_api.php?username=${playlistInfo.username}&password=${playlistInfo.password}&action=get_series`)
    const categoriesResponse = await axios.get(`${playlistInfo.url}/player_api.php?username=${playlistInfo.username}&password=${playlistInfo.password}&action=get_series_categories`)

    const data = {
      playlist: playlistResponse.data,
      categories: categoriesResponse.data
    }

    const tokenExists = await exists(`playlists/${playlistInfo.name}/series.json`, { baseDir: BaseDirectory.AppLocalData });

    if (!tokenExists) {
      const file = await create(`playlists/${playlistInfo.name}/series.json`, { baseDir: BaseDirectory.AppLocalData })
      await file.write(new TextEncoder().encode(JSON.stringify(data)));
      return await file.close();
    }
    
    await writeTextFile(`playlists/${playlistInfo.name}/series.json`, JSON.stringify(data), { baseDir: BaseDirectory.AppLocalData });
    
  } catch (error) {
    console.log(error);
  }
}
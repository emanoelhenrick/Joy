import axios from 'axios';
import { create, BaseDirectory, exists, writeTextFile } from '@tauri-apps/plugin-fs';
import { PlaylistInfo } from '../models/PlaylistInfo';

export async function updateLive(playlistInfo: PlaylistInfo) {
  const playlistResponse = await axios.get(`${playlistInfo.url}/player_api.php?username=${playlistInfo.username}&password=${playlistInfo.password}&action=get_live_streams`)
  const categoriesResponse = await axios.get(`${playlistInfo.url}/player_api.php?username=${playlistInfo.username}&password=${playlistInfo.password}&action=get_live_categories`)

  const data = {
    playlist: playlistResponse.data,
    categories: categoriesResponse.data
  }
  
  const tokenExists = await exists(`playlists/${playlistInfo.name}/live.json`, { baseDir: BaseDirectory.AppLocalData });

  if (!tokenExists) {
    const file = await create(`playlists/${playlistInfo.name}/live.json`, { baseDir: BaseDirectory.AppLocalData })
    await file.write(new TextEncoder().encode(JSON.stringify(data)));
    return await file.close();
  }
  
  await writeTextFile(`playlists/${playlistInfo.name}/live.json`, JSON.stringify(data), { baseDir: BaseDirectory.AppLocalData });
}
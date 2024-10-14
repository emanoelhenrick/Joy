import axios from 'axios';
import { app } from 'electron';
import path from 'path';
import { writeAsync } from 'fs-jetpack';

export async function updateLive({ playlistUrl, categoriesUrl, name }: {playlistUrl: string, categoriesUrl: string, name: string}) {
  const playlistResponse = await axios.get(playlistUrl)
  const categoriesResponse = await axios.get(categoriesUrl)

  const data = {
    playlist: playlistResponse.data,
    categories: categoriesResponse.data
  }
  
  const SessionDataDir = app.getPath('sessionData')
  const LIVE_PATH =  path.join(SessionDataDir, `playlists/${name}/live.json`)

  await writeAsync(LIVE_PATH, data)
  return new Promise(resolve => resolve(true))
  
}
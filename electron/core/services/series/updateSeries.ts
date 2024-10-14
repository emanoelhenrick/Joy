import axios from 'axios';
import { app } from 'electron';
import path from 'path';
import { writeAsync } from 'fs-jetpack';

export async function updateSeries({ playlistUrl, categoriesUrl, name }: {playlistUrl: string, categoriesUrl: string, name: string}) {
  const playlistResponse = await axios.get(playlistUrl)
  const categoriesResponse = await axios.get(categoriesUrl)

  const data = {
    playlist: playlistResponse.data,
    categories: categoriesResponse.data
  }

  const SessionDataDir = app.getPath('sessionData')
  const SERIES_PATH =  path.join(SessionDataDir, `playlists/${name}/series.json`)

  await writeAsync(SERIES_PATH, data)
  return new Promise(resolve => resolve(true))
}
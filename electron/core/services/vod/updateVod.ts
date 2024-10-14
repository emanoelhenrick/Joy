import axios from 'axios';
import { CategoriesProps, VodProps } from '../../models/VodModels';
import { app } from 'electron';
import path from 'path';
import { writeAsync } from 'fs-jetpack';

export async function updateVod({ playlistUrl, categoriesUrl, name }: {playlistUrl: string, categoriesUrl: string, name: string}) {
  const playlistResponse = await axios.get(playlistUrl)
  const categoriesResponse = await axios.get(categoriesUrl)

  const data = {
    playlist: playlistResponse.data as VodProps,
    categories: categoriesResponse.data as CategoriesProps
  }

  const SessionDataDir = app.getPath('sessionData')
  const VOD_PATH =  path.join(SessionDataDir, `playlists/${name}/vod.json`)

  await writeAsync(VOD_PATH, data)
  return new Promise(resolve => resolve(true))
}
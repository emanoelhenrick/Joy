import axios from 'axios';
import { writeAsync } from 'fs-jetpack';
import { getVodPath } from 'electron/core/utils/paths';

export async function updateVod({ playlistUrl, categoriesUrl, name }: {playlistUrl: string, categoriesUrl: string, name: string}) {
  const playlistResponse = await axios.get(playlistUrl)
  const categoriesResponse = await axios.get(categoriesUrl)
  const data = { playlist: playlistResponse.data, categories: categoriesResponse.data }
  return await writeAsync(getVodPath(name), data)
}
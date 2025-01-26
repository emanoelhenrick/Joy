import axios from 'axios';
import { writeAsync } from 'fs-jetpack';
import { getVodPath } from '../paths';

export async function updateVod({ playlistUrl, categoriesUrl, name }: {playlistUrl: string, categoriesUrl: string, name: string}) {
  const playlistResponse = await axios.get(playlistUrl)
  const categoriesResponse = await axios.get(categoriesUrl)
  if (playlistResponse.status !== 200 || categoriesResponse.status !== 200) return
  if (!Array.isArray(playlistResponse.data) || !Array.isArray(categoriesResponse.data)) return
  const data = { playlist: playlistResponse.data, categories: categoriesResponse.data }
  await writeAsync(getVodPath(name), data)
  return data
}
import axios from 'axios';
import { writeAsync } from 'fs-jetpack';
import { getLivePath } from '../paths';

export async function updateLive({ playlistUrl, categoriesUrl, name }: {playlistUrl: string, categoriesUrl: string, name: string}) {
  const playlistResponse = await axios.get(playlistUrl)
  const categoriesResponse = await axios.get(categoriesUrl)
  const data = { playlist: playlistResponse.data, categories: categoriesResponse.data }
  await writeAsync(getLivePath(name), data)
  return data
}
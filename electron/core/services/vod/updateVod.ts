import axios from 'axios';
import { writeAsync } from 'fs-jetpack';
import { getVodPath } from '../paths';
import { getUrls } from '../getUrls';

export async function updateVod(name: string) {
  const urls = await getUrls(name)
  if (!urls) return
  const playlistResponse = await axios.get(urls.getAllVodUrl)
  const categoriesResponse = await axios.get(urls.getAllVodCategoriesUrl)
  
  if (playlistResponse.status !== 200 || categoriesResponse.status !== 200) return
  if (!Array.isArray(playlistResponse.data) || !Array.isArray(categoriesResponse.data)) return
  if (playlistResponse.data.length === 0 || categoriesResponse.data.length === 0) return

  const data = { playlist: playlistResponse.data, categories: categoriesResponse.data }
  await writeAsync(getVodPath(name), data)
  return data
}
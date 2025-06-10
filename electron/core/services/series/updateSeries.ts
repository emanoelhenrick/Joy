import axios from 'axios';
import { writeAsync } from 'fs-jetpack';
import { getSeriesPath } from '../paths';
import { getUrls } from '../getUrls';

export async function updateSeries(name: string) {
  const urls = await getUrls(name)
  if (!urls) return
  const playlistResponse = await axios.get(urls.getAllSeriesUrl)
  const categoriesResponse = await axios.get(urls.getAllSeriesCategoriesUrl)

  if (playlistResponse.status !== 200 || categoriesResponse.status !== 200) return
  if (!Array.isArray(playlistResponse.data) || !Array.isArray(categoriesResponse.data)) return
  if (playlistResponse.data.length === 0 || categoriesResponse.data.length === 0) return

  const data = { playlist: playlistResponse.data, categories: categoriesResponse.data }
  await writeAsync(getSeriesPath(name), data)
  return data
}
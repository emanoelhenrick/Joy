import axios from "axios"
import { SerieInfoProps } from "electron/core/models/SeriesModels"

export async function getSerieInfo(url: string) {
  if (!url) return
  const res = await axios.get(url)
  if (!res.data || res.status !== 200) return
  return res.data as SerieInfoProps
}
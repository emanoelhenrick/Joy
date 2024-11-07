import axios from "axios"
import { VodInfoProps } from "electron/core/models/VodModels"

export async function getVodInfo(url: string) {
  if (!url) return
  const res = await axios.get(url)
  if (!res.data) return
  return res.data as VodInfoProps
}
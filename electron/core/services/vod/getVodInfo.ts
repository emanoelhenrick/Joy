import axios from "axios"
import { VodInfoProps } from "electron/core/models/VodModels"

export async function getVodInfo(url: string) {
  if (!url) return
  try {
    const res = await axios.get(url)
    if (!res.data || res.status !== 200) return
    return res.data as VodInfoProps
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw error
    }
  }
}
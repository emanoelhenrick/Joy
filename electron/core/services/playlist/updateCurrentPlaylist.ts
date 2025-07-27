import { authenticateUser } from "./authenticateUser"
import { getMetadata } from "./getMetadata"
import { getUrls } from "../utils/getUrls"
import { updateLive } from "../live/updateLive"
import { updateSeries } from "../series/updateSeries"
import { updatedAtPlaylist } from "./updatedAtPlaylist"
import { updateVod } from "../vod/updateVod"
import { runFetchTmdbTrendingInWorker } from "../tmdb/runFetchTmdbTrendingInWorker"

export async function updateCurrentPlaylist() {
  const metadata = await getMetadata()
  const currentPlaylist = metadata.currentPlaylist.name
  const playlistInfo = metadata.playlists.find(p => p.name === currentPlaylist)
  if (!playlistInfo) return createMessage(false, "Error: playlist info")
  const urls = await getUrls(currentPlaylist)
  if (!urls) return createMessage(false, "Error: urls")

  const authResponse = await authenticateUser(urls.getAuthenticateUrl)
  if (!authResponse || !authResponse.status) return createMessage(false, authResponse?.message)

  const updatedVod = await updateVod(currentPlaylist)
  const updatedSeries = await updateSeries(currentPlaylist)
  const updatedLive = await updateLive(currentPlaylist)

  await updatedAtPlaylist(currentPlaylist)

  if (!updatedVod || !updatedSeries || !updatedLive) return createMessage(false, "Playlist cannot be added/updated")

  return createMessage(true, {
    updatedVod,
    updatedSeries,
    updatedLive
  })
}

function createMessage(isSuccess: boolean, data: any) {
  return {
    isSuccess,
    data: data
  }
}
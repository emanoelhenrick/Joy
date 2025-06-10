import { getMetadata } from "./getMetadata"

export async function getUrls(name: string) {
  const metadata = await getMetadata()
  const playlistInfo = metadata.playlists.find(p => p.name === name)
  if (!playlistInfo) return false
  const { url, username, password } = playlistInfo
  return {
    getAuthenticateUrl: `${url}/player_api.php?username=${username}&password=${password}`,
    getAllVodUrl: `${url}/player_api.php?username=${username}&password=${password}&action=get_vod_streams`,
    getAllVodCategoriesUrl: `${url}/player_api.php?username=${username}&password=${password}&action=get_vod_categories`,
    getVodStreamUrl: `${url}/movie/${username}/${password}/`,
    getVodInfoUrl: `${url}/player_api.php?username=${username}&password=${password}&action=get_vod_info&vod_id=`,
    getAllSeriesUrl: `${url}/player_api.php?username=${username}&password=${password}&action=get_series`,
    getAllSeriesCategoriesUrl: `${url}/player_api.php?username=${username}&password=${password}&action=get_series_categories`,
    getSeriesInfoUrl: `${url}/player_api.php?username=${username}&password=${password}&action=get_series_info&series_id=`,
    getSeriesStreamUrl: `${url}/series/${username}/${password}/`,
    getAllLiveUrl: `${url}/player_api.php?username=${username}&password=${password}&action=get_live_streams`,
    getAllLiveCategoriesUrl: `${url}/player_api.php?username=${username}&password=${password}&action=get_live_categories`,
    getLiveStreamUrl: `${url}/live/${username}/${password}/`,
    getLiveEpgUrl: `${url}/player_api.php?username=${username}&password=${password}&action=get_short_epg&limit=20&stream_id=`
  }
}
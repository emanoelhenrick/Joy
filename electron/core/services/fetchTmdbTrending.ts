import Fuse from "fuse.js"
import { MovieDb } from "moviedb-promise"
import { getLocalVodPlaylist } from "./vod/getLocalVodPlaylist"
import { getLocalSeriesPlaylist } from "./series/getLocalSeriesPlaylist"

export async function fetchTmdbTrending({ apiKey, playlistName }: any) {
  const moviedb = new MovieDb(apiKey)
  const res = await moviedb.trending({ media_type: 'movie', time_window: 'week', language: 'pt-BR'})
  const tmdbData = res.results!

  const vodData = await getLocalVodPlaylist(playlistName)
  const seriesData = await getLocalSeriesPlaylist(playlistName)

  if (tmdbData.length === 0) return []

  const fuseMovies = new Fuse(vodData.playlist, {
    keys: ['name'],
    threshold: 0.2,
    minMatchCharLength: 2
  })

  const fuseSeries = new Fuse(seriesData.playlist, {
    keys: ['name'],
    threshold: 0.2,
    minMatchCharLength: 2
  })

  const filtered: any[] = []
  tmdbData.forEach(info => {
    if (info.media_type === 'movie') {
      const query = info.title! + info.release_date!.split('-')[0]
      const matchesList = fuseMovies.search(query).map(i => i.item)
      if (matchesList.length > 0) filtered.push({ ...info, matches: matchesList }) 
    } else if (info.media_type === 'tv') {
      const query = info.name! + info.first_air_date!.split('-')[0]
      const matchesList = fuseSeries.search(query).map(i => i.item)
      if (matchesList.length > 0) filtered.push({ ...info, matches: matchesList }) 
    }
  })

  return filtered
}
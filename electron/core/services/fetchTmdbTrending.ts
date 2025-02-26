import Fuse from "fuse.js"
import { MovieDb, MovieImagesResponse, MovieResult } from "moviedb-promise"
import { getLocalVodPlaylist } from "./vod/getLocalVodPlaylist"
import { VodProps } from "../models/VodModels"

export interface MovieMatch extends MovieResult {
  matches?: VodProps[]
  images?: MovieImagesResponse
}

export async function fetchTmdbTrending({ apiKey, playlist }: any): Promise<MovieMatch[]> {
  const moviedb = new MovieDb(apiKey)
  const res = await moviedb.moviePopular({ language: 'pt' })
  const tmdbData = res.results! as MovieResult[]

  if (tmdbData.length === 0) return []

  const fuseMovies = new Fuse(playlist, {
    keys: ['name'],
    threshold: 0.2,
    minMatchCharLength: 2
  })

  const filtered: MovieMatch[] = []

  await Promise.all(
    tmdbData.map(async (movie) => {
      const query = movie.title! + movie.release_date!.split('-')[0];
      const matchesList = fuseMovies.search(query).map(i => i.item);
      if (matchesList.length > 0) {
        const images = await moviedb.movieImages({ id: movie.id! });
        filtered.push({ ...movie, matches: matchesList as unknown as VodProps[], images });
      }
    })
  );

  return filtered
}
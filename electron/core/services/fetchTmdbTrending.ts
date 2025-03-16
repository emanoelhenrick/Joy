import Fuse from "fuse.js"
import { MovieDb, MovieImagesResponse, MovieResult } from "moviedb-promise"
import { VodProps } from "../models/VodModels"

export interface MovieMatch extends MovieResult {
  matches?: VodProps[]
  images?: MovieImagesResponse
}

export async function fetchTmdbTrending({ apiKey, playlist }: any): Promise<MovieMatch[]> {
  let tmdbData = []
  const moviedb = new MovieDb(apiKey)
  try {
    const res = await moviedb.trending({ language: 'pt', media_type: "movie", time_window: 'week' })
    tmdbData = res.results! as MovieResult[]
  } catch (error) {
    const res = await moviedb.trending({ language: 'pt', media_type: "movie", time_window: 'week' })
    tmdbData = res.results! as MovieResult[]
  }

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
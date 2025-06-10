import { parentPort, workerData } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";
import Fuse from "fuse.js"
import { MovieDb } from "moviedb-promise"


async function fetchTmdbTrending(apiKey, vodPlaylist) {
  if (!apiKey) return []

  let tmdbData = []
  const moviedb = new MovieDb(apiKey)
  try {
    const res = await moviedb.trending({ language: 'pt', media_type: "movie", time_window: 'week' })
    tmdbData = res.results
  } catch (error) {
    const res = await moviedb.trending({ language: 'pt', media_type: "movie", time_window: 'week' })
    tmdbData = res.results
  }

  if (tmdbData.length === 0) return []

  const fuseMovies = new Fuse(vodPlaylist.playlist, {
    keys: ['name'],
    threshold: 0.2,
    minMatchCharLength: 2
  })

  const filtered = []

  await Promise.all(
    tmdbData.map(async (movie) => {
      const query = movie.title + movie.release_date.split('-')[0];
      const matchesList = fuseMovies.search(query).map(i => i.item);
      if (matchesList.length > 0) {
        const images = await moviedb.movieImages({ id: movie.id });
        filtered.push({ ...movie, matches: matchesList, images });
      }
    })
  );

  if (filtered.length > 0) return filtered
  return []
}

const __filename = fileURLToPath(import.meta.url);

(async () => {
  try {
    const result = await fetchTmdbTrending(workerData.apiKey, workerData.vodPlaylist);
    parentPort?.postMessage({ isSuccess: true, tmdbData: result });
  } catch (error) {
    parentPort?.postMessage({ isSuccess: false, error: error.message });
  }
})();
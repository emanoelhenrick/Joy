import { parentPort, workerData } from "worker_threads";
import Fuse from "fuse.js"
import { MovieDb } from "moviedb-promise"
import axios from "axios";

async function fetchTmdbTrending(apiKey, vodPlaylist, url) {
  if (!apiKey) return []

  let tmdbData = []
  const moviedb = new MovieDb(apiKey)
  try {
    const res = await moviedb.trending({ language: 'pt', media_type: "movie", time_window: 'week' })
    tmdbData = res.results
  } catch (error) {
    return []
  }

  if (!tmdbData || tmdbData.length === 0) return []

  const fuseMovies = new Fuse(vodPlaylist.playlist, {
    keys: ['name'],
    threshold: 0.4,
    minMatchCharLength: 2
  })

  const filtered = []

  await Promise.all(
    tmdbData.map(async (movie) => {
      const queryPt = movie.title.replace(' -', '')
      const matchesListPt = fuseMovies.search(queryPt).map(i => i.item).slice(0, 3)

      const queryOriginal = movie.original_title.replace(' -', '')
      const matchesListOriginal = fuseMovies.search(queryOriginal).map(i => i.item).slice(0, 3)

      const mergedList = [...matchesListPt, ...matchesListOriginal]

      const noDuplicatedList = []

      for (const match of mergedList) {
        if (noDuplicatedList.find(m => m.stream_id == match.stream_id)) continue
        noDuplicatedList.push(match)
      }
      
      if (noDuplicatedList.length > 0) {
        let perfectMatch;
        for (const match of noDuplicatedList) {
          if (match.stream_id) {
            try {
              const res = await axios.get(url + match.stream_id)
              const tmdbId = res?.data?.info?.tmdb_id
              if (tmdbId && tmdbId == movie.id) perfectMatch = res.data
            } catch (e) {
              continue
            }
          }
        }

        if (perfectMatch) {
          const images = await moviedb.movieImages({ id: movie.id });
          filtered.push({ ...movie, images, perfectMatch });
        }
      }
    })
  );

  if (filtered.length > 0) return filtered.slice(0, 6)
  return []
}

(async () => {
  try {
    const result = await fetchTmdbTrending(workerData.apiKey, workerData.vodPlaylist, workerData.url);
    parentPort?.postMessage({ isSuccess: true, tmdbData: result });
  } catch (error) {
    parentPort?.postMessage({ isSuccess: false, error: error.message });
  }
})();
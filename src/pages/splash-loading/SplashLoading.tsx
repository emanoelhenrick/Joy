import { Progress } from "@/components/ui/progress";
import electronApi from "@/config/electronApi";
import { useLivePlaylist, useSeriesPlaylist, useVodPlaylist } from "@/states/usePlaylistData";
import { makeUrls, usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useTrending } from "@/states/useTrending";
import { useUserData } from "@/states/useUserData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlaylistInfo } from "electron/core/models/PlaylistInfo";
import { SeriesPlaylistProps } from "electron/core/models/SeriesModels";
import { VodPlaylistProps } from "electron/core/models/VodModels";
import Fuse from "fuse.js";
import { MovieDb } from "moviedb-promise";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export function SplashLoading() {
  const navigate = useNavigate();
  const queryClient = useQueryClient()

  const [progress, setProgress] = useState(0)

  const updateUrls = usePlaylistUrl(state => state.updateUrls)
  const updateUserData = useUserData(state => state.updateUserData)
  const updateVodPlaylistState = useVodPlaylist(state => state.update)
  const updateSeriesPlaylistState = useSeriesPlaylist(state => state.update)
  const updateLivePlaylistState = useLivePlaylist(state => state.update)
  const updateMatches = useTrending(state => state.updateMatches)

  const { isSuccess, data  } = useQuery({ queryKey: ['playlistExists'], queryFn: electronApi.getMetadata, staleTime: Infinity })
  const { data: tmdbData } = useQuery({ queryKey: ['tmdb-trending'], queryFn: fetchTrending  })

  async function fetchTrending() {
    if (!import.meta.env.VITE_TMDB_API_KEY) return
    const moviedb = new MovieDb(import.meta.env.VITE_TMDB_API_KEY)
    const res = await moviedb.trending({ media_type: 'all', time_window: 'week', language: 'pt-BR'})
    return res.results
  }

  function filterTrending(vodData: VodPlaylistProps, seriesData: SeriesPlaylistProps) {
    if (!tmdbData) return
    const fuseMovies = new Fuse(vodData.playlist, {
      keys: ['name'],
      threshold: 0,
      minMatchCharLength: 2
    })

    const fuseSeries = new Fuse(seriesData.playlist, {
      keys: ['name'],
      threshold: 0,
      minMatchCharLength: 2
    })

    const filtered: any[] = []
    tmdbData.forEach(info => {
      if (info.media_type === 'movie') {
        const matchesList = fuseMovies.search(info.title!).map(i => i.item)
        if (matchesList.length > 0) filtered.push({ ...info, matches: matchesList }) 
      } else {
        const matchesList = fuseSeries.search(info.name!).map(i => i.item)
        if (matchesList.length > 0) filtered.push({ ...info, matches: matchesList }) 
      }
    })
    return filtered
  }

  async function updateStates(info: PlaylistInfo, profile: string) {
    const userData = await electronApi.getUserData(profile)
    setProgress(20)

    const vodData = await electronApi.getLocalVodPlaylist(info.name)
    setProgress(40)

    const seriesData = await electronApi.getLocalSeriesPlaylist(info.name)
    setProgress(60)

    const liveData = await electronApi.getLocalLivePlaylist(info.name)
    setProgress(80)

    const filteredTrending = filterTrending(vodData, seriesData)
    updateMatches(filteredTrending!)
    setProgress(99)

    const urls = makeUrls(info)
    updateUrls(urls)

    updateVodPlaylistState(vodData)
    updateSeriesPlaylistState(seriesData)
    updateLivePlaylistState(liveData)
    updateUserData(userData)

    navigate(`/dashboard/home/${info.name}`)
  }

  useEffect(() => {
    if (isSuccess) {
      if (data.playlists.length === 0) return navigate('/initial')
      const currentPlaylist = data.playlists.find(p => p.name == data.currentPlaylist.name)!
      queryClient.removeQueries()
      updateStates(currentPlaylist, data.currentPlaylist.profile)
    }
  }, [isSuccess])

  return (
    <div className="w-full h-screen flex flex-col gap-1 text-sm items-center justify-center">
      <p className="animate-pulse">Loading...</p>
      <Progress className="transition w-72 h-1" value={progress} />
    </div>
  )
}
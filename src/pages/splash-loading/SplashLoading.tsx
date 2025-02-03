import electronApi from "@/config/electronApi";
import { useLivePlaylist, useSeriesPlaylist, useVodPlaylist } from "@/states/usePlaylistData";
import { makeUrls, usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useTrending } from "@/states/useTrending";
import { useUserData } from "@/states/useUserData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlaylistInfo } from "electron/core/models/PlaylistInfo";
import { useEffect } from "react"
import { Fade } from "react-awesome-reveal";
import { useNavigate } from "react-router-dom";

export function SplashLoading() {
  const navigate = useNavigate();
  const queryClient = useQueryClient()

  const updateUrls = usePlaylistUrl(state => state.updateUrls)
  const updateUserData = useUserData(state => state.updateUserData)
  const updateVodPlaylistState = useVodPlaylist(state => state.update)
  const updateSeriesPlaylistState = useSeriesPlaylist(state => state.update)
  const updateLivePlaylistState = useLivePlaylist(state => state.update)
  const updateMatches = useTrending(state => state.updateMatches)

  const { isSuccess, data  } = useQuery({ queryKey: ['playlistExists'], queryFn: electronApi.getMetadata, staleTime: Infinity })

  async function updateStates(info: PlaylistInfo, profile: string) {
    const userData = await electronApi.getUserData(profile)
    const vodData = await electronApi.getLocalVodPlaylist(info.name)
    const seriesData = await electronApi.getLocalSeriesPlaylist(info.name)
    const liveData = await electronApi.getLocalLivePlaylist(info.name)

    const filteredTrending = await electronApi.fetchTmdbTrending({
      apiKey: import.meta.env.VITE_TMDB_API_KEY,
      playlistName: info.name
    })
    updateMatches(filteredTrending!)

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
      <Fade duration={2000}>
        <div className="flex items-center space-x-2">
          <h1 className="text-4xl">JOI</h1>
        </div>
      </Fade>
    </div>
  )
}
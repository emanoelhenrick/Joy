import electronApi from "@/config/electronApi";
import { useLivePlaylist, useSeriesPlaylist, useVodPlaylist } from "@/states/usePlaylistData";
import { makeUrls, usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useUserData } from "@/states/useUserData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlaylistInfo } from "electron/core/models/PlaylistInfo";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";

export function SplashLoading() {
  const queryClient = useQueryClient()
  const navigate = useNavigate();

  const updateUrls = usePlaylistUrl(state => state.updateUrls)
  const updateUserData = useUserData(state => state.updateUserData)

  const updateVodPlaylistState = useVodPlaylist(state => state.update)

  const updateSeriesPlaylistState = useSeriesPlaylist(state => state.update)
  const updateLivePlaylistState = useLivePlaylist(state => state.update)

  const { isSuccess, data  } = useQuery({ queryKey: ['playlistExists'], queryFn: electronApi.getMetadata, staleTime: Infinity })

  async function updateStates(info: PlaylistInfo) {
    const userData = await electronApi.getUserData(info.name)
    const vodData = await electronApi.getLocalVodPlaylist(info.name)
    const seriesData = await electronApi.getLocalSeriesPlaylist(info.name)
    const liveData = await electronApi.getLocalLivePlaylist(info.name)
    const urls = makeUrls(info)

    updateVodPlaylistState(vodData)
    updateSeriesPlaylistState(seriesData)
    updateLivePlaylistState(liveData)
    updateUrls(urls)
    updateUserData(userData)

    navigate(`/dashboard/home/${info.name}`)
  }

  useEffect(() => {
    if (isSuccess) {
      if (data.playlists.length === 0) return navigate('/initial')
      const currentPlaylist = data.playlists.find(p => p.name == data.currentPlaylist)!
      updateStates(currentPlaylist)
      queryClient.removeQueries()
    }
  }, [isSuccess])

  return (
    <div></div>
  )
}
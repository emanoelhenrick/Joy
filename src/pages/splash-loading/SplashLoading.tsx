import electronApi from "@/config/electronApi";
import { makeUrls, usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useUserData } from "@/states/useUserData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";

export function SplashLoading() {
  const queryClient = useQueryClient()
  const navigate = useNavigate();

  const updateUrls = usePlaylistUrl(state => state.updateUrls)
  const updateUserData = useUserData(state => state.updateUserData)
  
  const { isSuccess, data  } = useQuery({ queryKey: ['playlistExists'], queryFn: electronApi.getMetadata, staleTime: Infinity })

  async function setUserData(playlistName: string) {
    const userData = await electronApi.getUserData(playlistName)
    updateUserData(userData)
  }

  useEffect(() => {
    if (isSuccess) {
      if (data.playlists.length === 0) return navigate('/initial')
      const currentPlaylist = data.playlists.find(p => p.name == data.currentPlaylist)!
      const urls = makeUrls(currentPlaylist)
      setUserData(currentPlaylist.name)
      updateUrls(urls)
      queryClient.removeQueries()
      navigate(`/dashboard/vod/${currentPlaylist.name}`)
    }
  }, [isSuccess])

  return (
    <div></div>
  )
}
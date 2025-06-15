import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import electronApi from "@/config/electronApi";
import { useLivePlaylist, useSeriesPlaylist, useVodPlaylist } from "@/states/usePlaylistData";
import { makeUrls, usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useUserData } from "@/states/useUserData";
import { PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { PlaylistInfo } from "electron/core/models/PlaylistInfo";
import { useEffect, useState } from "react"
import { Fade } from "react-awesome-reveal";
import { useNavigate } from "react-router-dom";

export function SplashLoading() {
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false)
  const [allReady, setAllReady] = useState({ playlistName: '', path: false })
  const [hasUpdated, setHasUpdated] = useState(false)
  const updateUrls = usePlaylistUrl(state => state.updateUrls)
  const updateUserData = useUserData(state => state.updateUserData)
  const updateVodPlaylistState = useVodPlaylist(state => state.update)
  const updateSeriesPlaylistState = useSeriesPlaylist(state => state.update)
  const updateLivePlaylistState = useLivePlaylist(state => state.update)

  const { isSuccess, data  } = useQuery({ queryKey: ['playlistExists'], queryFn: electronApi.getMetadata, staleTime: Infinity })

  async function updateStates(info: PlaylistInfo, profile: string) {
    const userData = await electronApi.getUserData(profile)
    const vodData = await electronApi.getLocalVodPlaylist(info.name)
    const seriesData = await electronApi.getLocalSeriesPlaylist(info.name)
    const liveData = await electronApi.getLocalLivePlaylist(info.name)

    const urls = makeUrls(info)
    updateUrls(urls)

    updateVodPlaylistState(vodData)
    updateSeriesPlaylistState(seriesData)
    updateLivePlaylistState(liveData)
    updateUserData(userData)

    setAllReady(prev => ({ ...prev, playlistName: info.name }))

    const platform = electronApi.getPlatform()
    if (platform === 'win32' || data!.vlcPath.length < 1) {
      setOpenDialog(true)
    } else {
      setAllReady(prev => ({ ...prev, path: true }))
    }
  }

  async function updateVlcPath() {
    const path = await electronApi.updateVLCPath()
    if (path) {
      setOpenDialog(false)
      setAllReady(prev => ({ ...prev, path: true }))
    }
  }

  useEffect(() => {
    if (isSuccess && !hasUpdated) {
      if (data.playlists.length === 0) return navigate('/initial')
      const currentPlaylist = data.playlists.find(p => p.name == data.currentPlaylist.name)!
      setHasUpdated(true)
      updateStates(currentPlaylist, data.currentPlaylist.profile)
    }
  }, [isSuccess, hasUpdated])

  useEffect(() => {
    if (allReady.playlistName && allReady.path) navigate(`/dashboard/home/${allReady.playlistName}`)
  }, [allReady])

  return (
    <div className="w-full h-screen flex flex-col gap-1 text-sm items-center justify-center">
      <Dialog open={openDialog}>
        <DialogContent className="w-96 items-center justify-center" aria-describedby={undefined}>
          <DialogTitle className="hidden" />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">This program uses VLC Player for media playback.</h1>
            <span className="text-muted-foreground">Please select the destination of VLC on your computer</span>
            <Button onClick={updateVlcPath} className="mt-4 hover:bg-orange-500">Select</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Fade duration={2000}>
        <div className="flex flex-col items-center gap-6">
          <HugeiconsIcon strokeWidth={1} icon={PlayIcon} className={`color-primary fill-white size-32 rotate-90`} />
        </div>
      </Fade>
    </div>
  )
}
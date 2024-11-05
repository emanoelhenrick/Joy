import { Button } from "@/components/ui/button";
import electronApi from "@/config/electronApi";
import { Clapperboard, Film, RotateCw, Settings, Tv } from "lucide-react";
import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import { SettingsPage } from "@/pages/settings";
import { usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useQueryClient } from "@tanstack/react-query";
import { RxUpdate } from "react-icons/rx";
import { useToast } from "@/hooks/use-toast";

export function MenuBar() {
  const queryClient = useQueryClient()
  const [updating, setUpdating] = useState(false)
  const [playlistName, setPlaylistName] = useState<string>()
  const { urls } = usePlaylistUrl()
  const navigate = useNavigate();
  const location = useLocation()
  const { toast } = useToast()

  function changeTab(tab: string) {
    navigate(`/dashboard/${tab}/${playlistName}`)
  }

  async function getPlaylistName() {
    const metadata = await electronApi.getMetadata()
    setPlaylistName(metadata.currentPlaylist)
  }

  async function updateCurrentPlaylist() {
    if (playlistName) {
      setUpdating(true)
      try {
        await electronApi.authenticateUser(urls.getAuthenticateUrl)
      } catch (error) {
        setUpdating(false)
        return toast({
          title: 'The playlist could not be updated',
          description: 'Check if the playlist data is correct.',
          variant: "destructive"
        })
      }
      await electronApi.updateVod({ playlistUrl: urls.getAllVodUrl, categoriesUrl: urls.getAllVodCategoriesUrl, name: playlistName })
      await electronApi.updateSeries({ playlistUrl: urls.getAllSeriesUrl, categoriesUrl: urls.getAllSeriesCategoriesUrl, name: playlistName })
      await electronApi.updateLive({ playlistUrl: urls.getAllLiveUrl, categoriesUrl: urls.getAllLiveCategoriesUrl, name: playlistName })
      await electronApi.updatedAtPlaylist(playlistName)
      queryClient.removeQueries()
      setUpdating(false)
      toast({ title: 'The playlist was updated'})
    }
  }

  useEffect(() => {
    getPlaylistName()
  }, [])

  return (
    <div className="flex z-50 flex-col justify-center px-2.5 h-full gap-5 fixed">
      <Fade cascade direction="up" triggerOnce duration={500}>
      <Button variant='ghost' onClick={() => changeTab('vod')} className={`h-fit gap-2 ${location.pathname.includes('vod') ? 'opacity-90' : 'opacity-30'}`}>
        <Film />
      </Button>
      <Button variant='ghost' onClick={() => changeTab('series')} className={`h-fit gap-2 ${location.pathname.includes('series') ? 'opacity-90' : 'opacity-30'}`}>
        <Clapperboard />
      </Button>
      <Button variant='ghost' onClick={() => changeTab('live')} className={`h-fit gap-2 ${location.pathname.includes('live') ? 'opacity-90' : 'opacity-30'}`}>
        <Tv />
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='ghost' className={`h-fit gap-2 opacity-30`}>
            <Settings />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-1/2 max-w-[700px] items-center p-8" aria-describedby={undefined}>
          <DialogTitle className="hidden">Settings</DialogTitle>
          {playlistName && <SettingsPage currentPlaylist={playlistName} />}
        </DialogContent>
      </Dialog>
      <Button variant='ghost' onClick={updateCurrentPlaylist} className={`h-fit gap-2 opacity-30`}>
        <RotateCw className={`${updating && 'animate-spin'}`} />
      </Button>
      </Fade>
    </div>
  )
}
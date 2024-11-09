import { Button } from "@/components/ui/button";
import electronApi from "@/config/electronApi";
import { Clapperboard, Film, House, RotateCw, Search, Settings, Tv, TvMinimal } from "lucide-react";
import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import { SettingsPage } from "@/pages/settings";
import { usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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

  const mediaTabs = ['vod', 'series', 'live']

  return (
    <div className="flex flex-col justify-between items-center border-r fixed px-1 py-4 h-full">
        <Fade cascade direction="up" triggerOnce duration={500}>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="flex flex-col justify-center gap-5">
          <Button variant='ghost' className={`h-fit gap-2 ${location.pathname.includes('home') ? 'opacity-90' : 'opacity-30'}`}>
            <House />
          </Button>
          <Button variant='ghost' onClick={() => changeTab('vod')} className={`h-fit gap-2 ${mediaTabs.some(tab => location.pathname.includes(tab)) ? 'opacity-90' : 'opacity-30'}`}>
            <TvMinimal />
          </Button>
          <Button variant='ghost' className={`h-fit gap-2 ${location.pathname.includes('search') ? 'opacity-90' : 'opacity-30'}`}>
            <Search />
          </Button>
        </div>
      

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
      {/* <Button variant='ghost' onClick={updateCurrentPlaylist} className={`h-fit gap-2 opacity-30`}>
        <RotateCw className={`${updating && 'animate-spin'}`} />
      </Button> */}
      </Fade>
      
    </div>
  )
}
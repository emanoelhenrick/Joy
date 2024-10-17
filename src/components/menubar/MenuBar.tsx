import { Button } from "@/components/ui/button";
import electronApi from "@/config/electronApi";
import { Clapperboard, Film, Settings, Tv } from "lucide-react";
import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import { SettingsPage } from "@/pages/settings";

export function MenuBar() {
  const [playlistName, setPlaylistName] = useState<string>()
  const navigate = useNavigate();
  const location = useLocation()

  function changeTab(tab: string) {
    navigate(`/dashboard/${tab}/${playlistName}`)
  }

  async function getPlaylistName() {
    const metadata = await electronApi.getMetadata()
    setPlaylistName(metadata.currentPlaylist)
  }

  useEffect(() => {
    getPlaylistName()
  }, [])

  return (
    <div className="flex z-50 flex-col justify-center px-2.5 h-full gap-4 fixed">
      <Fade cascade direction="up" triggerOnce duration={500}>
      <Button variant='ghost' onClick={() => changeTab('vod')} className={`h-fit gap-2 ${location.pathname.includes('vod') ? 'opacity-90' : 'opacity-50'}`}>
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
      </Fade>
    </div>
  )
}
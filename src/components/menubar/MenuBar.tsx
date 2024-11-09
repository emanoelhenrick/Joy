import { Button } from "@/components/ui/button";
import electronApi from "@/config/electronApi";
import { House, Search, Settings, TvMinimal } from "lucide-react";
import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import { SettingsPage } from "@/pages/settings";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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

  const mediaTabs = ['vod', 'series', 'live']

  return (
    <div className="flex flex-col justify-between items-center border-r fixed px-1 py-4 h-full">
      <Fade cascade direction="up" triggerOnce duration={500}>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div className="flex flex-col justify-center gap-5">
        <Button variant='ghost' onClick={() => changeTab('home')} className={`h-fit gap-2 ${location.pathname.includes('home') ? 'opacity-90' : 'opacity-30'}`}>
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
      </Fade>
    </div>
  )
}
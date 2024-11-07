import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import electronApi from "@/config/electronApi";
import { useQuery } from "@tanstack/react-query";
import { PlaylistInfo } from "electron/core/models/PlaylistInfo";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function SettingsPage({ currentPlaylist }: { currentPlaylist: string }) {
  const navigate = useNavigate()
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>(currentPlaylist)
  const [playlists, setPlaylists] = useState<PlaylistInfo[]>()

  const { isSuccess, data  } = useQuery({ queryKey: ['metadata'], queryFn: electronApi.getMetadata })

  useEffect(() => {
    if (selectedPlaylist != currentPlaylist) {
      electronApi.changeCurrentPlaylist(selectedPlaylist)
    }
  }, [selectedPlaylist])

  useEffect(() => {
    if (isSuccess) setPlaylists(data.playlists)
  }, [isSuccess])

  useEffect(() => {
    return () => {
      if (selectedPlaylist != currentPlaylist) {
        console.log('mudou');
        navigate('/')
      }
    }
  }, [selectedPlaylist])

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between mb-4">
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl">Settings</h1>
        <Select value={selectedPlaylist} onValueChange={(value) => setSelectedPlaylist(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {playlists && playlists.map(p => <SelectItem key={p.url} value={p.name}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* <h3
        onClick={() => navigate('/initial')}
        className="scroll-m-20 w-fit text-md font-semibold text-muted-foreground tracking-tight cursor-pointer hover:text-primary transition"
        >
          Edit playlist
      </h3> */}

      <h3
        onClick={() => navigate('/initial')}
        className="scroll-m-20 w-fit text-md font-semibold text-muted-foreground tracking-tight cursor-pointer hover:text-primary transition"
        >
          New playlist
      </h3>
    </div>
  )
}
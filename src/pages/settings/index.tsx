import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import electronApi from "@/config/electronApi";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { PlaylistInfo } from "electron/core/models/PlaylistInfo";
import { RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewPlaylistDialog } from "./NewPlaylistDialog";
import { EditPlaylistDialog } from "./EditPlaylistDialog";
import packageJson from "../../../package.json"

export function SettingsPage({ currentPlaylist, updating, updatePlaylist }: { currentPlaylist: string, updating: boolean, updatePlaylist: (b: boolean) => void }) {
  const navigate = useNavigate()
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>(currentPlaylist)
  const [playlists, setPlaylists] = useState<PlaylistInfo[]>()

  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo>()
  const [lastUpdated, setLastUpdated] = useState<any>()

  async function getPlaylistName() {
    const metadata = await electronApi.getMetadata()
    const playlistInfo = metadata.playlists.find(p => p.name === metadata.currentPlaylist.name)
    setPlaylistInfo(playlistInfo)
    setLastUpdated(playlistInfo!.updatedAt)
  }

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
    if (selectedPlaylist != currentPlaylist) {
      navigate('/')
    }
  }, [selectedPlaylist])

  useEffect(() => {
    getPlaylistName()
  }, [])

  async function removePlaylist() {
    await electronApi.removePlaylist(selectedPlaylist)
    navigate('/')
  }

  return (
    <div className="flex flex-col gap-1 relative">
      <div className="flex justify-between mb-4">
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl">Settings</h1>
        <div className="flex items-center gap-2">
          <div onClick={() => updatePlaylist(true)} className={`h-fit gap-2 cursor-pointer hover:opacity-70 transition flex items-center p-1`}>
            <p className="scroll-m-20 text-sm text-muted-foreground">Last updated: {lastUpdated && formatDistanceToNow(new Date(lastUpdated))}</p>
            <RotateCw size={15} className={`text-muted-foreground ${updating && 'animate-spin'}`} />
          </div>
          <Select disabled={updating} value={selectedPlaylist} onValueChange={(value) => setSelectedPlaylist(value)}>
            <SelectTrigger className="w-[180px] hover:bg-secondary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {playlists && playlists.map(p => <SelectItem className="hover:bg-secondary cursor-pointer" key={p.url} value={p.name}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <NewPlaylistDialog />
      <EditPlaylistDialog playlistInfo={playlistInfo!} />

      <AlertDialog>
        <AlertDialogTrigger className="w-fit">
          <h3 className="scroll-m-20  w-fit text-red-400 opacity-80 tracking-tight cursor-pointer hover:text-red-600 transition">
            Remove playlist
          </h3>
        </AlertDialogTrigger>
        <AlertDialogContent className="border-none bg-primary-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will erase all data related to the current playlist forever.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-none shadow-none">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-700 border-none text-primary" onClick={removePlaylist}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <span className="absolute right-0 bottom-0 text-sm text-muted-foreground">v{packageJson.version}</span>
    </div>
  )
}
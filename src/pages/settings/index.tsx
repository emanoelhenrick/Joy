import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import electronApi from "@/config/electronApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { PlaylistInfo } from "electron/core/models/PlaylistInfo";
import { RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewPlaylistDialog } from "./NewPlaylistDialog";
import { EditPlaylistDialog } from "./EditPlaylistDialog";
import packageJson from "../../../package.json"
import { usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useAuthInfo } from "@/states/useAuthInfo";
import { formatExpirationDate } from "@/lib/utils";

export function SettingsPage({ currentPlaylist, updating, updatePlaylist }: { currentPlaylist: string, updating: boolean, updatePlaylist: (b: boolean) => void }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>(currentPlaylist)
  const [playlists, setPlaylists] = useState<PlaylistInfo[]>()

  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo>()
  const [lastUpdated, setLastUpdated] = useState<any>()
  
  const urls = usePlaylistUrl(state => state.urls)
  const { authInfo, updateAuthInfo } = useAuthInfo()

  async function getPlaylistName() {
    const metadata = await electronApi.getMetadata()
    const playlistInfo = metadata.playlists.find(p => p.name === metadata.currentPlaylist.name)
    setPlaylistInfo(playlistInfo)
    setLastUpdated(playlistInfo!.updatedAt)
  }

  async function loadAuthInfo() {
    try {
      const authResponse = await electronApi.authenticateUser(urls.getAuthenticateUrl)
      if (authResponse.user_info) {
        updateAuthInfo({
          status: authResponse.user_info.status,
          exp_date: authResponse.user_info.exp_date
        })
      }
    } catch (error) {
      console.error('Failed to load auth info:', error)
    }
  }

  const { isSuccess, data  } = useQuery({ queryKey: ['metadata'], queryFn: electronApi.getMetadata })

  async function changePlaylist() {
    await electronApi.changeCurrentPlaylist(selectedPlaylist)
    queryClient.removeQueries()
    navigate('/')
  }

  useEffect(() => {
    if (selectedPlaylist != currentPlaylist) {
      changePlaylist()
    }
  }, [selectedPlaylist])

  useEffect(() => {
    if (isSuccess) setPlaylists(data.playlists)
  }, [isSuccess])

  useEffect(() => {
    getPlaylistName()
  }, [])

  useEffect(() => {
    if (urls.getAuthenticateUrl) {
      loadAuthInfo()
    }
  }, [urls.getAuthenticateUrl])

  async function removePlaylist() {
    await electronApi.removePlaylist(selectedPlaylist)
    navigate('/')
  }

  return (
    <div className="flex flex-col gap-1 relative">
      <div className="flex justify-between mb-4">
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl">Settings</h1>
        <div className="flex items-center gap-2">
          <div
            onClick={() => {
              updatePlaylist(true);
              loadAuthInfo()
            }}
            className={`h-fit gap-2 cursor-pointer hover:opacity-70 transition flex items-center p-1`}
            >
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

      <div className="flex justify-between">
        <div>
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
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Account Status</p>
              <p className="text-sm font-medium">{authInfo.status || 'Loading...'}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Expiration Date</p>
              <p className="text-sm font-medium">{authInfo.exp_date ? formatExpirationDate(authInfo.exp_date) : 'Loading...'}</p>
            </div>
          </div>
        </div>
      </div>

      

      

      <span className="absolute right-0 bottom-0 text-sm text-muted-foreground">v{packageJson.version}</span>
    </div>
  )
}
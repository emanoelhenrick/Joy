import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import electronApi from "@/config/electronApi";
import { useToast } from "@/hooks/use-toast";
import { useLivePlaylist, useSeriesPlaylist, useVodPlaylist } from "@/states/usePlaylistData";
import { usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { PlaylistInfo } from "electron/core/models/PlaylistInfo";
import { RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function SettingsPage({ currentPlaylist, setUpdatingMenu, setUpdatingError }: { currentPlaylist: string, setUpdatingMenu: (bool: boolean) => void, setUpdatingError: (b: boolean) => void }) {
  const navigate = useNavigate()
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>(currentPlaylist)
  const [playlists, setPlaylists] = useState<PlaylistInfo[]>()

  const queryClient = useQueryClient()
  const [updating, setUpdating] = useState(false)
  const [playlistName, setPlaylistName] = useState<string>()
  const [lastUpdated, setLastUpdated] = useState<any>()
  const { urls } = usePlaylistUrl()
  const { toast } = useToast()

  const updateVodPlaylistState = useVodPlaylist(state => state.update)
  const updateSeriesPlaylistState = useSeriesPlaylist(state => state.update)
  const updateLivePlaylistState = useLivePlaylist(state => state.update)

  async function getPlaylistName() {
    const metadata = await electronApi.getMetadata()
    setLastUpdated(metadata.playlists.find(p => p.name === metadata.currentPlaylist.name)!.updatedAt)
    setPlaylistName(metadata.currentPlaylist.name)
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

  async function updateCurrentPlaylist() {
    if (playlistName) {
      setUpdatingMenu(true)
      setUpdating(true)
      const isValidated = await electronApi.authenticateUser(urls.getAuthenticateUrl)
      if (!isValidated) {
        setUpdating(false)
        setUpdatingError(true)
        return toast({
          title: 'The playlist could not be updated',
          description: 'Check if the playlist data is correct.',
          variant: "destructive"
        })
      }
      setUpdatingError(false)
      toast({ title: `Updating playlist ${playlistName}`})
      const vodData = await electronApi.updateVod({ playlistUrl: urls.getAllVodUrl, categoriesUrl: urls.getAllVodCategoriesUrl, name: playlistName })
      const seriesData = await electronApi.updateSeries({ playlistUrl: urls.getAllSeriesUrl, categoriesUrl: urls.getAllSeriesCategoriesUrl, name: playlistName })
      const liveData = await electronApi.updateLive({ playlistUrl: urls.getAllLiveUrl, categoriesUrl: urls.getAllLiveCategoriesUrl, name: playlistName })
      await electronApi.updatedAtPlaylist(playlistName)
      queryClient.removeQueries()

      updateVodPlaylistState(vodData)
      updateSeriesPlaylistState(seriesData)
      updateLivePlaylistState(liveData)

      setUpdating(false)
      setUpdatingMenu(false)
      setLastUpdated(Date.now())
      toast({ title: 'The playlist was updated'})
    }
  }

  async function removePlaylist() {
    await electronApi.removePlaylist(selectedPlaylist)
    navigate('/')
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between mb-4">
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl">Settings</h1>
        <div className="flex items-center gap-2">
          <div onClick={updateCurrentPlaylist} className={`h-fit gap-2 cursor-pointer hover:opacity-70 transition flex items-center p-1`}>
            <p className="scroll-m-20 text-sm text-muted-foreground">Last updated: {lastUpdated && formatDistanceToNow(new Date(lastUpdated))}</p>
            <RotateCw size={15} className={`text-muted-foreground ${updating && 'animate-spin'}`} />
          </div>
          <Select value={selectedPlaylist} onValueChange={(value) => setSelectedPlaylist(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {playlists && playlists.map(p => <SelectItem key={p.url} value={p.name}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <h3
        onClick={() => navigate('/initial')}
        className="scroll-m-20 w-fit text-muted-foreground tracking-tight cursor-pointer hover:text-primary transition"
        >
          New playlist
      </h3>

      <AlertDialog>
        <AlertDialogTrigger className="w-fit">
          <h3 className="scroll-m-20  w-fit text-red-400 opacity-80 tracking-tight cursor-pointer hover:text-red-600 transition">
            Remove playlist
          </h3>
        </AlertDialogTrigger>
        <AlertDialogContent className="border-none bg-primary-foreground/50">
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
  )
}
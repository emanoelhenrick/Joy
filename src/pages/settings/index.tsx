import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import electronApi from "@/config/electronApi";
import { useToast } from "@/hooks/use-toast";
import { useLivePlaylist, useSeriesPlaylist, useVodPlaylist } from "@/states/usePlaylistData";
import { usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useUserData } from "@/states/useUserData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { PlaylistInfo } from "electron/core/models/PlaylistInfo";
import { RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function SettingsPage({ currentPlaylist, setUpdatingMenu }: { currentPlaylist: string, setUpdatingMenu: (bool: boolean) => void }) {
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
    setLastUpdated(metadata.playlists.find(p => p.name === metadata.currentPlaylist)!.updatedAt)
    setPlaylistName(metadata.currentPlaylist)
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
    return () => {
      if (selectedPlaylist != currentPlaylist) {
        console.log('mudou');
        navigate('/')
      }
    }
  }, [selectedPlaylist])

  useEffect(() => {
    getPlaylistName()
  }, [])

  async function updateCurrentPlaylist() {
    if (playlistName) {
      setUpdatingMenu(true)
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
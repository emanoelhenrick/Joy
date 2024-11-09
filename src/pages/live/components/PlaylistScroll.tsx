import InfiniteScroll from "react-infinite-scroller";
import { Cover } from "../../../components/Cover";
import { LiveProps } from "electron/core/models/LiveModels";
import { usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useEffect, useState } from "react";
import { useUserData } from "@/states/useUserData";
import { Heart } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/MediaInfoDialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { VideoPlayer } from "@/components/player";
import { Fade } from "react-awesome-reveal";
import { LiveImage } from "./Image";

interface PlaylistScrollProps {
  playlist: LiveProps[]
}

export default function PlaylistScroll({ playlist }: PlaylistScrollProps) {
  const { urls } = usePlaylistUrl()

  const [update, setUpdate] = useState(false)
  const [favorites, setFavorites] = useState<string[]>()
  const [selectedLiveUrl, setSelectLiveUrl] = useState<string | undefined>(undefined)
  const { userData, updateFavorite } = useUserData()

  async function updateRender(streamId: string) {
    updateFavorite(streamId, 'live')
    setUpdate(prev => !prev)
  }

  useEffect(() => {
    if (userData && userData.live) {
      const udlist = []
      for (const vd of userData.live) {
        if (vd.favorite == true) udlist.push(vd.id)
      }
      setFavorites(udlist)
    }
    
  }, [userData, update])

  return (
    <div>
      {selectedLiveUrl && (
        <Dialog open={(selectedLiveUrl.length > 1) && true}>
          <DialogContent className="w-fit items-center justify-center" aria-describedby={undefined}>
            <div onClick={() => setSelectLiveUrl(undefined)} className="cursor-pointer z-50 absolute right-14 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <Cross2Icon className="h-8 w-8" />
            </div>
            <DialogTitle className="hidden">{'live'}</DialogTitle>
            <div className="w-screen">
              <VideoPlayer url={selectedLiveUrl!} type="live" />
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div className={`w-full flex h-full ${selectedLiveUrl && 'invisible'}`}>
        <div className={`flex flex-wrap h-fit gap-x-8 gap-y-8 ml-6`}>
          <Fade duration={200}>
          {playlist.map((live) => {
            const isFavorite = favorites?.includes(live.stream_id.toString())
            return (
              <div
                className="flex flex-col hover:scale-105 transition bg-secondary w-56 p-4 rounded-xl gap-3 h-fit cursor-pointer relative group"
                key={live.stream_id}
              >
                <div className="flex gap-2 items-center" onClick={() => setSelectLiveUrl(`${urls.getLiveStreamUrl}${live.stream_id}.m3u8`)}>
                  <LiveImage src={live.stream_icon} />
                  <h3 className="text-wrap text-muted-foreground text-sm font-bold">{live.name}</h3>
                </div>
                {/* {isFavorite ? (
                  <Heart onClick={() => updateRender(live.stream_id.toString())} size={20} fill="red" strokeWidth={0} className={`absolute top-3 right-4 ${isFavorite ? 'visible' : 'invisible' }`}  />
                ) : (
                  <Heart onClick={() => updateRender(live.stream_id.toString())} size={20} className={`absolute top-3 right-4 opacity-0 group-hover:opacity-100 transition hover:scale-110`}  />
                )}  */}
                
              </div>
            )
          })}
          </Fade>
        </div>
      </div>
    </div>
  )
}
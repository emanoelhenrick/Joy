import { LiveProps } from "electron/core/models/LiveModels";
import { usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useEffect, useState } from "react";
import { useUserData } from "@/states/useUserData";
import { LiveImage } from "./Image";
import { LivePlayer } from "./LivePlayer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useInView } from "react-intersection-observer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HeartCrack } from "lucide-react";



export default function LivePlaylistScroll({ playlist, fetchMore, hasMore, firstChannel }: { playlist: LiveProps[], fetchMore: () => void, hasMore: boolean, firstChannel: LiveProps }) {
  const { urls } = usePlaylistUrl()
  const [update, setUpdate] = useState(false)
  const [favorites, setFavorites] = useState<string[]>()
  const [isSupported, setIsSupported] = useState(true)

  const [selectedLiveUrl, setSelectLiveUrl] = useState<string | undefined>(
    `${firstChannel ? urls.getLiveStreamUrl + firstChannel.stream_id + '.m3u8' :
    urls.getLiveStreamUrl + playlist[0].stream_id + '.m3u8'}`
  )
  const [live, setLive] = useState(firstChannel || playlist[0])
  const { userData, updateFavorite } = useUserData()

  const { ref, inView, entry } = useInView({ threshold: 0 });

  async function updateRender(streamId: string) {
    updateFavorite(streamId, 'live')
    setUpdate(prev => !prev)
  }

  function handleChannel(live: LiveProps) {
    setLive(live)
    setIsSupported(true)
    setSelectLiveUrl(`${urls.getLiveStreamUrl}${live.stream_id}.m3u8`)
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

  useEffect(() => {
    if (inView && hasMore) fetchMore()
  }, [inView])

  return (
      <div className={`w-full flex mb-6`}>
        <div className={`flex w-full pr-2 h-fit`}>
          <div className="w-full max-w-xl pb-4">
            <ScrollArea className="w-full h-[90vh] rounded-md">
              <div className="flex flex-col mb-4 gap-2 pr-4">
                {playlist.map((live) => {
                  const isFavorite = favorites?.includes(live.stream_id.toString())
                  return (
                    <div
                      className="flex hover:scale-95 transition bg-secondary w-full h-12 p-2 rounded-sm gap-3 cursor-pointer relative group"
                      key={live.stream_id}
                      onClick={() => handleChannel(live)}
                    >
                      <div className="flex gap-4 items-center">
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
                  <div ref={ref} />
                </div>
                <ScrollBar color="blue" />
            </ScrollArea>
          </div>
          <div className="w-full h-fit flex flex-col gap-4">
            { isSupported ? (
              <LivePlayer url={selectedLiveUrl!} setIsSupported={setIsSupported} />
            ) : (
              <div className="bg-secondary relative flex items-center justify-center rounded-lg aspect-video">
                <p className="absolute text-muted-foreground">unsupported</p>
              </div>
            )}
            <div className="flex gap-2 items-center">
              <LiveImage src={live.stream_icon} />
              <h3 className="text-xl">{live.name}</h3>
            </div>
              <Alert className="w-fit">
                <AlertDescription className="text-muted-foreground">
                  Some video formats have not yet been implemented but will soon be!
                </AlertDescription>
              </Alert>
          </div>
        </div>
      </div>
  )
}
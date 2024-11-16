import { LiveProps } from "electron/core/models/LiveModels";
import { usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useEffect, useState } from "react";
import { useUserData } from "@/states/useUserData";
import { LiveImage } from "./Image";
import { LivePlayer } from "./LivePlayer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { decode } from 'js-base64';

export default function LivePlaylistScroll({ playlist, fetchMore, hasMore, firstChannel }: { playlist: LiveProps[], fetchMore: () => void, hasMore: boolean, firstChannel: LiveProps }) {
  const queryClient = useQueryClient()
  
  const { urls } = usePlaylistUrl()
  const [update, setUpdate] = useState(false)
  const [favorites, setFavorites] = useState<string[]>()
  const [isSupported, setIsSupported] = useState(true)

  const [selectedLiveUrl, setSelectLiveUrl] = useState<string | undefined>(
    `${firstChannel ? urls.getLiveStreamUrl + firstChannel.stream_id + '.m3u8' :
    urls.getLiveStreamUrl + playlist[0].stream_id + '.m3u8'}`
  )
  const [live, setLive] = useState(firstChannel || playlist[0])
  const { data, isSuccess } = useQuery({ queryKey: [`liveEpg`], queryFn: () =>  axios.get(urls.getLiveEpgUrl + live.stream_id)})
  const { userData, updateFavorite } = useUserData()

  console.log(data);

  const { ref, inView } = useInView({ threshold: 0 });

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
    queryClient.refetchQueries()
  }, [selectedLiveUrl])

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
      <div className={`w-full flex mb-6 ml-2`}>
        <div className={`flex w-full gap-2 pr-2 h-fit`}>
          <div className="w-full max-w-lg pb-4">
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
          <div className="w-full pr-4 h-fit flex flex-col">
            { isSupported ? (
              <LivePlayer url={selectedLiveUrl!} setIsSupported={setIsSupported} title={live.name} />
            ) : (
              <div className="bg-secondary relative flex items-center justify-center rounded-lg aspect-video">
                <p className="absolute text-muted-foreground">unsupported</p>
              </div>
            )}
            <div className="flex gap-3 items-center mt-4">
              <LiveImage src={live.stream_icon} /> 
              <h3 className="text-md">{live.name}</h3>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className={`relative inline-flex rounded-full h-2 w-2 bg-red-500`}/>
              </span>
              <p className="text-md text-muted-foreground">{data?.data.epg_listings[0] && decode(data?.data.epg_listings[0].title)}</p>
            </div>
            <div className="">
            {data?.data.epg_listings[0] && (
              <p className="text-sm p-2 border rounded-md mt-2 text-muted-foreground">{decode(data?.data.epg_listings[0].description)}</p>
            )}
            
            </div>
            {/* <ScrollArea className="whitespace-nowrap rounded-md">
              <div className="flex w-96 mt-2 space-x-2 pb-4 whitespace-nowrap rounded-md">
                {data?.data.epg_listings && data?.data.epg_listings.map(p =>
                  <p className="bg-secondary text-sm text-muted-foreground py-1 px-3 rounded-md">{decode(p.title)}</p>
                )}
              </div>
             <ScrollBar color="blue" orientation="horizontal" />
            </ScrollArea> */}
          </div>
        </div>
      </div>
  )
}
import { LiveProps } from "electron/core/models/LiveModels";
import { usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useCallback, useEffect, useState } from "react";
import { useUserData } from "@/states/useUserData";
import { LiveImage } from "./Image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { decode } from 'js-base64';
import { Button } from "@/components/ui/button";
import { FaPlay } from "react-icons/fa";
import electronApi from "@/config/electronApi";
import { VlcDialog } from "./VlcDialog";
import { Fade } from "react-awesome-reveal";
import { format } from "date-fns";

export default function LivePlaylistScroll({ playlist, fetchMore, hasMore, firstChannel }: { playlist: LiveProps[], fetchMore: () => void, hasMore: boolean, firstChannel: LiveProps }) {
  const queryClient = useQueryClient()

  const { urls } = usePlaylistUrl()
  const [update, setUpdate] = useState(false)
  const [favorites, setFavorites] = useState<string[]>()
  const [isRunning, setIsRunning] = useState(false)

  const [selectedLiveUrl, setSelectLiveUrl] = useState<string | undefined>(
    `${firstChannel ? urls.getLiveStreamUrl + firstChannel.stream_id + '.m3u8' :
      urls.getLiveStreamUrl + playlist[0].stream_id + '.m3u8'}`
  )
  const [live, setLive] = useState(firstChannel || playlist[0])
  const { data, isFetching } = useQuery({ queryKey: [`liveEpg`], queryFn: () => axios.get(urls.getLiveEpgUrl + live.stream_id) })
  const { userData, updateFavorite } = useUserData();

  const { ref, inView } = useInView({ threshold: 0 });

  async function updateRender(streamId: string) {
    updateFavorite(streamId, 'live')
    setUpdate(prev => !prev)
  }

  function handleChannel(live: LiveProps) {
    setLive(live)
    setSelectLiveUrl(`${urls.getLiveStreamUrl}${live.stream_id}.m3u8`)
  }

  async function launchVlc() {
    if (!selectedLiveUrl) return
    await electronApi.launchVLC({ path: selectedLiveUrl, startTime: 0 })
    setIsRunning(true)
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

  const renderItem = useCallback((live: LiveProps) => {
    return (
      <div
        className="flex hover:bg-secondary transition w-full p-3 gap-3 cursor-pointer relative group"
        key={live.stream_id}
        onClick={() => handleChannel(live)}
      >
        <div className="flex gap-4 items-center">
          <LiveImage src={live.stream_icon} />
          <span className="text-wrap text-muted-foreground text-lg font-bold">{live.name}</span>
        </div>
      </div>
    )
  }, [])

  return (
    <div className={`w-full flex mb-6 ml-2`}>
      <div className={`grid grid-cols-[1fr_2fr] w-full gap-3 h-fit mr-6`}>
        <div className="w-full pb-4">
          <ScrollArea className="w-full h-[90vh] bg-primary-foreground rounded-lg">
            <div className="flex flex-col mb-4">
              {playlist.map((live) => renderItem(live))}
              <div ref={ref} className="w-full h-1" />
            </div>
            <ScrollBar color="blue" />
          </ScrollArea>
        </div>
        <div className="w-full pr-4 h-fit flex flex-col rounded-lg p-4 bg-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <LiveImage key={live.stream_icon} src={live.stream_icon} />
              <span className="text-2xl block leading-none line-clamp-1 text-nowrap">{live.name}</span>
            </div>

            <Button key='vlc' onClick={launchVlc} size={"lg"} className="bg-primary transition-none relative overflow-hidden w-fit">
              <div className="flex gap-2">
                <FaPlay />
                <span className="leading-none text-base">Watch</span>
              </div>
            </Button>
          </div>

          {(!isFetching && data && data.data.epg_listings[0]) && (
          <Fade duration={500}>
            <div className="mt-4 space-y-1 p-4 rounded-lg bg-secondary">
              <div className="flex items-center gap-4 justify-between">
                <span className="text-xl line-clamp-1 text-nowrap font-bold">{data?.data.epg_listings[0] && decode(data?.data.epg_listings[0].title)}</span>
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-muted-foreground">{data && format(data?.data.epg_listings[0].start, 'p')}</span>
                  <span className="text-sm text-muted-foreground">-</span>
                  <span className="text-sm text-muted-foreground">{data && format(data?.data.epg_listings[0].stop || data?.data.epg_listings[0].end, 'p')}</span>
                </div>
              </div>
              {data?.data.epg_listings[0] && (
                <p className="rounded-md text-muted-foreground">{decode(data?.data.epg_listings[0].description)}</p>
              )}
            </div>
          </Fade>
          )}

          
        </div>
      </div>

      {isRunning && (
        <VlcDialog
          open={isRunning}
          closeDialog={() => setIsRunning(false)}
        />
      )}
    </div>
  )
}
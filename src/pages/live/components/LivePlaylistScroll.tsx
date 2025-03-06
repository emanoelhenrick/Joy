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
import { useMeasure } from "@uidotdev/usehooks";

export default function LivePlaylistScroll({ playlist }: { playlist: LiveProps[] }) {
  const queryClient = useQueryClient()
  const [ref, { width }] = useMeasure();

  const { urls } = usePlaylistUrl()
  const [update, setUpdate] = useState(false)
  const [favorites, setFavorites] = useState<string[]>()
  const [isRunning, setIsRunning] = useState(false)
  const columns = Math.floor(width! / 180)

  const [selectedLiveUrl, setSelectLiveUrl] = useState<string | undefined>()
  const [live, setLive] = useState(playlist[0])
  const { userData, updateFavorite } = useUserData();

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
    if (!isRunning) launchVlc()
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

  const renderItem = useCallback((live: LiveProps) => {
    return (
      <div className="w-full h-fit cursor-pointer relative group drop-shadow-lg" key={live.stream_id}>
        <div onClick={() => handleChannel(live)} className="group-hover:opacity-70 transition-transform group-hover:scale-95 bg-secondary p-4 flex flex-col items-center justify-center aspect-square rounded-full">
          <LiveImage src={live.stream_icon} />
        </div>
        <h1 className="text-base font-medium line-clamp-2 text-center mt-2">{live.name}</h1>
      </div>
    )
  }, [])

  return (
    <div className="h-fit rounded-xl">
      <div className={`w-full`}>
        <div
          ref={ref}
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          className={`grid w-full gap-8 h-fit`}
          >
          <Fade triggerOnce duration={250}>
            {playlist!.map((item: any) => renderItem(item))}
          </Fade>
        </div>
      </div>

      <VlcDialog open={isRunning} closeDialog={() => setIsRunning(false)} />
    </div>
  )
}
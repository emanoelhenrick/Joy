import { ScrollArea } from "@/components/ui/scroll-area"
import { SeriesProps } from "electron/core/models/SeriesModels"
import { VodProps } from "electron/core/models/VodModels"
import { useCallback, useEffect, useRef, useState } from "react"
import { HomeCover } from "./HomeCover"
import { ScrollBarStyled } from "@/components/ScrollBarStyled"
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, PlayIcon } from '@hugeicons/core-free-icons';
import { usePlaylistUrl } from "@/states/usePlaylistUrl"
import electronApi from "@/config/electronApi"
import { formatDurationFromSeconds } from "@/utils/formatDuration"

interface WatchingScrollProps {
  watchingVod: VodProps[]
  watchingSeries: SeriesProps[]
  setSelectedSeries: (series: SeriesProps) => void
  setSelectedVod: (vod: VodProps) => void
}

export function WatchingScroll({ watchingVod, watchingSeries, setSelectedSeries, setSelectedVod }: WatchingScrollProps) {
  const watchingList = [ ...watchingVod, ...watchingSeries ].sort((a, b) => b.updatedAt! - a.updatedAt!)
  const [snapshots, setSnapshots] = useState<any[]>()
  const { urls } = usePlaylistUrl()

  async function getAllSnapshots() {
    const snaps = []
    for (let item of watchingVod) {
      const image64 = await electronApi.getSnapshot(`${urls.getVodStreamUrl}${item.stream_id}.${item.container_extension}`)
      snaps.push({ id: item.stream_id, image: image64, type: 'vod' })
    }

    for (let item of watchingSeries) {
      const baseUrl = new URL(urls.getSeriesStreamUrl).origin
      const image64 = await electronApi.getSnapshot(`${baseUrl}${item.series_id}`)
      snaps.push({ id: item.series_id, image: image64, type: 'series' })
    }

    setSnapshots(snaps)
  }

  useEffect(() => {
    getAllSnapshots()
  }, [setSelectedVod, snapshots])

  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const scrollAmount = 600;

  const handleScrollRight = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        left: scrollViewportRef.current.scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const handleScrollLeft = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        left: scrollViewportRef.current.scrollLeft - scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const renderSeriesItem = useCallback((series: SeriesProps) => {
    if (!watchingSeries) return
    if (!snapshots) return
    const snapshot = snapshots.find(s => (s.id === series.series_id) && (s.type === 'series'))
    if (!snapshot) return

    return (
      <div onClick={() => setSelectedSeries(series)} className="aspect-video transition duration-200 group cursor-pointer relative w-96 h-full flex justify-center items-center">
        <div className="w-full h-full relative"> 
          <div className="absolute w-56 bottom-4 left-32 z-10">
            <div className="w-full">
              <h1 className="font-semibold text-white">{series.name}</h1>
              <h1 className="text-sm font-medium opacity-60 mb-2">{series.watchingNow?.episode}</h1>

              <div className="w-full h-1 opacity-90">
                <div className="relative w-full h-full">
                  <div style={{ width: `${series.watchingNow!.progress * 100}%`}} className="transition absolute z-10 h-full bg-primary rounded-full" />
                  <div className="w-full transition h-full absolute bottom-0 bg-primary/10 rounded-full" />
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-full w-full border border-primary-foreground rounded-3xl overflow-hidden">
            <img className="h-full opacity-80 w-full object-cover group-hover:opacity-60 " src={snapshot.image} alt="" />
            <div className="z-0 bottom-0 w-full absolute h-full bg-gradient-to-b from-transparent to-background/90" />
          </div>
        </div>
      
        <div className="absolute drop-shadow-2xl bg-background rounded-2xl overflow-hidden -bottom-8 left-4 group-hover:-translate-y-4 ease-in-out transition duration-200">
          <img src={series.cover} className="w-24" alt="" />
        </div>
      </div>
      )
  }, [snapshots, watchingSeries])
  
  const renderVodItem = useCallback((movie: VodProps) => {
    if (!watchingVod) return
    if (!snapshots) return
    const snapshot = snapshots.find(s => (s.id === movie.stream_id) && (s.type === 'vod'))
    if (!snapshot) return

    const duration = formatDurationFromSeconds(movie && movie.currentTime!)

    return (
      <div onClick={() => setSelectedVod(movie)} className="aspect-video transition duration-200 group cursor-pointer relative w-96 h-full flex justify-center items-center">
        <div className="w-full h-full relative"> 
          <div className="absolute w-56 bottom-4 left-32 z-10">
            <div className="w-full">
              <h1 className="font-semibold text-white">{movie.name}</h1>
              <h1 className="text-sm font-medium opacity-60 mb-2">{duration}</h1>
            </div>

            <div className="w-full h-1 opacity-90">
              <div className="relative w-full h-full">
                <div style={{ width: `${movie.progress! * 100}%`}} className="transition absolute z-10 h-full bg-primary rounded-full" />
                <div className="w-full transition h-full absolute bottom-0 bg-primary/10 rounded-full" />
              </div>
            </div>
          </div>

          <div className="relative h-full w-full border border-primary-foreground rounded-3xl overflow-hidden">
            <img className="h-full opacity-70 w-full object-cover group-hover:opacity-60 " src={snapshot.image} alt="" />
            <div className="z-0 bottom-0 w-full absolute h-full bg-gradient-to-b from-transparent to-background/90" />
          </div>
        </div>
      
        <div className="absolute drop-shadow-2xl bg-background rounded-2xl overflow-hidden -bottom-8 left-4 group-hover:-translate-y-4 ease-in-out transition duration-200">
          <img src={movie.stream_icon} className="w-24" alt="" />
        </div>
      </div>
      )
  }, [watchingVod, snapshots])

  return ((watchingVod.length > 0) || (watchingSeries.length > 0)) && (
    <div className="w-full my-0 rounded-2xl space-y-4">
      <div className='flex gap-4 justify-between items-center'>
        <h1 className="text-lg font-medium">Watching</h1>

        <div className="flex gap-2 pr-6 opacity-0 hover:opacity-100">
          <HugeiconsIcon icon={ArrowRight01Icon} className="rotate-180 size-6 cursor-pointer hover:opacity-80 text-primary transition" onClick={handleScrollLeft} />
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-6 cursor-pointer hover:opacity-80 text-primary transition" onClick={handleScrollRight} />
        </div>
      </div>
      <ScrollArea ref={scrollViewportRef} className="w-full relative h-64 ">
        <div  className="flex w-max space-x-4 h-fit rounded-md pr-8">
          {watchingList && watchingList.map((m: any) => {
            if (m.stream_id) return renderVodItem(m as VodProps)
            return renderSeriesItem(m as SeriesProps)
          })}
        </div>
        {/* <div className="w-16 right-0 top-0 absolute h-full bg-gradient-to-r from-transparent to-background/95" /> */}
        <ScrollBarStyled orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
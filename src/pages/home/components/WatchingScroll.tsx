import { ScrollArea } from "@/components/ui/scroll-area"
import { SeriesProps } from "electron/core/models/SeriesModels"
import { VodProps } from "electron/core/models/VodModels"
import { useCallback, useEffect, useState } from "react"
import { HomeCover } from "./HomeCover"
import { ScrollBarStyled } from "@/components/ScrollBarStyled"
import { Fade } from "react-awesome-reveal"

interface WatchingScrollProps {
  watchingVod: VodProps[]
  watchingSeries: SeriesProps[]
  setSelectedSeries: (series: SeriesProps) => void
  setSelectedVod: (vod: VodProps) => void
}

export function WatchingScroll({ watchingVod, watchingSeries, setSelectedSeries, setSelectedVod }: WatchingScrollProps) {
  const watchingList = [ ...watchingVod, ...watchingSeries ].sort((a, b) => b.updatedAt! - a.updatedAt!)

  const renderSeriesItem = useCallback((series: SeriesProps) => {
    if (!watchingSeries) return
    return (
      <div
        className="hover:scale-95 transition duration-75 gap-3 w-fit h-fit cursor-pointer relative hover:opacity-70"
        key={series.series_id}
        onClick={() => setSelectedSeries(series)}
      >
        <HomeCover src={series.cover} title={series.name} />
        <span className="absolute bottom-5 left-3 z-10 opacity-70 text-sm font-semibold">{series.watchingNow?.episode}</span>
        <div className="absolute w-full h-1 bottom-3 px-3 z-10">
          <div className="relative w-full h-full">
            <div style={{ width: `${(series.watchingNow!.progress! * 100)}%`}} className="h-full absolute bg-primary rounded-full z-10" />
            <div className="h-full bg-primary-foreground w-full absolute rounded-full" />
          </div>
        </div>
        <div className="inset-0 w-full absolute h-full bg-gradient-to-b from-transparent to-background/90" />
      </div>
      )
  }, [watchingSeries])
  
  const renderVodItem = useCallback((movie: VodProps) => {
    if (!watchingVod) return
    return (
      <div
        className="hover:scale-95 transition duration-75 gap-3 w-fit h-fit cursor-pointer relative hover:opacity-70"
        key={movie.num}
        onClick={() => setSelectedVod(movie)}
      >
        <HomeCover src={movie.stream_icon} title={movie.name} />
        <div className="absolute w-full h-1 bottom-3 px-3 z-10">
          <div className="relative w-full h-full">
            <div style={{ width: `${(movie.progress! * 100)}%`}} className="h-full absolute bg-primary rounded-full z-10" />
            <div className="h-full bg-primary-foreground w-full absolute rounded-full" />
          </div>
        </div>
        <div className="inset-0 w-full absolute h-full bg-gradient-to-b from-transparent to-background/50" />
      </div>
      )
  }, [watchingVod])

  return ((watchingVod.length > 0) || (watchingSeries.length > 0)) && (
  <Fade duration={500} triggerOnce>
    <div>
      <div className='flex gap-2 items-center mb-2'>
        <h1 className="text-2xl font-bold">Continue watching</h1>
      </div>
        <ScrollArea className="w-full rounded-md">
          <div className="flex w-max space-x-4 pb-5 pr-4 rounded-md">
            {watchingList && watchingList.map((m: any) => {
              if (m.stream_id) return renderVodItem(m as VodProps)
              return renderSeriesItem(m as SeriesProps)
            })}
          </div>
          <ScrollBarStyled orientation="horizontal" />
        </ScrollArea>
    </div>
  </Fade>
  )
}
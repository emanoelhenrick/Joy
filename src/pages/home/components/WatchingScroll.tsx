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
  const [watchingTab, setWatchingTab] = useState((watchingSeries.length < 1) && (watchingVod.length > 0) ? 1 : 0)

  const isSeries = watchingSeries.length > 0
  const isVod = watchingVod.length > 0

  useEffect(() => {
    if (!isSeries && isVod) return setWatchingTab(1)
    return setWatchingTab(0)
  }, [isSeries, isVod])

  const renderSeriesItem = useCallback((series: SeriesProps) => {
    if (!watchingSeries) return
    return (
      <div
        className="hover:scale-95 transition gap-3 w-fit h-fit cursor-pointer relative hover:opacity-70"
        key={series.series_id}
        onClick={() => setSelectedSeries(series)}
      >
        <HomeCover src={series.cover} title={series.name} />
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
      </div>
      )
  }, [watchingVod])

  return ((watchingVod.length > 0) || (watchingSeries.length > 0)) && (
  <Fade duration={500} triggerOnce>
    <div>
      <div className='flex gap-2 items-center mb-3'>
      {/* <span className={`h-fit text-secondary bg-primary text-sm py-0.5 px-3 w-fit rounded-md transition gap-2`}>
        Watching
        </span> */}
        <h1 className="text-xl font-bold -mb-1">Continue watching</h1>
        {/* {watchingSeries!.length > 0 && (
          <span
            onClick={() => setWatchingTab(0)}
            className={`h-fit ${watchingTab == 0 ? 'bg-secondary text-primary' : 'text-muted-foreground'} cursor-pointer text-sm py-0.5 px-3 w-fit rounded-md transition gap-2 hover:opacity-80`}>
            Series
          </span>
        )}
        {watchingVod!.length > 0 && (
          <span
            onClick={() => setWatchingTab(1)}
            className={`h-fit ${watchingTab == 1 ? 'bg-secondary text-primary' : 'text-muted-foreground'} cursor-pointer text-sm py-0.5 px-3 w-fit rounded-md transition gap-2 hover:opacity-80`}>
            Movies
          </span>
        )} */}
      </div>
        <ScrollArea className="w-full rounded-md">
          <div className="flex w-max space-x-4 pb-5 pr-4 rounded-md">

            <div className="aspect-video w-96 bg-background rounded-xl relative overflow-hidden group cursor-pointer">
              <img className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-80 transition" src="https://www.rogerebert.com/wp-content/uploads/2024/07/John-Wick.jpg" alt="" />
              <div className="inset-0 w-full absolute h-full bg-gradient-to-b from-transparent to-background/80" />
              <div className="flex flex-col p-6 absolute bottom-0">
                <span className="text-muted-foreground text-base">1h 34m</span>
                <h1 className="font-bold text-lg">John Wick: De volta ao jogo</h1>
                <div className="h-1 w-40 bg-primary mt-1 rounded-full" />
              </div>
            </div>

            <div className="aspect-video w-96 bg-background rounded-xl relative overflow-hidden group">
              <img className="w-full h-full object-cover group-hover:scale-105 transition" src="https://i.guim.co.uk/img/media/7e7a90ce9e2c2618eea77fc10e6057ad38e01262/0_0_3000_1801/master/3000.jpg?width=465&dpr=1&s=none&crop=none" alt="" />
              <div className="inset-0 w-full absolute h-full bg-gradient-to-b from-transparent to-background/80" />
              <div className="flex flex-col p-6 absolute bottom-0">
                <span className="text-muted-foreground text-base">E1:S1 23m</span>
                <h1 className="font-bold text-lg">Mr. Robot</h1>
                <div className="h-1 w-24 bg-primary mt-1 rounded-full" />
              </div>
            </div>

            {/* {(watchingTab == 0 && watchingSeries) && watchingSeries!.sort((a, b) => b.updatedAt! - a.updatedAt!).map(series => renderSeriesItem(series))}
            {(watchingTab == 1 && watchingVod) && watchingVod!.sort((a, b) => b.updatedAt! - a.updatedAt!).map(movie => renderVodItem(movie))} */}
          </div>
          <ScrollBarStyled orientation="horizontal" />
        </ScrollArea>
    </div>
  </Fade>
  )
}
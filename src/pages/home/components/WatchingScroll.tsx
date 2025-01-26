import { Cover } from "@/components/Cover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { SeriesProps } from "electron/core/models/SeriesModels"
import { VodProps } from "electron/core/models/VodModels"
import { useEffect, useState } from "react"
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

  return ((watchingVod.length > 0) || (watchingSeries.length > 0)) && (
  <div>
    <div className='flex gap-2 items-center mb-3'>
     <span className={`h-fit text-secondary bg-primary text-sm py-0.5 px-3 w-fit rounded-md transition gap-2`}>
       Continue watching
      </span>
      {watchingSeries!.length > 0 && (
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
      )}
    </div>
      <ScrollArea className="w-full rounded-md">
        <div className="flex w-max space-x-3 pb-5 pr-4 rounded-md">
          <Fade duration={200} triggerOnce>
            {(watchingTab == 0 && watchingSeries) && watchingSeries!.sort((a, b) => b.updatedAt! - a.updatedAt!).map(series => {
              return (
              <div
                className="flex flex-col hover:scale-95 transition gap-3 w-fit h-fit cursor-pointer relative"
                key={series.series_id}
                onClick={() => setSelectedSeries(series)}
              >
                <Cover src={series.cover} title={series.name} />
              </div>
              )
            })}
            {(watchingTab == 1 && watchingVod) && watchingVod!.sort((a, b) => b.updatedAt! - a.updatedAt!).map(movie => {
              return (
                <div
                  className="flex flex-col hover:scale-95 transition gap-3 w-fit h-fit cursor-pointer relative"
                  key={movie.num}
                  onClick={() => setSelectedVod(movie)}
                  >
                  <Cover src={movie.stream_icon} title={movie.name} />
                </div>
              )
            })}
          </Fade>
        </div>
        <ScrollBar color="blue" orientation="horizontal" />
      </ScrollArea>
  </div>
  )
}
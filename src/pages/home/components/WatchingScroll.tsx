import { ScrollArea } from "@/components/ui/scroll-area"
import { SeriesProps } from "electron/core/models/SeriesModels"
import { VodProps } from "electron/core/models/VodModels"
import { useCallback, useRef } from "react"
import { HomeCover } from "./HomeCover"
import { ScrollBarStyled } from "@/components/ScrollBarStyled"
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

interface WatchingScrollProps {
  watchingVod: VodProps[]
  watchingSeries: SeriesProps[]
  setSelectedSeries: (series: SeriesProps) => void
  setSelectedVod: (vod: VodProps) => void
}

export function WatchingScroll({ watchingVod, watchingSeries, setSelectedSeries, setSelectedVod }: WatchingScrollProps) {
  const watchingList = [ ...watchingVod, ...watchingSeries ].sort((a, b) => b.updatedAt! - a.updatedAt!)

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
    return (
      <section>
        <div
          className="hover:scale-95 rounded-3xl overflow-hidden transition duration-75 gap-3 w-fit h-fit cursor-pointer relative hover:opacity-70"
          key={series.series_id}
          onClick={() => setSelectedSeries(series)}
        >
          <HomeCover src={series.cover} title={series.name} />
          <div className="absolute bottom-6 left-5 z-10">
            <h1 className="opacity-80 text-base font-semibold drop-shadow-lg">{series.watchingNow?.episode}</h1>
          </div>
          <div className="absolute w-full h-1 bottom-3 px-5 z-10">
            <div className="relative w-full h-full">
              <div style={{ width: `${(series.watchingNow!.progress! * 100)}%`}} className="h-full absolute bg-primary rounded-full z-10" />
              <div className="h-full bg-primary/20 w-full absolute rounded-full" />
            </div>
          </div>
          <div className="inset-0 w-full absolute scale-105 h-full bg-gradient-to-b from-transparent to-background/95" />
        </div>
      </section>
      )
  }, [watchingSeries])
  
  const renderVodItem = useCallback((movie: VodProps) => {
    if (!watchingVod) return
    return (
      <section>
        <div
          className="hover:scale-95 rounded-3xl overflow-hidden transition duration-75 gap-3 w-fit h-fit cursor-pointer relative hover:opacity-70"
          key={movie.num}
          onClick={() => setSelectedVod(movie)}
        >
          <HomeCover src={movie.stream_icon} title={movie.name} />
          <div className="absolute w-full h-1 bottom-3 px-5 z-10">
            <div className="relative w-full h-full">
              <div style={{ width: `${(movie.progress! * 100)}%`}} className="h-full absolute bg-primary rounded-full z-10" />
              <div className="h-full bg-primary/20 w-full absolute rounded-full" />
            </div>
          </div>
          <div className="inset-0 w-full absolute h-full bg-gradient-to-b from-transparent to-background/50" />
        </div>
      </section>
      )
  }, [watchingVod])

  return ((watchingVod.length > 0) || (watchingSeries.length > 0)) && (
    <div className="w-full my-8 rounded-2xl space-y-4">
      <div className='flex gap-4 justify-between items-center'>
        <h1 className="text-xl font-medium">Watching</h1>

        <div className="flex gap-2">
          <HugeiconsIcon icon={ArrowRight01Icon} className="rotate-180 size-6 cursor-pointer hover:opacity-80 text-primary transition" onClick={handleScrollLeft} />
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-6 cursor-pointer hover:opacity-80 text-primary transition" onClick={handleScrollRight} />
        </div>
      </div>
      <ScrollArea ref={scrollViewportRef} className="w-full relative">
        <div  className="flex w-max space-x-4 rounded-md">
          {watchingList && watchingList.map((m: any) => {
            if (m.stream_id) return renderVodItem(m as VodProps)
            return renderSeriesItem(m as SeriesProps)
          })}
        </div>
        <div className="w-16 right-0 top-0 absolute h-full bg-gradient-to-r from-transparent to-background/95" />
        <ScrollBarStyled orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
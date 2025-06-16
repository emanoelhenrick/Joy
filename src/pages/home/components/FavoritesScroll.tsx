import { ScrollArea } from "@/components/ui/scroll-area"
import { SeriesProps } from "electron/core/models/SeriesModels"
import { VodProps } from "electron/core/models/VodModels"
import { useCallback, useRef } from "react"
import { HomeCover } from "./HomeCover"
import { PiArrowLeft, PiArrowRight } from "react-icons/pi";
import { Fade } from "react-awesome-reveal"
import { ScrollBarStyled } from "@/components/ScrollBarStyled"
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

interface WatchingScrollProps {
  favoritesVod: VodProps[]
  favoritesSeries: SeriesProps[]
  setSelectedSeries: (series: SeriesProps) => void
  setSelectedVod: (vod: VodProps) => void
}

export function FavoritesScroll({ favoritesVod, favoritesSeries, setSelectedSeries, setSelectedVod }: WatchingScrollProps) {
  const favoritesList = [ ...favoritesVod, ...favoritesSeries ]

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
      if (!favoritesSeries) return
      return (
        <div
          className="hover:scale-95 rounded-3xl overflow-hidden duration-75 transition gap-3 w-fit h-fit cursor-pointer relative hover:opacity-70"
          key={series.series_id}
          onClick={() => setSelectedSeries(series)}
        >
          <HomeCover src={series.cover} title={series.name} />
        </div>
        )
    }, [favoritesSeries])
    
    const renderVodItem = useCallback((movie: VodProps) => {
      if (!favoritesVod) return
      return (
        <div
          className="hover:scale-95 rounded-3xl overflow-hidden transition duration-75 gap-3 w-fit h-fit cursor-pointer relative hover:opacity-70"
          key={movie.num}
          onClick={() => setSelectedVod(movie)}
        >
          <HomeCover src={movie.stream_icon} title={movie.name} />
        </div>
        )
    }, [favoritesVod])

  return ((favoritesVod.length > 0) || (favoritesSeries.length > 0)) && (
    <Fade duration={500} triggerOnce>
      <div className="w-full my-8 rounded-2xl space-y-4">
        <div className='flex gap-4 justify-between items-center'>
          <h1 className="text-lg font-medium">Favorites</h1>

          <div className="flex gap-2 pr-6 opacity-60">
            <HugeiconsIcon icon={ArrowRight01Icon} className="rotate-180 size-6 cursor-pointer hover:opacity-80 text-primary transition" onClick={handleScrollLeft} />
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-6 cursor-pointer hover:opacity-80 text-primary transition" onClick={handleScrollRight} />
          </div>
        </div>
        <ScrollArea ref={scrollViewportRef} className="w-full relative">
          <div  className="flex w-max space-x-4 rounded-md pr-8">
            {favoritesList && favoritesList.map((m: any) => {
              if (m.stream_id) return renderVodItem(m as VodProps)
              return renderSeriesItem(m as SeriesProps)
            })}
          </div>
          <div className="w-16 right-0 top-0 absolute h-full bg-gradient-to-r from-transparent to-background/95" />
          <ScrollBarStyled orientation="horizontal" />
        </ScrollArea>
      </div>
    </Fade>
  )
}
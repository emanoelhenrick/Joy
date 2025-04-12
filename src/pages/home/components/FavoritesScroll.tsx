import { ScrollArea } from "@/components/ui/scroll-area"
import { SeriesProps } from "electron/core/models/SeriesModels"
import { VodProps } from "electron/core/models/VodModels"
import { useCallback, useRef } from "react"
import { HomeCover } from "./HomeCover"
import { PiArrowLeft, PiArrowRight } from "react-icons/pi";
import { Fade } from "react-awesome-reveal"
import { ScrollBarStyled } from "@/components/ScrollBarStyled"

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
          className="hover:scale-95 rounded-2xl overflow-hidden duration-75 transition gap-3 w-fit h-fit cursor-pointer relative hover:opacity-70"
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
          className="hover:scale-95 rounded-2xl overflow-hidden transition duration-75 gap-3 w-fit h-fit cursor-pointer relative hover:opacity-70"
          key={movie.num}
          onClick={() => setSelectedVod(movie)}
        >
          <HomeCover src={movie.stream_icon} title={movie.name} />
        </div>
        )
    }, [favoritesVod])

  return ((favoritesVod.length > 0) || (favoritesSeries.length > 0)) && (
    <Fade duration={500} triggerOnce>
      <div className="w-full p-5 rounded-2xl bg-primary-foreground">
        <div className='flex justify-between items-center mb-4'>
          <div className="flex gap-3 items-center">
            <h1 className="uppercase text-lg font-semibold">Favorites</h1>
            <h1 className="text-muted-foreground text-sm font-medium p-0">{favoritesList.length}</h1>
          </div>

          <div className="flex gap-6">
            <PiArrowLeft strokeWidth={8} className="size-5 cursor-pointer text-muted-foreground hover:text-primary transition" onClick={handleScrollLeft} />
            <PiArrowRight strokeWidth={8}  className="size-5 cursor-pointer text-muted-foreground hover:text-primary transition" onClick={handleScrollRight} />
          </div>
        </div>
        <ScrollArea ref={scrollViewportRef} className="w-full">
          <div  className="flex w-max space-x-4 rounded-md">
            {favoritesList && favoritesList.map((m: any) => {
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
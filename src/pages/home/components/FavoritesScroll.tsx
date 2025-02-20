import { ScrollArea } from "@/components/ui/scroll-area"
import { SeriesProps } from "electron/core/models/SeriesModels"
import { VodProps } from "electron/core/models/VodModels"
import { useCallback } from "react"
import { HomeCover } from "./HomeCover"
import { ScrollBarStyled } from "@/components/ScrollBarStyled"
import { Fade } from "react-awesome-reveal"

interface WatchingScrollProps {
  favoritesVod: VodProps[]
  favoritesSeries: SeriesProps[]
  setSelectedSeries: (series: SeriesProps) => void
  setSelectedVod: (vod: VodProps) => void
}

export function FavoritesScroll({ favoritesVod, favoritesSeries, setSelectedSeries, setSelectedVod }: WatchingScrollProps) {
  const favoritesList = [ ...favoritesVod, ...favoritesSeries ]

  const renderSeriesItem = useCallback((series: SeriesProps) => {
      if (!favoritesSeries) return
      return (
        <div
          className="hover:scale-95 duration-75 transition gap-3 w-fit h-fit cursor-pointer relative hover:opacity-70"
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
          className="hover:scale-95 transition duration-75 gap-3 w-fit h-fit cursor-pointer relative hover:opacity-70"
          key={movie.num}
          onClick={() => setSelectedVod(movie)}
        >
          <HomeCover src={movie.stream_icon} title={movie.name} />
        </div>
        )
    }, [favoritesVod])

  return ((favoritesVod.length > 0) || (favoritesSeries.length > 0)) && (
    <Fade duration={500} triggerOnce>
      <div>
      <div className='flex gap-2 items-center mb-2'>
        <h1 className="text-2xl font-bold">Favorites</h1>
      </div>
      <ScrollArea className="w-full">
        <div className="flex w-max space-x-3 pb-5 pr-4 rounded-md">
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { SeriesProps } from "electron/core/models/SeriesModels"
import { VodProps } from "electron/core/models/VodModels"
import { useCallback, useEffect, useState } from "react"
import { FaStar } from "react-icons/fa"
import { HomeCover } from "./HomeCover"
import { ScrollBarStyled } from "@/components/ScrollBarStyled"

interface WatchingScrollProps {
  favoritesVod: VodProps[]
  favoritesSeries: SeriesProps[]
  setSelectedSeries: (series: SeriesProps) => void
  setSelectedVod: (vod: VodProps) => void
  updateFavorites: (id: string, type: string) => void
}

export function FavoritesScroll({ favoritesVod, favoritesSeries, setSelectedSeries, setSelectedVod, updateFavorites }: WatchingScrollProps) {
  const [favoritesTab, setFavoritesTab] = useState(0)

  const isSeries = favoritesSeries.length > 0
  const isVod = favoritesVod.length > 0

  useEffect(() => {
    if (!isSeries && isVod) return setFavoritesTab(1)
    return setFavoritesTab(0)
  }, [isSeries, isVod])

  const renderSeriesItem = useCallback((series: SeriesProps) => {
      if (!favoritesSeries) return
      return (
        <div
          className="hover:scale-95 transition gap-3 w-fit h-fit cursor-pointer relative hover:opacity-70"
          key={series.series_id}
          onClick={() => setSelectedSeries(series)}
        >
          <div className="group-hover:opacity-70">
            <HomeCover src={series.cover} title={series.name} />
          </div>
          <FaStar onClick={() => updateFavorites(series.series_id.toString(), 'series')} size={20} strokeWidth={0} className={`absolute fill-yellow-400 top-3 right-4`} />
        </div>
        )
    }, [favoritesSeries])
    
    const renderVodItem = useCallback((movie: VodProps) => {
      if (!favoritesVod) return
      return (
        <div
          className="hover:scale-95 transition gap-3 w-fit h-fit cursor-pointer relative hover:opacity-70"
          key={movie.num}
          onClick={() => setSelectedVod(movie)}
        >
          <div className="group-hover:opacity-70">
            <HomeCover src={movie.stream_icon} title={movie.name} />
          </div>
        </div>
        )
    }, [favoritesVod])

  return ((favoritesVod.length > 0) || (favoritesSeries.length > 0)) && (
    <div>
      <div className='flex gap-2 items-center mb-3'>
        <span className={`h-fit text-secondary bg-primary text-sm py-0.5 px-3 w-fit rounded-md transition gap-2`}>
          Favorites
        </span>
        {favoritesSeries!.length > 0 && (
          <span
            onClick={() => setFavoritesTab(0)}
            className={`h-fit ${favoritesTab == 0 ? 'bg-secondary text-primary' : 'text-muted-foreground'} cursor-pointer text-sm py-0.5 px-3 w-fit rounded-md transition gap-2 hover:opacity-80`}>
            Series
          </span>
        )}
        {favoritesVod!.length > 0 && (
          <span
            onClick={() => setFavoritesTab(1)}
            className={`h-fit ${favoritesTab == 1 ? 'bg-secondary text-primary' : 'text-muted-foreground'} cursor-pointer text-sm py-0.5 px-3 w-fit rounded-md transition gap-2 hover:opacity-80`}>
            Movies
          </span>
        )}
      </div>
      <ScrollArea className="w-full rounded-md ">
        <div className="flex w-max space-x-3 pb-5 pr-4 rounded-md">
          {(favoritesTab == 0 && favoritesSeries) && favoritesSeries!.map(series => renderSeriesItem(series))}
          {(favoritesTab == 1 && favoritesVod) && favoritesVod!.map(movie => renderVodItem(movie))}
        </div>
        <ScrollBarStyled orientation="horizontal" />
      </ScrollArea>
  </div>
  )
}
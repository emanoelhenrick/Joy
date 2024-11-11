import { Cover } from "@/components/Cover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { SeriesProps } from "electron/core/models/SeriesModels"
import { VodProps } from "electron/core/models/VodModels"
import { useEffect, useState } from "react"
import { Fade } from "react-awesome-reveal"
import { FaStar } from "react-icons/fa"

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

  return ((favoritesVod.length > 0) || (favoritesSeries.length > 0)) && (
    <div>
    <div className='flex gap-2'>
     <p className={`h-fit border text-muted-foreground bg-secondary text-sm py-0.5 px-4 w-fit mb-3 rounded-full transition gap-2`}>
       Favorites
      </p>
      {favoritesSeries!.length > 0 && (
        <p
          onClick={() => setFavoritesTab(0)}
          className={`h-fit border ${favoritesTab == 0 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'} cursor-pointer text-sm py-0.5 px-3 w-fit mb-4 rounded-full transition gap-2`}>
          Series
        </p>
      )}
      {favoritesVod!.length > 0 && (
        <p
          onClick={() => setFavoritesTab(1)}
          className={`h-fit border ${favoritesTab == 1 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'} cursor-pointer text-sm py-0.5 px-3 w-fit mb-4 rounded-full transition gap-2`}>
          Movies
        </p>
      )}
    </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-4 pb-6 whitespace-nowrap rounded-md">
          <Fade duration={200} triggerOnce>
            {(favoritesTab == 0 && favoritesSeries) && favoritesSeries!.map(series => {
              return (
              <div
                className="flex flex-col hover:scale-95 transition gap-3 w-fit h-fit cursor-pointer relative"
                key={series.series_id}
              >
                <div onClick={() => setSelectedSeries(series)}>
                  <Cover src={series.cover} title={series.name} />
                </div>
                <h3 className="truncate w-36 text-xs text-muted-foreground">{series.title || series.name}</h3>
                <FaStar onClick={() => updateFavorites(series.series_id.toString(), 'series')} size={20} strokeWidth={0} className={`absolute fill-yellow-400 top-3 right-4`} />
              </div>
              )
            })}
            {(favoritesTab == 1 && favoritesVod) && favoritesVod!.map(movie => {
              return (
                <div
                  className="flex flex-col hover:scale-95 transition gap-3 w-fit h-fit cursor-pointer relative"
                  key={movie.num}
                  >
                  <div onClick={() => setSelectedVod(movie)}>
                    <Cover src={movie.stream_icon} title={movie.name} />
                  </div>
                  <h3 className="truncate w-36 text-xs text-muted-foreground">{movie.title || movie.name}</h3>
                  <FaStar onClick={() => updateFavorites(movie.stream_id.toString(), 'vod')} size={20} strokeWidth={0} className={`absolute fill-yellow-400 top-3 right-4`} />
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
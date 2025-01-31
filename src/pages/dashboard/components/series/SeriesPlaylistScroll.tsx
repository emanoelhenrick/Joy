import { SeriesProps } from "electron/core/models/SeriesModels";
import { Cover } from "@/components/Cover";
import { useCallback, useEffect, useState } from "react";
import { useUserData } from "@/states/useUserData";
import { Dialog, DialogContent, DialogTitle } from "@/components/MediaInfoDialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useDebounce } from "use-debounce";
import { FaStar } from "react-icons/fa";
import { SeriesPage } from "./info";
import { useMeasure } from "@uidotdev/usehooks";

export default function SeriesPlaylistScroll({ data }: any) {
  const [ref, { width }] = useMeasure();
  const columns = Math.floor(width! / 154)

  const playlist: SeriesProps[] = data
  const [update, setUpdate] = useState(false)
  const [favorites, setFavorites] = useState<string[]>()
  const [selectedSeries, setSelectedSeries] = useState<SeriesProps>()
  const { userData, updateFavorite } = useUserData()
  const [updateDebounced] = useDebounce(update, 50)

  async function updateRender(streamId: string) {
    updateFavorite(streamId, 'series')
    setUpdate(prev => !prev)
  }

  useEffect(() => {
    if (userData && userData.series) {
      const udlist = ['']
      for (const vd of userData.series) {
        if (vd.favorite == true) udlist.push(vd.id!)
      }
      setFavorites(udlist)
    }
    
  }, [userData, updateDebounced])

  const renderItem = useCallback((series: SeriesProps) => {
    const isFavorite = favorites?.includes(series.series_id.toString()) 

    return (
      <div
        className="w-full h-fit cursor-pointer relative group"
        key={series.series_id + '-' + series.num}
        >
        <div onClick={() => setSelectedSeries(series)} className="group-hover:opacity-70 transition-transform group-hover:scale-95">
          <Cover src={series.cover} title={series.name} />
        </div>
        {isFavorite ? (
            <FaStar onClick={() => updateRender(series.series_id.toString())} size={20} strokeWidth={0} className={`absolute fill-yellow-400 top-3 right-4 ${isFavorite ? 'visible' : 'invisible' }`}  />
          ) : (
            <FaStar onClick={() => updateRender(series.series_id.toString())} size={20} className={`absolute fill-primary top-3 right-4 opacity-0 group-hover:opacity-100 transition hover:scale-110`}  />
          )}
      </div>
      )
    }, [playlist, favorites])

  return (
    <div className="h-fit rounded-xl">
      {selectedSeries && (
        <Dialog open={selectedSeries && true}>
          <DialogContent className="w-fit items-center justify-center" aria-describedby={undefined}>
            <div
              onClick={() => setSelectedSeries(undefined)}
              className="cursor-pointer absolute right-14 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-20">
              <Cross2Icon className="size-8 p-1 rounded-md bg-background/30 backdrop-blur-lg" />
            </div>
            <DialogTitle className="hidden" />
            <div className="w-screen">
              <SeriesPage seriesId={selectedSeries!.series_id.toString()} cover={selectedSeries!.cover} />
            </div>
          </DialogContent>
        </Dialog>
      )}
        <div className={`w-full flex`}>
          <div
            ref={ref}
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            className={`grid w-full h-fit gap-3`}
            >
            {playlist.map((series) => renderItem(series))}
          </div>
        </div>
    </div>
  )
}
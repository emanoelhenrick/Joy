import { SeriesProps } from "electron/core/models/SeriesModels";
import { Cover } from "@/components/Cover";
import { useCallback, useEffect, useState } from "react";
import { useUserData } from "@/states/useUserData";
import { Dialog, DialogContent, DialogTitle } from "@/components/MediaInfoDialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useDebounce } from "use-debounce";
import { SeriesPage } from "./info";
import { useMeasure } from "@uidotdev/usehooks";
import { Fade } from "react-awesome-reveal";

export default function SeriesPlaylistScroll({ data }: any) {
  const [ref, { width }] = useMeasure();
  const columns = Math.floor(width! / 154)

  const playlist: SeriesProps[] = data
  const [update, setUpdate] = useState(false)
  const [favorites, setFavorites] = useState<string[]>()
  const [selectedSeries, setSelectedSeries] = useState<SeriesProps>()
  const { userData, updateFavorite } = useUserData()
  const [updateDebounced] = useDebounce(update, 50)

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

    return (
      <div
        className="w-full h-fit cursor-pointer relative group"
        key={series.series_id + '-' + series.num}
        >
        <div onClick={() => setSelectedSeries(series)} className="group-hover:opacity-70 transition-transform group-hover:scale-95">
          <Cover src={series.cover} title={series.name} />
        </div>
      </div>
      )
    }, [playlist, favorites])

  return (
    <div className="h-fit rounded-xl">
      <Dialog open={selectedSeries && true}>
        <DialogContent className="w-screen h-screen items-center justify-center" aria-describedby={undefined}>
          <div
            onClick={() => setSelectedSeries(undefined)}
            className="cursor-pointer absolute right-16 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-20">
            <Cross2Icon className="size-8 p-1 rounded-md bg-background/50" />
          </div>
          <DialogTitle className="hidden" />
          <SeriesPage seriesId={selectedSeries ? selectedSeries!.series_id.toString() : ''} cover={selectedSeries ? selectedSeries!.cover : ''} />
        </DialogContent>
      </Dialog>
      <div className={`w-full flex`}>
        <div
          ref={ref}
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          className={`grid w-full h-fit gap-3 mr-4`}
          >
          <Fade triggerOnce duration={250}>
          {playlist.map((series) => renderItem(series))}
          </Fade>
        </div>
      </div>
    </div>
  )
}
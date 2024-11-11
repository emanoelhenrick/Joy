import { SeriesProps } from "electron/core/models/SeriesModels";
import { Cover } from "@/components/Cover";
import { useEffect, useState } from "react";
import { useUserData } from "@/states/useUserData";
import { Dialog, DialogContent, DialogTitle } from "@/components/MediaInfoDialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useDebounce } from "use-debounce";
import { Fade } from "react-awesome-reveal";
import { FaStar } from "react-icons/fa";
import { SeriesInfo } from "./SeriesInfo";

export default function SeriesPlaylistScroll({ data }: any) {
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

  return (
    <div>
      {selectedSeries && (
        <Dialog open={selectedSeries && true}>
          <DialogContent className="w-fit items-center justify-center" aria-describedby={undefined}>
            <div onClick={() => setSelectedSeries(undefined)} className="cursor-pointer absolute right-14 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <Cross2Icon className="h-8 w-8" />
            </div>
            <DialogTitle className="invisible">{selectedSeries!.title}</DialogTitle>
            <div className="w-screen">
              <SeriesInfo seriesId={selectedSeries!.series_id.toString()} title={selectedSeries!.title} cover={selectedSeries!.cover} />
            </div>
          </DialogContent>
        </Dialog>
      )}
        <div className={`w-full flex h-full ${selectedSeries && 'invisible'}`}>
          <div className={`flex flex-wrap h-fit gap-x-10 gap-y-8 ml-6`}>
            <Fade triggerOnce duration={200}>
              {playlist.map((series) => {
                const isFavorite = favorites?.includes(series.series_id.toString())

                return (
                  <div
                    className="flex flex-col hover:scale-95 transition gap-3 w-fit h-fit cursor-pointer relative group"
                    key={series.series_id + '-' + series.num}
                  >
                    <div onClick={() => setSelectedSeries(series)}>
                      <Cover src={series.cover} title={series.name} />
                    </div>
                    {isFavorite ? (
                        <FaStar onClick={() => updateRender(series.series_id.toString())} size={20} strokeWidth={0} className={`absolute fill-yellow-400 top-3 right-4 ${isFavorite ? 'visible' : 'invisible' }`}  />
                      ) : (
                        <FaStar onClick={() => updateRender(series.series_id.toString())} size={20} className={`absolute fill-primary top-3 right-4 opacity-0 group-hover:opacity-100 transition hover:scale-110`}  />
                      )} 
                    <h3 className="truncate w-36 text-xs text-muted-foreground">{series.title || series.name}</h3>
                  </div>
                )
              })}
            </Fade>
          </div>
        </div>
    </div>
  )
}
import { SeriesProps } from "electron/core/models/SeriesModels";
import { Cover } from "@/components/Cover";
import { useEffect, useState } from "react";
import { useUserData } from "@/states/useUserData";
import { Heart } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/MediaInfoDialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { SeriesInfo } from "../SeriesInfo";
import { useDebounce } from "use-debounce";
import { Fade } from "react-awesome-reveal";

interface PlaylistScrollProps {
  playlist: SeriesProps[]
}

export default function PlaylistScroll({ playlist }: PlaylistScrollProps) {
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
          <div className={`flex flex-wrap h-fit gap-8 justify-center`}>
            <Fade duration={200}>
              {playlist.map((series) => {
                const isFavorite = favorites?.includes(series.series_id.toString())

                return (
                  <div
                    className="flex flex-col gap-3 w-fit h-fit cursor-pointer relative group"
                    key={series.series_id}
                  >
                    <div onClick={() => setSelectedSeries(series)}>
                      <Cover src={series.cover} />
                    </div>
                    {isFavorite ? (
                      <Heart onClick={() => updateRender(series.series_id.toString())} size={20} fill="red" strokeWidth={0} className={`absolute top-3 right-4 ${isFavorite ? 'visible' : 'invisible' }`}  />
                    ) : (
                      <Heart onClick={() => updateRender(series.series_id.toString())} size={20} className={`absolute top-3 right-4 opacity-0 group-hover:opacity-100 transition hover:scale-110`}  />
                    )} 
                    <h3 className="truncate w-36 text-sm text-muted-foreground font-bold">{series.title}</h3>
                  </div>
                )
              })}
            </Fade>
          </div>
        </div>
    </div>
  )
}
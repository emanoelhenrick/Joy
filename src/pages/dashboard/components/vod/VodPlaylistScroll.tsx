import { VodProps } from "electron/core/models/VodModels";
import { useUserData } from "@/states/useUserData";
import { useCallback, useEffect, useState } from "react";
import { Cover } from "@/components/Cover";
import { Dialog, DialogContent } from "../../../../components/MediaInfoDialog";
import { VodInfo } from "./VodInfo";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Fade } from "react-awesome-reveal";
import { FaStar } from "react-icons/fa";
import { useMeasure } from "@uidotdev/usehooks";

export default function VodPlaylistScroll({ data }: any) {
  const [ref, { width }] = useMeasure();
  const columns = Math.floor(width! / 154)

  const playlist: VodProps[] = data
  const [refresh, setRefresh] = useState(false)
  const [favorites, setFavorites] = useState<any>()
  const [selectedMovie, setSelectedMovie] = useState<VodProps>()
  const updateFavorite = useUserData(state => state.updateFavorite)
  const vodData = useUserData(state => state.userData.vod)

  async function updateRender(streamId: string) {
    updateFavorite(streamId, 'vod')
    setRefresh(prev => !prev)
  }

  useEffect(() => {
    if (!vodData) return
    const udlist = []
    for (const vd of vodData) if (vd.favorite == true) udlist.push(vd.id)
    setFavorites(udlist)
  }, [vodData, refresh])

  const renderItem = useCallback((movie: VodProps) => {
    const isFavorite = favorites?.includes(movie.stream_id.toString())

    return (
      <div className="w-full h-fit hover:scale-95 transition cursor-pointer relative group" key={movie.num}>
        <div onClick={() => setSelectedMovie(movie)} className="group-hover:opacity-70">
          <Cover src={movie.stream_icon} title={movie.title || movie.name} />
        </div>
          {isFavorite ? (
            <FaStar onClick={() => updateRender(movie.stream_id.toString())} strokeWidth={0} className={`absolute size-5 fill-yellow-400 top-3 right-4 ${isFavorite ? 'visible' : 'invisible' }`}  />
          ) : (
            <FaStar onClick={() => updateRender(movie.stream_id.toString())} className={`absolute fill-primary size-5 top-3 right-4 opacity-0 group-hover:opacity-100 transition hover:scale-110`}  />
          )}
      </div>
    )
  }, [playlist, favorites])

  return (
    <div className="h-fit w-full rounded-xl">
      {selectedMovie && (
        <Dialog open={selectedMovie && true}>
          <DialogContent className="w-fit items-center justify-center" aria-describedby={undefined}>
            <div
              onClick={() => setSelectedMovie(undefined)}
              className="cursor-pointer absolute right-14 top-16 rounded-sm opacity-90 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-30">
              <Cross2Icon className="size-8 p-1 rounded-md bg-background/30 backdrop-blur-lg" />
            </div>
            <div className="w-screen">
                <VodInfo streamId={selectedMovie!.stream_id.toString()} title={selectedMovie!.title} cover={selectedMovie!.stream_icon} />
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div className={`w-full flex`}>
        <div ref={ref} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }} className={`grid w-full gap-3 h-fit mr-4`}>
          {playlist!.map((movie) => renderItem(movie))}
        </div>
      </div>
    </div>
  );
}


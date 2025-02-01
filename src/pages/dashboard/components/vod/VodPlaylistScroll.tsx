import { VodProps } from "electron/core/models/VodModels";
import { useUserData } from "@/states/useUserData";
import { useCallback, useEffect, useState } from "react";
import { Cover } from "@/components/Cover";
import { Dialog, DialogContent, DialogTitle } from "../../../../components/MediaInfoDialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Fade, Slide } from "react-awesome-reveal";
import { FaStar } from "react-icons/fa";
import { useMeasure } from "@uidotdev/usehooks";
import { VodPage } from "./info";
import { AnimatePresence, motion } from 'framer-motion'

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
      <div
        className="w-full h-fit cursor-pointer relative group"
        key={movie.num}
        >
        <div onClick={() => setSelectedMovie(movie)} className="group-hover:opacity-70 transition-transform group-hover:scale-95">
          <Cover src={movie.stream_icon} title={movie.title || movie.name} />
        </div>
      </div>
    )
  }, [playlist, favorites])

  return (
    <div className="h-fit rounded-xl">
      {/* {selectedMovie && ( */}
          <Dialog open={selectedMovie && true}>
            <DialogContent className="w-screen h-screen items-center justify-center" aria-describedby={undefined}>
              <div
                onClick={() => setSelectedMovie(undefined)}
                className="cursor-pointer absolute right-16 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-20">
                <Cross2Icon className="size-8 p-1 rounded-md bg-background/30 backdrop-blur-lg" />
              </div>
              <DialogTitle className="hidden" />
              <div className="w-screen">
                <VodPage streamId={selectedMovie! && selectedMovie!.stream_id.toString()} cover={selectedMovie! ? selectedMovie!.stream_icon : ''} />
              </div>
            </DialogContent>
          </Dialog>
      {/* )} */}
      <div className={`w-full flex`}>
        <div
          ref={ref}
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          className={`grid w-full gap-3 h-fit mr-4`}
          >
          <Fade triggerOnce duration={250}>
            {playlist!.map((movie) => renderItem(movie))}
          </Fade>
        </div>
      </div>
    </div>
  );
}


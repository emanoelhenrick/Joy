import { VodProps } from "electron/core/models/VodModels";
import { useUserData } from "@/states/useUserData";
import { useEffect, useState } from "react";
import { Cover } from "@/components/Cover";
import { Dialog, DialogContent, DialogTitle } from "../../../../components/MediaInfoDialog";
import { VodInfo } from "./VodInfo";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Fade } from "react-awesome-reveal";
import { FaStar } from "react-icons/fa";

export default function VodPlaylistScroll({ data }: any) {
  const playlist: VodProps[] = data
  const [update, setUpdate] = useState(false)
  const [favorites, setFavorites] = useState<any>()
  const [selectedMovie, setSelectedMovie] = useState<VodProps>()
  const { updateFavorite, userData } = useUserData()
  const vodData = useUserData(state => state.userData.vod)

  async function updateRender(streamId: string) {
    updateFavorite(streamId, 'vod')
    setUpdate(prev => !prev)
  }

  useEffect(() => {
    if (vodData) {
      const udlist = []
      for (const vd of vodData) {
        if (vd.favorite == true) udlist.push(vd.id)
      }
      setFavorites(udlist)
    }
    
  }, [userData, update, vodData])

  return (
    <div className="h-fit rounded-xl">
      {selectedMovie && (
        <Dialog open={selectedMovie && true}>
          <DialogContent className="w-fit items-center justify-center" aria-describedby={undefined}>
            <div onClick={() => setSelectedMovie(undefined)} className="cursor-pointer absolute right-14 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <Cross2Icon className="h-8 w-8" />
            </div>
            <DialogTitle className="invisible">{selectedMovie!.title}</DialogTitle>
            <div className="w-screen">
              <VodInfo streamId={selectedMovie!.stream_id.toString()} title={selectedMovie!.title} cover={selectedMovie!.stream_icon} />
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div className={`w-full flex h-full ${selectedMovie && 'invisible'}`}>
        <div className={`flex flex-wrap h-fit gap-x-10 gap-y-8 ml-6`}>
          <Fade direction="up" triggerOnce duration={200}>
            {playlist!.map((movie) => {
                const isFavorite = favorites?.includes(movie.stream_id.toString())

                return (
                  <div className="w-fit h-fit hover:scale-95 transition cursor-pointer relative group flex flex-col gap-2" key={movie.num}>
                    <div onClick={() => setSelectedMovie(movie)}>
                      <Cover src={movie.stream_icon} title={movie.title || movie.name} />
                    </div>
                      {isFavorite ? (
                        <FaStar onClick={() => updateRender(movie.stream_id.toString())} size={20} strokeWidth={0} className={`absolute fill-yellow-400 top-3 right-4 ${isFavorite ? 'visible' : 'invisible' }`}  />
                      ) : (
                        <FaStar onClick={() => updateRender(movie.stream_id.toString())} size={20} className={`absolute fill-primary top-3 right-4 opacity-0 group-hover:opacity-100 transition hover:scale-110`}  />
                      )}
                    <h3 className="truncate w-36 text-xs text-muted-foreground">{movie.title || movie.name}</h3>
                  </div>
                )
              })}
          </Fade>
        </div>
      </div>
    </div>
  );
}


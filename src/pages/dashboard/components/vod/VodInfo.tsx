import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import electronApi from "@/config/electronApi"
import { usePlaylistUrl } from "@/states/usePlaylistUrl"
import { QueryFilters, useQuery, useQueryClient } from "@tanstack/react-query"
import { LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Fade } from "react-awesome-reveal"
import { FaPlay } from "react-icons/fa"
import { useUserData } from "@/states/useUserData"
import { VideoPlayer } from "@/components/player"

interface Props {
  streamId: string
  title: string
  cover: string
}

export function VodInfo({ streamId, title, cover }: Props) {
  const queryClient = useQueryClient()

  const [_isDialog, setIsDialog] = useState(false)
  const userVodData = useUserData(state => state.userData.vod?.find(v => v.id == streamId))
  const { data, isSuccess } = useQuery({ queryKey: [`vodInfo`], queryFn: async () => await electronApi.getVodInfo(urls.getVodInfoUrl + streamId) })
  const { urls } = usePlaylistUrl()

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['vodInfo'], exact: true } as QueryFilters)
    }
  }, [])

  const extensions = ['mp4', 'ogg', 'ogv', 'webm', 'mov', 'm4v']

  return (
    <div className="flex items-center justify-center h-screen">
      <img className="w-full fixed blur-2xl opacity-30 -z-10" src={cover!} />
      
      <div className="flex gap-6 absolute h-fit max-w-6xl rounded-xl p-8 xl:scale-90 2xl:scale-100">
          {isSuccess ? (
              <img className="h-full max-h-[500px] rounded-xl shadow-xl" src={cover!} />
          ) : (
          <div className="flex items-center justify-center rounded-lg">
            <img className="h-full max-h-[500px] rounded-xl shadow-xl opacity-50" src={cover!} />
            <LoaderCircle size={48} className={`animate-spin fixed`} />
          </div>
          )}
          {data && (
            <Fade duration={250}>
            <div className={`flex flex-col h-full transition`}>
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {data.info.name || data.info.title || data.movie_data.name}
              </h1>
              <p className="leading-7 [&:not(:first-child)]:mt-6 text-lg">
                {data?.info.description || data?.info.plot}
              </p>
              <p className="leading-7 truncate max-w-xl [&:not(:first-child)]:mt-3 text-md text-muted-foreground">
                {data?.info.cast}
              </p>
              <p className="leading-7 [&:not(:first-child)]:mt-0 text-md text-muted-foreground">
                {data?.info.director && 'Directed by ' + data?.info.director}
              </p>
              <Dialog onOpenChange={(open) => setIsDialog(open)}>
                <DialogTrigger asChild>
                  <Button disabled={!extensions.includes(data.movie_data.container_extension) && true} className={`flex gap-2 mt-6 self-start px-6 text-md`}>
                    <FaPlay size={12} /> Play
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-fit items-center justify-center" aria-describedby={undefined}>
                  <DialogTitle className="hidden">{title}</DialogTitle>
                  <div className="w-screen">
                    <VideoPlayer
                      url={`${urls.getVodStreamUrl}/${streamId}.${data?.movie_data.container_extension}`}
                      type="vod"
                      currentTimeStated={userVodData ? userVodData!.currentTime : undefined}
                      data={{id: streamId}}
                      title={data.info.name}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            </Fade>
          )}
      </div>
    </div>
  )
}
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/MediaInfoDialog"
import electronApi from "@/config/electronApi"
import { usePlaylistUrl } from "@/states/usePlaylistUrl"
import { QueryFilters, useQuery, useQueryClient } from "@tanstack/react-query"
import { LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Fade } from "react-awesome-reveal"
import { FaPlay } from "react-icons/fa"
import { useUserData } from "@/states/useUserData"
import { VideoPlayer } from "@/components/player"
import { Badge } from "@/components/ui/badge"
import { Cross2Icon } from "@radix-ui/react-icons"

interface Props {
  streamId: string
  title: string
  cover: string
}

export function VodInfo({ streamId, title, cover }: Props) {
  const queryClient = useQueryClient()

  const [isDialog, setIsDialog] = useState(false)
  const userVodData = useUserData(state => state.userData.vod?.find(v => v.id == streamId))
  const { data, isSuccess } = useQuery({ queryKey: [`vodInfo`], queryFn: async () => await electronApi.getVodInfo(urls.getVodInfoUrl + streamId) })
  const { urls } = usePlaylistUrl()

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['vodInfo'], exact: true } as QueryFilters)
    }
  }, [])

  const genres = data?.info.genre.replaceAll(/^\s+|\s+$/g, "").split(/[^\w\sÀ-ÿ-]/g) || ['']
  
  const extensions = ['mp4', 'ogg', 'ogv', 'webm', 'mov', 'm4v']

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex items-center gap-6 absolute h-fit max-w-6xl rounded-xl p-8 xl:scale-90 2xl:scale-100">
          {isSuccess ? (
            <div className="relative w-full max-w-72">
              <div className="transition flex hover:scale-95">
                {extensions.includes(data!.movie_data.container_extension) ? (
                  <div className="items-center justify-center cursor-pointer flex" onClick={() => setIsDialog(true)}>
                    <img className="shadow-xl rounded-xl" src={cover!}/>
                    <FaPlay className="absolute" size={50} />
                  </div>
                ) : (
                  <>
                    <div className="bg-black w-full rounded-xl opacity-40 h-full absolute" />
                    <img className="rounded-xl shadow-xl" src={cover!}/>
                    <Badge className="absolute text-sm mt-2 font-normal bg-secondary text-muted-foreground hover:bg-secodary">unsupported</Badge>
                  </>
                )}
              </div>
              <img src={cover!} className="absolute top-0 rounded-3xl blur-3xl -z-10"/>
            </div>
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
              <p className="leading-7 max-w-4xl [&:not(:first-child)]:mt-4">
                {data?.info.description || data?.info.plot}
              </p>

              <div className="flex gap-2">
                {genres[0].length > 0 && genres.map(g => <Badge key={g} className="text-sm mt-2 font-normal bg-secondary text-muted-foreground hover:bg-secodary hover:opacity-80">{g}</Badge>)}
              </div>
              <p className="leading-7 truncate max-w-xl [&:not(:first-child)]:mt-3 text-md text-muted-foreground">
                {data?.info.cast}
              </p>
              <p className="leading-7 [&:not(:first-child)]:mt-0 text-md text-muted-foreground">
                {data?.info.director && 'Directed by ' + data?.info.director}
              </p>
              <Dialog open={isDialog}>
                <DialogTrigger asChild>
                  {/* <Button disabled={!extensions.includes(data.movie_data.container_extension) && true} className={`flex gap-2 mt-6 rounded-full self-start px-6 text-md`}>
                    <FaPlay size={12} /> Play
                  </Button> */}
                </DialogTrigger>
                <DialogContent className="w-fit items-center justify-center" aria-describedby={undefined}>
                  <div onClick={() => setIsDialog(false)} className=" z-10 cursor-pointer absolute right-14 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <Cross2Icon className="h-8 w-8" />
                  </div>
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
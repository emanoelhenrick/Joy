import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/MediaInfoDialog"
import electronApi from "@/config/electronApi"
import { usePlaylistUrl } from "@/states/usePlaylistUrl"
import { QueryFilters, useQuery, useQueryClient } from "@tanstack/react-query"
import { LoaderCircle } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Fade } from "react-awesome-reveal"
import { FaPlay, FaStar } from "react-icons/fa"
import { useUserData } from "@/states/useUserData"
import { VodPlayer } from "./VodPlayer"
import { Badge } from "@/components/ui/badge"
import { Cross2Icon } from "@radix-ui/react-icons"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { VodPlayerDialog } from "./VodPlayerDialog"
import { MovieDb, TitleLogo } from "moviedb-promise"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface Props {
  streamId: string
  title: string
  cover: string
}

export function VodInfo({ streamId, cover }: Props) {
  const queryClient = useQueryClient()

  const moviedb = new MovieDb(import.meta.env.VITE_TMDB_API_KEY)

  const [isDialog, setIsDialog] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [isCover, setIsCover] = useState(true)
  const userVodData = useUserData(state => state.userData.vod?.find(v => v.id == streamId))
  const removeVodStatus = useUserData(state => state.removeVodStatus)
  const { data, isSuccess } = useQuery({ queryKey: [`vodInfo`], queryFn: async () => await fetchMovieData() })
  const { urls } = usePlaylistUrl()

  async function fetchMovieData() {
    const vodInfo = await electronApi.getVodInfo(urls.getVodInfoUrl + streamId)
    if (!vodInfo) return
    if (vodInfo.info.tmdb_id) {
      const tmdbData = await moviedb.movieImages({ id: vodInfo.info.tmdb_id })
      return { ...vodInfo, tmdbImages: tmdbData }
    }
    return vodInfo
  }

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['vodInfo'], exact: true } as QueryFilters)
    }
  }, [])

  const genres: string[] = useMemo(() => {
    if (data) {
      if (data.info.genre) {
        return data!.info.genre.replaceAll(/^\s+|\s+$/g, "").split(/[^\w\sÀ-ÿ-]/g)
      }
    }
    return []
  }, [isSuccess])

  const extensions = ['mp4', 'ogg', 'ogv', 'webm', 'mov', 'm4v']

  if (!data) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
          <img key='loading' src={cover} className="max-w-80 rounded-2xl animate-pulse -z-20" />
      </div>
    )
  }

  const description = data.info.description || data.info.plot
  const title = data.info.title || data.info.name || data.movie_data.name

  if (data && data.tmdbImages) {
    function getRightLogo(logos: TitleLogo[]) {
      if (!logos) return
      if (logos.length === 0) return
      const filteredByIso = logos.filter(l => l.iso_639_1 === 'pt-BR' || l.iso_639_1 === 'en')
      if (filteredByIso.length === 0) return `https://image.tmdb.org/t/p/w500${logos[0].file_path}`
      const filteredByAspectRatio = filteredByIso.filter(l => l.aspect_ratio! > 1.5 )
      if (filteredByAspectRatio.length === 0) return `https://image.tmdb.org/t/p/w500${filteredByIso[0].file_path}`
      return `https://image.tmdb.org/t/p/w500${filteredByAspectRatio[0].file_path}`
    }

    const backdropPath = data.tmdbImages!.backdrops!.length === 0 ? undefined
      : `https://image.tmdb.org/t/p/original${data.tmdbImages.backdrops![0].file_path}`

    const logoPath = getRightLogo(data.tmdbImages.logos!)

    return (
      <>
        <div className="w-full h-screen flex bg-background flex-col justify-end">
        { backdropPath !== undefined && (
          <img
            className="w-full h-full object-cover fixed top-0 z-10"
            src={`https://image.tmdb.org/t/p/original${backdropPath}`}
          />
        )}
        <div className="inset-0 w-full h-full z-10 fixed bg-gradient-to-l from-transparent to-background/95" />
        <div className="inset-0 w-full h-full z-10 fixed bg-gradient-to-b from-transparent to-background/60" />

        <div className="p-16 z-20 h-fit">
          <div className="max-w-96 h-fit">
            { logoPath !== undefined ? (<img className="object-contain max-h-40" src={logoPath} alt="" />) : <h1 className="text-5xl">{title}</h1>}
          </div>

          <div className="flex items-center gap-4 mt-4">
            { data.info.releasedate && <span className="text-base 2xl:text-lg text-muted-foreground">{format(data.info.releasedate, 'u')}</span>}

            {data.info.genre && <span className="text-base 2xl:text-lg text-muted-foreground">{genres[0]}</span>}
          </div>
          
          <div className="max-w-screen-md 2xl:max-w-screen-lg mt-2 flex flex-col gap-4">
          {description && <span className="text-base 2xl:text-xl text-primary line-clamp-6">{description}</span>}
            <div>
              <p className="truncate max-w-xl text-muted-foreground">
                {data?.info.cast}
              </p>
              <p className="text-muted-foreground">
                {data?.info.director && 'Directed by ' + data?.info.director}
              </p>
            </div>
            <span className="text-primary/90">Title: {title}</span>

            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                { extensions.includes(data.movie_data.container_extension) ? (
                  <Button onClick={() => setIsDialog(true)} size={"lg"} className="flex gap-2 items-center bg-primary">
                    <FaPlay className="size-4" />
                    <span className="leading-none text-base">Watch</span>
                  </Button>
                ) : (
                  <Button disabled size={"lg"} className="flex gap-2 items-center bg-primary">
                    <span className="leading-none text-base">Unsupported</span>
                  </Button>
                )}
                <Button variant={'ghost'} size={"lg"} className="flex gap-2 items-center hover:bg-primary/10">
                  <FaStar className="size-4" />
                  <span className="leading-none text-base">Add to favorites</span>
                </Button>
              </div>

              <AlertDialog onOpenChange={() => setUpdated(prev => !prev)}>
                <AlertDialogTrigger>
                  { userVodData && <Button variant={'ghost'} size={"lg"} className="flex gap-2 items-center hover:bg-primary/10">
                <span className="leading-none text-base text-muted-foreground">Clear data</span>
              </Button> }
                </AlertDialogTrigger>
                <AlertDialogContent className="border-none bg-primary-foreground">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will erase all related data like where you stopped watching and favorite.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent border-none shadow-none">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="border-none shadow-none" onClick={() => removeVodStatus(streamId)}>Clear</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      <VodPlayerDialog
        name={title}
        container_extension={data?.movie_data.container_extension}
        currentTime={userVodData ? userVodData!.currentTime : undefined}
        streamId={streamId}
        open={isDialog}
        setIsOpen={setIsDialog}
      />
    </>
    )
  }

  return (
    <>
      <div className="w-full h-screen flex flex-col justify-end">
        { data.info.backdrop_path && data.info.backdrop_path.length > 0 ? (
          <img
            className="w-full h-full object-cover fixed top-0 -z-10"
            src={data.info.backdrop_path[0]}
          />
        ) : (
          <img
            className="w-full h-full object-cover fixed top-0 blur-lg -z-10"
            src={cover}
          />
        )}
        <div className="inset-0 w-full h-full -z-10 fixed bg-gradient-to-l from-transparent to-background/95" />

        <div className="p-16 h-fit">
          <div className="max-w-96">
            <h1 className="text-5xl font-semibold">{title}</h1>
          </div>
          <div className="max-w-screen-lg mt-6 flex flex-col gap-4">
            {description && <span className="text-base 2xl:text-xl text-primary line-clamp-6">{description}</span>}
            <div className="flex gap-2">
              {data.info.genre && genres.map(g => <span className="text-muted-foreground italic">{g}</span>)}
            </div>
            <div>
              <p className="truncate max-w-xl text-muted-foreground">
                {data?.info.cast}
              </p>
              <p className="text-muted-foreground">
                {data?.info.director && 'Directed by ' + data?.info.director}
              </p>
            </div>
            <span className="text-primary/90">Title: {title}</span>

            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                { extensions.includes(data.movie_data.container_extension) ? (
                  <Button onClick={() => setIsDialog(true)} size={"lg"} className="flex gap-2 items-center bg-primary">
                    <FaPlay className="size-4" />
                    <span className="leading-none text-base">Watch</span>
                  </Button>
                ) : (
                  <Button disabled size={"lg"} className="flex gap-2 items-center bg-primary">
                    <span className="leading-none text-base">Unsupported</span>
                  </Button>
                )}
                <Button variant={'ghost'} size={"lg"} className="flex gap-2 items-center hover:bg-primary/10">
                  <FaStar className="size-4" />
                  <span className="leading-none text-base">Add to favorites</span>
                </Button>
              </div>

              <Button variant={'ghost'} size={"lg"} className="flex gap-2 items-center hover:bg-primary/10">
                <span className="leading-none text-base text-muted-foreground">Clear data</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <VodPlayerDialog
        name={title}
        container_extension={data?.movie_data.container_extension}
        currentTime={userVodData ? userVodData!.currentTime : undefined}
        streamId={streamId}
        open={isDialog}
        setIsOpen={setIsDialog}
      />
    </>
  )

}
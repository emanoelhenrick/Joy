import electronApi from "@/config/electronApi"
import { usePlaylistUrl } from "@/states/usePlaylistUrl"
import { EpisodeProps, UserEpisodeProps } from "electron/core/models/SeriesModels"
import { LoaderCircle } from "lucide-react"
import { FaPlay, FaStar } from "react-icons/fa";
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./SelectSeason"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { QueryFilters, useQuery, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useUserData } from "@/states/useUserData";
import { Progress } from "@/components/ui/progress";
import { useDebounce } from "use-debounce";
import { VideoPlayer } from "./SeriesPlayer";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Slide } from "react-awesome-reveal";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ScrollBarStyled } from "@/components/ScrollBarStyled";
import { format } from "date-fns";

export function SeriesInfo({ seriesId, title, cover }: { seriesId: string, title: string, cover: string }) {
  const queryClient = useQueryClient();

  const { data, isSuccess } = useQuery({ queryKey: [`seriesInfo`], queryFn: async () => await electronApi.getSerieInfo(urls.getSeriesInfoUrl + seriesId) })

  if (!seriesId) return
  const { urls } = usePlaylistUrl()

  const [_isDialog, setIsDialog] = useState(false)
  const [updated, setUpdated] = useState<boolean>()
  const userSeriesData = useUserData(state => state.userData.series?.find(s => s.id == seriesId))
  const updateSeason = useUserData(state => state.updateSeason)
  const removeSeriesStatus = useUserData(state => state.removeSeriesStatus)
  const [seasons, setSeasons] = useState<string[]>(['1'])
  const [currentSeason, setCurrentSeason] = useState(userSeriesData?.season || '')
  const [episodes, setEpisodes] = useState<EpisodeProps[]>([])
  const [episodesData, setEpisodesData] = useState<UserEpisodeProps[]>()
  const [updatedDebounce] = useDebounce(updated, 500)

  useEffect(() => {
    if (isSuccess) {
      const seasonsList = []
      for (const key in data?.episodes) seasonsList.push(key)
      setSeasons(seasonsList)
      setCurrentSeason(userSeriesData?.season || seasonsList[0])
      setEpisodes(data!.episodes[currentSeason])
    }
    
  }, [isSuccess])

  useEffect(() => {
    if (isSuccess) {
      const episodesList = data!.episodes[currentSeason]
      setEpisodes(episodesList)
      updateSeason(seriesId, currentSeason)
    }
    
  }, [currentSeason, isSuccess, userSeriesData])

  useEffect(() => {
    if (userSeriesData) {
      if (!userSeriesData.episodes) return
      const seasonEpisodes = userSeriesData.episodes!.filter(e => e.season == currentSeason)
      if (!seasonEpisodes) return
      setEpisodesData(seasonEpisodes)
    } else {
      setEpisodesData(undefined)
    }
  }, [userSeriesData, currentSeason, updatedDebounce])

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['seriesInfo'], exact: true } as QueryFilters)
    }
  }, [])

  const genres = data?.info.genre.replaceAll(/^\s+|\s+$/g, "").split(/[^\w\sÀ-ÿ-]/g) || ['']

  if (!data) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
          <img key='loading' src={cover} className="max-w-80 rounded-2xl animate-pulse -z-20" />
      </div>
    )
  }

  function getRightBackdrop(backdropList: string[]) {
    if (!backdropList) return
    if (backdropList.length === 0) return
    const url = backdropList[0]
    if (url.includes('tmdb')) {
      const list = url.split('/')
      const path = list[list.length - 1]
      return `https://image.tmdb.org/t/p/original/${path}`
    }
    return url
  }

  const backdropPath = getRightBackdrop(data.info.backdrop_path)
  const description = data.info.plot
  const name = data.info.name

  return (
    <>
      <div className="w-full h-screen flex flex-col justify-end">
        { backdropPath ? (
          <img
            className="w-full h-full object-cover fixed top-0 -z-10"
            src={backdropPath}
          />
        ) : (
          <img
            className="w-full h-full object-cover fixed top-0 blur-lg -z-10"
            src={cover}
          />
        )}
        <div className="inset-0 w-full h-full -z-10 fixed bg-gradient-to-l from-transparent to-background/95" />
        <div className="inset-0 w-full h-full -z-10 fixed bg-gradient-to-b from-transparent to-background/50" />

        <div className="p-16 pb-0 h-fit">
          <h1 className="text-5xl font-semibold line-clamp-1 max-w-screen-xl">{name}</h1>
          <div className="max-w-screen-lg mt-4 flex flex-col gap-2">
            {description && <span className="text-base 2xl:text-xl text-primary line-clamp-4 2xl:line-clamp-6">{description}</span>}
            <div className="flex gap-2">
              {data.info.genre && genres.map(g => <span className="text-sm 2xl:text-base text-muted-foreground italic">{g}</span>)}
            </div>
            <div>
              <p className="text-sm 2xl:text-base truncate max-w-xl text-muted-foreground">
                {data?.info.cast}
              </p>
              <p className="text-sm 2xl:text-base text-muted-foreground">
                {data?.info.director && 'Directed by ' + data?.info.director}
              </p>
              { data.info.releaseDate && <span className="text-sm 2xl:text-base text-muted-foreground">Released in {format(data.info.releaseDate, 'u')}</span>}
            </div>
          </div>
        </div>

        <div className="px-16 justify-between items-end flex gap-2 mt-4 w-full mb-8">
          <div className="flex gap-2">
            <Button size={"lg"} className="flex gap-2 items-center bg-primary">
              <FaPlay className="size-4" />
              <span className="leading-none text-base">Watch</span>
            </Button>
            <Button variant={'ghost'} size={"lg"} className="flex gap-2 items-center">
              <FaStar className="size-4" />
              <span className="leading-none text-base">Add to favorites</span>
            </Button>
          </div>

          <AlertDialog onOpenChange={() => setUpdated(prev => !prev)}>
            <AlertDialogTrigger>
              { userSeriesData && <div className="text-primary/60 text-right hover:text-primary cursor-pointer transition mt-2">Clear data</div> }
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
                <AlertDialogAction className="border-none shadow-none" onClick={() => removeSeriesStatus(seriesId)}>Clear</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <section className="mx-8 mb-8 space-y-3 backdrop-blur-3xl bg-background/70 p-6 rounded-3xl">
          <div>
            <ScrollArea className="w-full pb-4">
              <div className="flex gap-6 text-nowrap">
                { seasons && seasons.map(s => (
                    <div onClick={() => setCurrentSeason(s)} className={`px-2 py-1 hover:opacity-80 cursor-pointer ${currentSeason === s ? 'border-b-4 border-primary' : 'text-muted-foreground'}`}>Season {s}</div>
                ))}
              </div>
              <ScrollBarStyled orientation="horizontal" />
            </ScrollArea>
          </div>

          <ScrollArea className="w-full whitespace-nowrap rounded-lg">
              <div className="flex w-max space-x-6 pb-6 whitespace-nowrap rounded-md">
                {episodes && episodes.map((ep, index) => {
                  let progress = 0;
                  const epUserData = episodesData?.find(e => e.episodeId == ep.id)
                  if (epUserData) progress = parseFloat(((epUserData.currentTime / epUserData.duration) * 100).toFixed(2))
                  const extensions = ['mp4', 'ogg', 'ogv', 'webm', 'mov', 'm4v']
                  if (extensions.includes(ep.container_extension)) {
                    return (
                      <Dialog onOpenChange={() => setUpdated(prev => !prev)} key={currentSeason + '.' + ep.id}>
                        <DialogTrigger asChild>
                          <div className="w-56 2xl:w-64 cursor-pointer hover:opacity-80">
                            <div className="relative shadow-lg flex items-center aspect-video justify-center overflow-hidden rounded-lg">
                              { ep.info.movie_image ?
                                <LazyLoadImage src={ep.info.movie_image} width={256} className="h-full object-cover" />
                                :
                                <img src={cover} className="object-cover w-full h-full" />
                              }
                              <FaPlay className="absolute opacity-80 size-8" />
                              {progress > 0 &&
                              <Progress value={progress} className="absolute w-full transition bottom-0 rounded-none h-0.5" />
                              }
                            </div>
                            <p className="whitespace-normal text-base mt-3">{`Episode ${index + 1}`}</p>
                            <span className="text-wrap text-xs text-muted-foreground line-clamp-2 2xl:line-clamp-3">{ep.info.plot}</span>
                          </div>
                        </DialogTrigger>
                      <DialogContent className="w-fit border-none bg-transparent items-center justify-center" aria-describedby={undefined}>
                        <DialogTitle className="hidden">{title}</DialogTitle>
                        <div className="w-screen">
                          <VideoPlayer
                            baseUrl={urls.getSeriesStreamUrl}
                            episodeNumStart={ep.episode_num}
                            info={data!}
                            seriesId={seriesId}
                            seasonNumStart={currentSeason}
                            currentTimeStated={epUserData?.currentTime!}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    )
                  } else {
                    return (
                      <div key={currentSeason + '.' + ep.id} className="flex flex-col cursor-default space-y-2 w-64 opacity-50">
                        <div className="relative flex items-center justify-center overflow-hidden rounded-lg">
                          <div className="py-11 aspect-video w-full h-full text-lg bg-secondary opacity-40"/>
                          <p className="whitespace-normal absolute text-base">unsupported</p>
                        </div>
                        <p className="whitespace-normal text-muted-foreground text-sm">{`Episode ${index + 1}`}</p>
                      </div>
                    )
                  }
                })}
            </div>
            <ScrollBarStyled orientation="horizontal" />
          </ScrollArea>
        </section>
      </div>
    </>)
}
import electronApi from "@/config/electronApi"
import { usePlaylistUrl } from "@/states/usePlaylistUrl"
import { EpisodeProps, UserEpisodeProps } from "electron/core/models/SeriesModels"
import { LoaderCircle } from "lucide-react"
import { FaPlay } from "react-icons/fa";
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

export function SeriesInfo({ seriesId, title, cover }: { seriesId: string, title: string, cover: string }) {
  const queryClient = useQueryClient();

  const { data, isSuccess } = useQuery({ queryKey: [`seriesInfo`], queryFn: async () => await electronApi.getSerieInfo(urls.getSeriesInfoUrl + seriesId) })

  if (!seriesId) return
  const { urls } = usePlaylistUrl()

  const [_isDialog, setIsDialog] = useState(false)
  const [updated, setUpdated] = useState<boolean>()
  const userSeriesData = useUserData(state => state.userData.series?.find(s => s.id == seriesId))
  const updateSeason = useUserData(state => state.updateSeason)
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
    }
  }, [userSeriesData, currentSeason, updatedDebounce])

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['seriesInfo'], exact: true } as QueryFilters)
    }
  }, [])

  const genres = data?.info.genre.replaceAll(/^\s+|\s+$/g, "").split(/[^\w\sÀ-ÿ-]/g) || ['']

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex gap-6 h-fit max-w-7xl rounded-xl p-12 xl:scale-90 2xl:scale-100">
        {isSuccess ? (
          <div className="relative w-full max-w-72">
            <div className="items-center overflow-hidden rounded-xl justify-center transition flex">
              <img onClick={() => setIsDialog(true)} className="shadow-xl" src={cover!}/>
            </div>
          <img src={cover!} className="absolute top-0 rounded-3xl blur-3xl -z-10"/>
        </div>
        ) : (
          <div className="flex items-center justify-center rounded-lg">
            <img className="h-full max-h-[500px] rounded-xl shadow-xl opacity-50" src={cover!} />
            <LoaderCircle size={48} className={`animate-spin fixed`} />
          </div>
        )}
        {isSuccess && (
          <div className={`flex flex-col h-full transition max-w-3xl`}>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data?.info.name}
            </h1>

            {data?.info.plot && (
              <p className="leading-7 [&:not(:first-child)]:mt-4 text-md">
                {data?.info.plot}
              </p>
            )}

            <div className="flex gap-2">
              {genres[0].length > 0 && genres.map(g => <Badge key={g} className="text-sm mt-2 font-normal bg-secondary text-muted-foreground hover:bg-secodary hover:opacity-80">{g}</Badge>)}
            </div>

            {data?.info.cast && (
              <p className="leading-7 [&:not(:first-child)]:mt-6 text-md text-muted-foreground">
                {data?.info.cast}
              </p>
            )}

            <p className="leading-7 [&:not(:first-child)]:mt-0 mb-6 text-md text-muted-foreground">
              {data?.info.director && 'Directed by ' + data?.info.director}
            </p>

            {Object.getOwnPropertyNames(data?.episodes).length > 1 && (
              <Select onValueChange={(value) => setCurrentSeason(value)} value={currentSeason}>
              <SelectTrigger  className="w-fit gap-2">
                <SelectValue  placeholder="Season 1" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  { seasons && seasons.map((c) => <SelectItem value={c} key={c}>{`Season ${c}`}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
            )}
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
              <div className="flex w-max space-x-4 pb-6 whitespace-nowrap rounded-md">
                  {episodes && episodes.map(ep => {
                    let progress = 0;
                    const epUserData = episodesData?.find(e => e.episodeId == ep.id)
                    if (epUserData) progress = parseFloat(((epUserData.currentTime / epUserData.duration) * 100).toFixed(2))
                    const extensions = ['mp4', 'ogg', 'ogv', 'webm', 'mov', 'm4v']
                    if (extensions.includes(ep.container_extension)) {
                      return (
                        <Dialog onOpenChange={() => setUpdated(prev => !prev)} key={currentSeason + '.' + ep.id}>
                        <DialogTrigger asChild>
                          <div className="flex flex-col space-y-2 w-36 cursor-pointer hover:opacity-80">
                            <div className="relative flex items-center justify-center overflow-hidden rounded-lg">
                              <div key={ep.id} className="py-11 w-full text-lg bg-secondary opacity-40"/>
                              <FaPlay size={22} className="absolute opacity-70" />
                              {progress > 0 &&
                              <Progress  value={progress} className="absolute bottom-0 rounded-none h-1" />
                              }
                            </div>
                            <p className="whitespace-normal text-sm">{ep.title}</p>
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
                        <div key={currentSeason + '.' + ep.id} className="flex flex-col cursor-default space-y-2 w-36 opacity-50">
                          <div className="relative flex items-center justify-center overflow-hidden rounded-lg">
                            <div className="py-11 w-full text-lg bg-secondary opacity-40"/>
                            <p className="whitespace-normal absolute text-sm">unsupported</p>
                          </div>
                          <p className="whitespace-normal text-sm">{ep.title}</p>
                        </div>
                      )
                    }
                  })}
              </div>
              <ScrollBar color="blue" orientation="horizontal" />
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}
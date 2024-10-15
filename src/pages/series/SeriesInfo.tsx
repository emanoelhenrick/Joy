import electronApi from "@/config/electronApi"
import { usePlaylistUrl } from "@/states/usePlaylistUrl"
import { EpisodeProps, UserEpisodeProps } from "electron/core/models/SeriesModels"
import { LoaderCircle } from "lucide-react"
import { FaPlay } from "react-icons/fa";
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./components/SelectSeason"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { QueryFilters, useQuery, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useUserData } from "@/states/useUserData";
import { Progress } from "@/components/ui/progress";
import { useDebounce } from "use-debounce";
import { VideoPlayer } from "./components/SeriesPlayer";

export function SeriesInfo({ seriesId, title, cover }: { seriesId: string, title: string, cover: string }) {
  const queryClient = useQueryClient();

  const { data, isSuccess } = useQuery({ queryKey: ['seriesInfo'], queryFn: async () => await electronApi.getSerieInfo(urls.getSeriesInfoUrl + seriesId) })

  if (!seriesId) return
  const { urls } = usePlaylistUrl()

  const [updated, setUpdated] = useState<boolean>()
  const [currentSeason, setCurrentSeason] = useState('1')
  const [seasons, setSeasons] = useState<string[]>(['1'])
  const [episodes, setEpisodes] = useState<EpisodeProps[]>([])
  const [episodesData, setEpisodesData] = useState<UserEpisodeProps[]>()
  const userSeriesData = useUserData(state => state.userData.series?.find(s => s.id == seriesId))
  const [updatedDebounce] = useDebounce(updated, 500)
  
  useEffect(() => {
    if (isSuccess) {
      const seasonsList = []
      for (const key in data?.episodes) seasonsList.push(key)
      setSeasons(seasonsList)
      setEpisodes(data!.episodes[currentSeason])
    }
    
  }, [isSuccess])

  useEffect(() => {
    if (isSuccess) {
      const episodesList = data!.episodes[currentSeason]
      setEpisodes(episodesList)
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

  return (
    <div className="flex items-center justify-center h-screen">
      <img className="w-full fixed blur-2xl opacity-30 -z-10" src={cover!} />
      <div className="flex gap-6 h-fit max-w-6xl rounded-xl p-12 xl:scale-90 2xl:scale-100">
        {isSuccess ? (
          <img className="h-full max-h-[500px] rounded-xl shadow-xl" src={cover!} />
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
            <p className="leading-7 [&:not(:first-child)]:mt-6 text-lg">
              {data?.info.plot}
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6  text-md text-muted-foreground">
              {data?.info.cast}
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-0 mb-6 text-md text-muted-foreground">
              {data?.info.director && 'Directed by ' + data?.info.director}
            </p>
            {Object.getOwnPropertyNames(data?.episodes).length > 1 && (
              <Select onValueChange={(value) => setCurrentSeason(value)}>
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
                  {episodes && episodes.map((ep) => {
                    let progress = 0;
                    const epUserData = episodesData?.find(e => e.episodeId == ep.id)
                    if (epUserData) progress = parseFloat(((epUserData.currentTime / epUserData.duration) * 100).toFixed(2))
                    return (
                      <Dialog onOpenChange={() => setUpdated(prev => !prev)}>
                        <DialogTrigger asChild>
                          <div key={currentSeason + '.' + ep.id} className="flex flex-col space-y-2 w-36 cursor-pointer hover:opacity-80">
                            <div className="relative flex items-center justify-center overflow-hidden rounded-lg">
                              <div key={ep.id} className="py-11 w-full text-lg bg-secondary opacity-40"/>
                              <FaPlay size={22} className="absolute opacity-70" />
                              {progress > 0 &&
                                <Progress  value={progress} className="absolute bottom-0 rounded-none h-1" />}
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
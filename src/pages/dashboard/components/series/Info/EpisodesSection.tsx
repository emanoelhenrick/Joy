import { ScrollBarStyled } from "@/components/ScrollBarStyled";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EpisodeProps, SerieInfoProps, UserSeriesDataProps } from "electron/core/models/SeriesModels";
import { useCallback, useMemo, useState } from "react";
import { Episode } from "./Episode";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SeriesPlayer } from './SeriesPlayer'
import { usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useUserData } from "@/states/useUserData";
import { Fade } from "react-awesome-reveal";

interface SeasonsListProps {
  seasons: string[]
  currentSeason: string
  setCurrentSeason: (season: string) => void
}

interface EpisodesListProps {
  data: SerieInfoProps
  episodes: EpisodeProps[]
  seriesId: string
  currentSeason: string
  seriesCover: string
  episodeStreamBaseUrl: string
}

interface EpisodesSection {
  seriesId: string
  seriesCover: string
  data: SerieInfoProps
  userSeriesData: UserSeriesDataProps
}

export function EpisodesSection({ seriesId, seriesCover, data, userSeriesData }: EpisodesSection) {
  const { urls } = usePlaylistUrl()

  const seasonsList = useMemo(() => {
    const seasonsList = []
    for (const key in data.episodes) seasonsList.push(key)
    return seasonsList
  }, [data])

  const [currentSeason, setCurrentSeason] = useState(userSeriesData?.season || seasonsList[0])
  const episodes = useMemo(() => {
    return data.episodes[currentSeason]
  }, [data, currentSeason])

  return (
    <section className="mx-8 mb-8 space-y-3 backdrop-blur-3xl bg-background/70 p-6 rounded-3xl">
      <SeasonsList
        currentSeason={currentSeason}
        seasons={seasonsList}
        setCurrentSeason={setCurrentSeason}
      />
      <EpisodesList
        currentSeason={currentSeason}
        data={data!}
        episodeStreamBaseUrl={urls.getSeriesStreamUrl}
        episodes={episodes}
        seriesCover={seriesCover}
        seriesId={seriesId}
      />
    </section>
  )
}

function SeasonsList({ seasons, currentSeason, setCurrentSeason }: SeasonsListProps) {
  return (
    <div>
      <ScrollArea className="w-full pb-4">
        <div className="flex gap-6 text-nowrap">
          { seasons && seasons.map(s => (
              <div key={s} onClick={() => setCurrentSeason(s)} className={`px-2 py-1 hover:opacity-80 cursor-pointer ${currentSeason === s ? 'border-b-4 border-primary' : 'text-muted-foreground'}`}>Season {s}</div>
          ))}
        </div>
        <ScrollBarStyled orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

function EpisodesList({ data, episodes, seriesId, currentSeason, seriesCover, episodeStreamBaseUrl}: EpisodesListProps) {
  const userEpisodesData = useUserData(state => state.userData.series?.find(s => s.id == seriesId))?.episodes
  const updateDefaultSeason = useUserData(state => state.updateSeason)

  const updateSeason = useCallback((progress: number) => {
    if (progress > 0) updateDefaultSeason(seriesId, currentSeason)
  }, [currentSeason])
  
  const renderItem = useCallback((ep: EpisodeProps, seriesCover: string, index: number) => {
    let progress = 0;
    const epUserData = userEpisodesData?.find(e => e.episodeId == ep.id)
    
    if (epUserData) progress = parseFloat(((epUserData.currentTime / epUserData.duration) * 100).toFixed(2))
    const supportedExtensions = ['mp4', 'ogg', 'ogv', 'webm', 'mov', 'm4v']
    const isSupported = supportedExtensions.includes(ep.container_extension)

    if (isSupported) {
      return (
        <Dialog key={currentSeason + '.' + ep.id} onOpenChange={() => updateSeason(progress)}>
          <DialogTrigger asChild>
            <div>
              <Episode
                cover={seriesCover}
                imageSrc={ep.info.movie_image!}
                progress={progress} description={ep.info.plot}
                episodeNumber={index + 1} 
              />
            </div>
          </DialogTrigger>
        <DialogContent className="w-fit border-none bg-transparent items-center justify-center">
          <DialogTitle className="hidden" />
          <div className="w-screen">
            <SeriesPlayer
              baseUrl={episodeStreamBaseUrl}
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
        <div key={currentSeason + '.' + ep.id} className="flex flex-col cursor-default space-y-2 w-56 2xl:w-64 opacity-50">
          <div className="relative flex items-center justify-center overflow-hidden rounded-lg">
            <div className="py-11 aspect-video w-full h-full text-lg bg-secondary opacity-40"/>
            <p className="whitespace-normal absolute text-base">unsupported</p>
          </div>
          <p className="whitespace-normal text-muted-foreground text-sm">{`Episode ${index + 1}`}</p>
        </div>
      )
    }
  }, [userEpisodesData, episodes])

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-lg">
      <div className="flex w-max space-x-6 pb-6 whitespace-nowrap rounded-md">
          {episodes && episodes.map((ep, index) => renderItem(ep, seriesCover, index))}
      </div>
      <ScrollBarStyled orientation="horizontal" />
    </ScrollArea>
  )
}
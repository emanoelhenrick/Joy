import { ScrollBarStyled } from "@/components/ScrollBarStyled";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EpisodeProps, SerieInfoProps, UserEpisodeProps, UserSeriesDataProps } from "electron/core/models/SeriesModels";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Episode } from "./Episode";
import { usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useUserData } from "@/states/useUserData";
import { VlcDialog } from "../../VlcDialog";
import electronApi from "@/config/electronApi";

interface SeasonsListProps {
  seasons: string[]
  currentSeason: string
  setCurrentSeason: (season: string) => void
}

interface EpisodesListProps {
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
}

export function EpisodesSection({ seriesId, seriesCover, data }: EpisodesSection) {
  const { urls } = usePlaylistUrl()
  const userSeriesData = useUserData(state => state.userData.series?.find(s => s.id == seriesId))

  const seasonsList = useMemo(() => {
    if (!data) return []
    const seasonsList = []
    for (const key in data.episodes) seasonsList.push(key)
    return seasonsList
  }, [data])

  const [currentSeason, setCurrentSeason] = useState(userSeriesData?.season || seasonsList[0])
  const episodes = useMemo(() => {
    if (!data) return []
    return data.episodes[currentSeason]
  }, [data, currentSeason])

  return (
    <section className="mx-8 mb-8 space-y-3 bg-background p-6 rounded-3xl z-10">
      <SeasonsList
        currentSeason={currentSeason}
        seasons={seasonsList}
        setCurrentSeason={setCurrentSeason}
      />
      <EpisodesList
        currentSeason={currentSeason}
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

function EpisodesList({ episodes, seriesId, currentSeason, seriesCover, episodeStreamBaseUrl}: EpisodesListProps) {
  
  const userEpisodesData = useUserData(state => state.userData.series?.find(s => s.id == seriesId))?.episodes

  const updateSeriesStatus = useUserData(state => state.updateSeriesStatus)
  const updateDefaultSeason = useUserData(state => state.updateSeason)

  const [state, setState] = useState<any>(undefined)
  const [episodeRunning, setEpisodeRunning] = useState<EpisodeProps | undefined>()

  function updateUserStatus(dataState: { length: number, time: number }) {
    if (!episodeRunning) return
    setState({
      id: episodeRunning.id,
      data: dataState
    })
  }

  const updateSeason = useCallback((progress: number) => {
    if (progress > 0) updateDefaultSeason(seriesId, currentSeason)
  }, [currentSeason])

  useEffect(() => {
    if (!episodeRunning && state) {
      const ep = episodes?.find(e => e.id == state.id)
      if (!ep || !state) return
      const { time, length } = state.data
      updateSeriesStatus(
        seriesId,
        currentSeason,
        state.id,
        time,
        length,
        (time / length) > 0
      )
      updateSeason(time / length)
      setState(undefined)
    }
    
  }, [episodeRunning, episodes, updateSeriesStatus])

  const renderItem = useCallback((ep: EpisodeProps, seriesCover: string, index: number) => {
    let progress = 0;
    const epUserData = userEpisodesData?.find(e => e.episodeId == ep.id)
    if (epUserData) progress = parseFloat(((epUserData.currentTime / epUserData.duration) * 100).toFixed(2))
    const currentTime = (epUserData && epUserData.currentTime) ? epUserData.currentTime : 0

    async function launchVlc(episodeId: string, currentTime: number, containerExtension: string) {
      const props = {
        path: `${episodeStreamBaseUrl}${episodeId}.${containerExtension}`,
        startTime: currentTime
      }
      await electronApi.launchVLC(props)
      setEpisodeRunning(ep)
    }

    return (
      <div key={ep.id} onClick={async () => await launchVlc(ep.id, currentTime, ep.container_extension)}>
          <Episode
            cover={seriesCover}
            imageSrc={ep.info.movie_image!}
            progress={progress} description={ep.info.plot}
            episodeNumber={index + 1} 
          />
      </div>
    )
  }, [episodes, userEpisodesData])

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-lg">
      <div className="flex w-max space-x-6 pb-4 whitespace-nowrap rounded-md">
        {episodes && episodes.map((ep, index) => renderItem(ep, seriesCover, index))}
      </div>
      <ScrollBarStyled orientation="horizontal" />

      {episodeRunning && (
        <VlcDialog
          updateUserStatus={updateUserStatus}
          open={episodeRunning ? true : false}
          closeDialog={() => setEpisodeRunning(undefined)}
        />
      )}
    </ScrollArea>
  )
}
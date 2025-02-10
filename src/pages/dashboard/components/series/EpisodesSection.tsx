import { ScrollBarStyled } from "@/components/ScrollBarStyled";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EpisodeProps, SerieInfoProps } from "electron/core/models/SeriesModels";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Episode } from "./Episode";
import { usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useUserData } from "@/states/useUserData";
import { VlcDialog } from "../VlcDialog";
import electronApi from "@/config/electronApi";
import { formatDurationFromSeconds } from "@/utils/formatDuration";
import { Bounce, Fade, Slide } from "react-awesome-reveal";

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
  setBlur: (v: boolean) => void
}

export function EpisodesSection({ seriesId, seriesCover, data, setBlur }: EpisodesSection) {
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
    if (!data || !data.episodes) return []
    return data.episodes[currentSeason]
  }, [data, currentSeason])

  return (
    <section 
      onMouseEnter={() => setBlur(true)}
      onMouseLeave={() => setBlur(false)}
      className="mb-8 space-y-1 mt-2 pb-4 2xl:pb-4"
      >
      {data.episodes ? (
        <div>
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
        </div>
      ) : <h1 className="text-muted-foreground">Episodes not found</h1>}
    </section>
  )
}

function SeasonsList({ seasons, currentSeason, setCurrentSeason }: SeasonsListProps) {

  return (
    <div>
      <ScrollArea className="w-full pb-4 mb-2">
        <div className="flex gap-6 text-nowrap ml-16 mr-6">
          { seasons && seasons.map(s => (
              <div key={s} onClick={() => setCurrentSeason(s)} className={`px-2 py-1 hover:opacity-80 border-b-2 transition ease-in-out text-sm 2xl:text-base cursor-pointer ${currentSeason === s ? 'border-b-2 border-primary' : 'text-muted-foreground border-transparent'}`}>Season {s}</div>
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

  const updateSeason = (progress: number) => {
    if (progress > 0) updateDefaultSeason(seriesId, currentSeason)
  }

  useEffect(() => {
    if (!episodeRunning && state) {
      const ep = episodes?.find(e => e.id == state.id)
      if (!ep || !state) return
      const { time, length } = state.data
      updateSeriesStatus(
        seriesId,
        parseInt(ep.episode_num),
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

    const duration = formatDurationFromSeconds(ep.info.duration_secs || undefined) 

    return (
      <div key={ep.id} onClick={async () => await launchVlc(ep.id, currentTime, ep.container_extension)}>
          <Episode
            cover={seriesCover}
            imageSrc={ep.info.movie_image!}
            progress={progress}
            episodeNumber={index + 1}
            duration={duration!}
          />
      </div>
    )
  }, [episodes, userEpisodesData])

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-6 2xl:space-x-6 pb-4 whitespace-nowrap mr-6 ml-16">
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
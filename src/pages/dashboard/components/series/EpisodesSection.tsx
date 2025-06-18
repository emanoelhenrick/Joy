import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EpisodeProps, SerieInfoProps } from "electron/core/models/SeriesModels";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Episode } from "./Episode";
import { usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useUserData } from "@/states/useUserData";
import { VlcDialog } from "../VlcDialog";
import electronApi from "@/config/electronApi";
import { formatDurationFromSeconds } from "@/utils/formatDuration";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "./SelectSeasons";
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { useQuery } from "@tanstack/react-query";
import { MovieDb } from "moviedb-promise";

const moviedb = new MovieDb(import.meta.env.VITE_TMDB_API_KEY)

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
  tmdbId?: string
  data: SerieInfoProps
}

export function EpisodesSection({ seriesId, seriesCover, tmdbId, data }: EpisodesSection) {
  const { urls } = usePlaylistUrl()
  const userSeriesData = useUserData(state => state.userData.series?.find(s => s.id == seriesId))
  
  const seasonsList = useMemo(() => {
    if (!data) return []
    const seasonsList = []
    for (const key in data.episodes) seasonsList.push(key)
    return seasonsList
  }, [data])

  const [currentSeason, setCurrentSeason] = useState(userSeriesData?.season || seasonsList[0])
  
  const { data: tmdbData } = useQuery({ queryKey: [`${seriesId}-${currentSeason}-${tmdbId}`], queryFn: async () => {
    return await moviedb.seasonInfo({ id: tmdbId!, season_number: parseInt(currentSeason), language: 'pt' })
  }})

  const episodes = useMemo(() => {
    if (!data || !data.episodes) return []
    if (!tmdbData) return data.episodes[currentSeason]

    const newEpisodes = []
    for (const episode of data.episodes[currentSeason]) {
      newEpisodes.push(
        { ...episode, tmdbData: tmdbData.episodes![Number(episode.episode_num) - 1]}
      )
    }
    return newEpisodes
  }, [data, currentSeason, tmdbData])

  return (
    <section className="mb-8 pb-4 2xl:pb-4">
      {data.episodes ? (
        <div className="space-y-4">
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
    <Select onValueChange={(value) => setCurrentSeason(value)} value={currentSeason}>
      <SelectTrigger className="w-fit font-medium ml-16 mb-4 group hover:opacity-80 transition">
        <button disabled={seasons.length === 1} aria-label="Seasons" className="w-full flex gap-1 items-center">
          <h1 className="flex gap-2 text-2xl font-medium leading-none">Season {currentSeason}</h1>
          <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="opacity-0 group-hover:opacity-100 size-6 transition duration-300 ease-in-out" />
        </button>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {seasons && seasons.map(s => (
            <SelectItem value={s} key={s}>
              Season {s}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
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
        startTime: currentTime,
        seriesId: seriesId
      }
      await electronApi.launchVLC(props)
      setEpisodeRunning(ep)
    }

    const duration = formatDurationFromSeconds(ep.info.duration_secs || undefined)
    const tmdbData = episodes[index].tmdbData ? episodes[index].tmdbData : undefined
    const tmdbImage = tmdbData ? tmdbData.still_path : undefined
    const title = (tmdbData && tmdbData.name) ? tmdbData.name : ep.title && ep.title.length > 0 ? ep.title : `Episode ${index + 1}`

    return (
      <div key={ep.id} onClick={async () => await launchVlc(ep.id, currentTime, ep.container_extension)}>
          <Episode
            cover={seriesCover}
            imageSrc={ep.info.movie_image!}
            tmdbImage={tmdbImage!} 
            progress={progress}
            title={title}
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
      <ScrollBar orientation={'horizontal'} className="cursor-pointer ml-16 mr-6" />

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
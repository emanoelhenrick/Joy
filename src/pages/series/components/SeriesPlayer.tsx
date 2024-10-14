import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { useEffect, useState } from 'react';
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import { useUserData } from '@/states/useUserData';
import { Button } from '@/components/ui/button';
import { EpisodeProps, SerieInfoProps } from 'electron/core/models/SeriesModels';


interface PlayerProps {
  info: SerieInfoProps
  seriesId: string
  episodeNumStart: string
  seasonNumStart: string
  currentTimeStated: number
  baseUrl: string
}

let currentTime = 0;
let duration = 0;
let currentEpisode: EpisodeProps | undefined = undefined

export function VideoPlayer({ info, seriesId, episodeNumStart = '1', seasonNumStart = '1', currentTimeStated = 0, baseUrl }: PlayerProps) {

  const [episodeNum, setEpisodeNum] = useState(episodeNumStart)
  const [seasonNum, setSeasonNum] = useState(seasonNumStart)
  const [hasNext, setHasNext] = useState<string | undefined>('1')
  const [url, setUrl] = useState<string>()

  const [isControls, setIsControls] = useState(false)

  const updateSeriesStatus = useUserData(state => state.updateSeriesStatus)

  function updateMediaState() {
    if (!currentEpisode) return
    return updateSeriesStatus(seriesId, seasonNum, currentEpisode.id, currentTime, duration)
  }

  function handleNext() {
    updateMediaState()
    if (hasNext) setEpisodeNum(hasNext)
  }

  useEffect(() => {
    const season = info.episodes[seasonNum]
    const episode = season.find(e => e.episode_num == episodeNum)
    if (episode) {
      currentEpisode = episode
      setUrl(`${baseUrl}/${episode!.id}.${episode!.container_extension}`)
    }
    if (parseInt(episodeNum) < season.length) {
      setHasNext((parseInt(episodeNum) + 1).toString())
    } else {
      setHasNext(undefined)
    }

  }, [episodeNum])
  

  useEffect(() => {
    return () => {
      if (duration) {
        updateMediaState()
        currentTime = 0;
        duration = 0;
      }
    }
  }, [])

  return (
    <>
      {url ? (
        <MediaPlayer
          title={`Episode ${episodeNum} - Season ${seasonNum}`}
          onPlaying={updateMediaState}
          currentTime={currentTimeStated}
          onTimeUpdate={time => currentTime = (time.currentTime)}
          onDurationChange={dur => duration = dur}
          onControlsChange={(isVisible: boolean) => setIsControls(isVisible)}
          onLoadStart={() => setIsControls(true)}
          className='h-screen'
          autoPlay
          src={url}
          >
          <MediaProvider className='player-wrapper' />
          <DefaultAudioLayout icons={defaultLayoutIcons} />
          <DefaultVideoLayout className='absolute bottom-0' icons={defaultLayoutIcons} />
          {hasNext && <Button onClick={handleNext} variant={'secondary'} className={`absolute p-6 text-md bottom-24 right-12 z-50 transition duration-100 ${isControls ? 'opacity-100' : 'opacity-0'}`}>Next episode</Button>}
        </MediaPlayer>
      ): <></>}
    </>
  )
}
import { MediaPlayer, MediaPlayerInstance, MediaProvider } from '@vidstack/react';
import { useEffect, useRef, useState } from 'react';
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import { useUserData } from '@/states/useUserData';
import { Button } from '@/components/ui/button';
import { EpisodeProps, SerieInfoProps } from 'electron/core/models/SeriesModels';
import { ExpandVideoButton } from '@/components/ExpandVideoButton';


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

  const player = useRef<MediaPlayerInstance>(null);
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
      const ep = season.find(e => e.episode_num == ((parseInt(episodeNum) + 1).toString()))
      if (ep) {
        const extensions = ['mp4', 'ogg', 'ogv', 'webm', 'mov', 'm4v']
        const isSup = extensions.includes(ep.container_extension)
        if (!isSup) return setHasNext(undefined)
      } 
      return setHasNext((parseInt(episodeNum) + 1).toString())
    }
    setHasNext(undefined)

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
          ref={player}
          title={`Episode ${episodeNum} - Season ${seasonNum}`}
          onPlaying={updateMediaState}
          currentTime={currentTimeStated}
          onTimeUpdate={time => currentTime = (time.currentTime)}
          onDurationChange={dur => duration = dur}
          onControlsChange={(isVisible: boolean) => setIsControls(isVisible)}
          className='h-screen'
          autoPlay
          src={url}
          >
          <MediaProvider className='player-wrapper' />
          <DefaultAudioLayout icons={defaultLayoutIcons} />
          <DefaultVideoLayout
            className='absolute bottom-0'
            icons={defaultLayoutIcons}
            slots={{
              googleCastButton: <ExpandVideoButton />
            }}
          />
          {hasNext &&
            <Button
              onClick={handleNext}
              variant={'secondary'}
              className={`absolute p-6 text-md bottom-24 right-12 z-50 transition duration-100 ${isControls ? 'opacity-100' : 'opacity-0'}`}
              >
              Next episode
            </Button>}
        </MediaPlayer>
      ): <></>}
    </>
  )
}
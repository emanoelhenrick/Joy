import { useSearchParams } from 'react-router-dom'
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { useEffect, useState } from 'react';
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import { useUserData } from '@/states/useUserData';


interface PlayerProps {
  url: string
  type: string
  data?: any
  currentTimeStated?: number
  title?: string
}

let currentTime = 0;
let duration = 0;

export function VideoPlayer({ url, type, data, currentTimeStated = 0, title }: PlayerProps) {
  if (!url) {
    const [searchParams] = useSearchParams()
    url = searchParams.get('url')!
    type = searchParams.get('type')!
  }
  const updateVodStatus = useUserData(state => state.updateVodStatus)

  const [_isControls, setIsControls] = useState(false)

  function updateMediaState() {
    if (type == 'vod') return updateVodStatus(data.id, currentTime, duration)
  }

  useEffect(() => {
    return () => {
      if (duration && type !== 'live') {
        updateMediaState()
        currentTime = 0;
        duration = 0;
      }
    }
  }, [])

  return (
    <MediaPlayer title={title} onPlaying={updateMediaState}
      currentTime={currentTimeStated}
      onTimeUpdate={time => currentTime = (time.currentTime)}
      onDurationChange={dur => duration = dur}
      onControlsChange={(isVisible: boolean) => setIsControls(isVisible)}
      onLoadStart={() => setIsControls(true)}
      className='h-screen'
      autoPlay
      src={url!}
      >
        <MediaProvider className='player-wrapper' />
        <DefaultAudioLayout icons={defaultLayoutIcons} />
        <DefaultVideoLayout className='absolute bottom-0' icons={defaultLayoutIcons} />
    </MediaPlayer>
  )
}
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { useEffect, useState } from 'react';
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import { useUserData } from '@/states/useUserData';
import { ExpandVideoButton } from '../../../../components/ExpandVideoButton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../../components/ui/alert-dialog';

interface PlayerProps {
  url: string
  data?: any
  currentTimeStated?: number
  title?: string
}

let currentTime = 0;
let duration = 0;

export function VodPlayer({ url, data, currentTimeStated = 0, title }: PlayerProps) {
  const updateVodStatus = useUserData(state => state.updateVodStatus)
  const [isAlert, setIsAlert] = useState(false)
  const [continueWatching, setContinueWatching] = useState(false)

  const [_isControls, setIsControls] = useState(false)

  function updateMediaState() {
    const progress = parseFloat(((currentTime / duration) * 100).toFixed(2))
    const watching = progress < 95
    return updateVodStatus(data.id, currentTime, duration, watching)
  }

  function continueWatchingTheVideo() {
    setIsAlert(false)
    setContinueWatching(true)
  }

  function formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedTime = `${hours}:${minutes}:${remainingSeconds}`;
    return formattedTime;
  }

  useEffect(() => {
    if (currentTimeStated > 0) setIsAlert(true)

    return () => {
      if (duration) {
        updateMediaState()
        currentTime = 0;
        duration = 0;
      }
    }
  }, [])

  return (
    <MediaPlayer title={title} onPlaying={updateMediaState}
      streamType='on-demand'
      currentTime={continueWatching ? currentTimeStated : 0}
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
        <DefaultVideoLayout
          slots={{
            googleCastButton: <ExpandVideoButton />
          }}
          className='absolute bottom-0'
          icons={defaultLayoutIcons}
        />

        <AlertDialog open={isAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{`Would you like to continue where you left off at ${formatTime(currentTimeStated)}?`}</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsAlert(false)}>from start</AlertDialogCancel>
              <AlertDialogAction onClick={continueWatchingTheVideo}>continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </MediaPlayer>
  )
}
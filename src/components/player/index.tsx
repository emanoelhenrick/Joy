import { useSearchParams } from 'react-router-dom'
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { useEffect, useState } from 'react';
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import { useUserData } from '@/states/useUserData';
import { ExpandVideoButton } from '../ExpandVideoButton';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

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
  const [isAlert, setIsAlert] = useState(false)
  const [continueWatching, setContinueWatching] = useState(false) 
  const { toast } = useToast()

  const [_isControls, setIsControls] = useState(false)

  function updateMediaState() {
    if (type == 'vod') {
      const progress = parseFloat(((currentTime / duration) * 100).toFixed(2))
      const watching = progress < 95
      return updateVodStatus(data.id, currentTime, duration, watching)
    } 
  }
  
  function onHlsError() {
    toast({
      title: 'The format of this video is not yet supported',
      description: 'Sorry for the inconvenience, while the function is not implemented, try another channel',
      variant: 'destructive'
    })
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
      if (duration && type !== 'live') {
        updateMediaState()
        currentTime = 0;
        duration = 0;
      }
    }
  }, [])

  return (
    <MediaPlayer title={title} onPlaying={updateMediaState}
      currentTime={continueWatching ? currentTimeStated : 0}
      onHlsError={onHlsError}
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
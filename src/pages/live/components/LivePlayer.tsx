import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { useState } from 'react';
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import { useToast } from '@/hooks/use-toast';

interface PlayerProps {
  url: string
  title?: string
  setIsSupported: (bool: boolean) => void
}

export function LivePlayer({ url, title, setIsSupported }: PlayerProps) {
  const { toast } = useToast()
  const [_isControls, setIsControls] = useState(false)
  const [update, setUpdate] = useState(false)
 
  function onHlsError(error: any) {
    setUpdate(prev => !prev)
    if (!error.reason.includes('Unsupported')) return
    setIsSupported(false)
    toast({
      title: 'The format of this video is not yet supported',
      description: 'Sorry for the inconvenience, while the function is not implemented, try another channel',
      variant: 'destructive'
    })
  }

  return (
    <MediaPlayer title={title}
      onHlsError={onHlsError}
      onControlsChange={(isVisible: boolean) => setIsControls(isVisible)}
      onLoadStart={() => setIsControls(true)}
      onWaiting={() => setUpdate(prev => !prev)}
      className='block player-wrapper'
      autoPlay
      src={url!}
      >
        <MediaProvider />
        <DefaultAudioLayout icons={defaultLayoutIcons} />
        <DefaultVideoLayout
          className='absolute bottom-0'
          icons={defaultLayoutIcons}
          slots={{
            googleCastButton: <></>
          }}
        />
    </MediaPlayer>
  )
}
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
}

export function LivePlayer({ url, title }: PlayerProps) {
  const { toast } = useToast()
  const [_isControls, setIsControls] = useState(false)
 
  function onHlsError() {
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
      className='block player-wrapper'
      streamType='live'
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
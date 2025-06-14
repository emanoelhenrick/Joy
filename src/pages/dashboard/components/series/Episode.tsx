import { Fade } from "react-awesome-reveal"
import { FaPlay } from "react-icons/fa"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { useMemo, useState } from "react"
import { HugeiconsIcon } from '@hugeicons/react';
import { PlayIcon } from '@hugeicons/core-free-icons';

interface Props {
  imageSrc: string
  cover: string
  progress: number
  title: string
  duration: string
}

export function Episode({ imageSrc, cover, progress, title, duration }: Props) {

  const [isError, setIsError] = useState(false)

  const statedCover = useMemo(() => {
    return cover
  }, [])

  return (
    <div className="w-72 2xl:w-80 cursor-pointer group relative">
      <Fade duration={500} className="z-10">
        <div className="relative group-hover:opacity-80 duration-300 bg-secondary transition ease-out flex items-center aspect-video justify-center overflow-hidden rounded-3xl ">
          {
            (imageSrc && !isError) ? <LazyLoadImage onError={() => setIsError(true)} src={imageSrc} className="w-full h-full group-hover:scale-100 scale-105 duration-300 transition ease-out object-cover opacity-90" />
            : <LazyLoadImage src={statedCover} className="object-cover w-full h-full group-hover:scale-100 scale-105 duration-300 transition ease-out opacity-90" />
          }
          <HugeiconsIcon icon={PlayIcon} className="fill-white absolute size-14 z-10 opacity-80" />
          
          <div className="inset-0 w-full absolute bg-gradient-to-b from-transparent to-background/95" />
        </div>
        <div className="flex flex-col gap-0 w-full mt-2 z-10">
          <h1 className="whitespace-normal text-base font-medium">{title}</h1>
          <h1 className="text-sm 2xl:text-base text-primary/50 font-medium">{duration}</h1>
        </div>
          {
          progress > 0 &&
          <div className="absolute w-full bottom-16 h-1.5 z-10 px-5 opacity-90">
            <div className="relative w-full h-full">
              <div style={{ width: `${progress}%`}} className="transition absolute z-10 h-full bg-primary rounded-full" />
              <div className="w-full transition h-full absolute bottom-0 bg-primary-foreground/50 rounded-full" />
            </div>
          </div>
          }
      </Fade>
    </div>
  )
}
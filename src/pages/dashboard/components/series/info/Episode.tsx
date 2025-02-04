import { Fade } from "react-awesome-reveal"
import { FaPlay } from "react-icons/fa"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { useMemo, useState } from "react"

interface Props {
  imageSrc: string
  cover: string
  progress: number
  episodeNumber: number
  duration: string
}

export function Episode({ imageSrc, cover, progress, episodeNumber, duration }: Props) {

  const [isError, setIsError] = useState(false)

  const statedCover = useMemo(() => {
    return cover
  }, [])

  return (
    <div className="w-72 2xl:w-80 cursor-pointer group relative">
      <Fade duration={500} className="z-10">
        <div className="relative shadow-lg group-hover:opacity-80 duration-300 transition ease-out flex items-center aspect-video justify-center overflow-hidden rounded-lg">
          {
            (imageSrc && !isError) ? <LazyLoadImage onError={() => setIsError(true)} src={imageSrc} className="w-full group-hover:scale-100 scale-105 duration-300 transition ease-out object-cover opacity-70" />
            : <LazyLoadImage src={statedCover} className="object-cover w-full h-full group-hover:scale-100 scale-105 duration-300 transition ease-out opacity-70" />
          }
          <FaPlay className="absolute  size-8" />
          
          <div className="inset-0 w-full absolute bg-gradient-to-b from-transparent to-background/80" />
        </div>
        <div className="flex flex-col absolute bottom-5 left-5 z-10">
          <span className="text-muted-foreground text-sm 2xl:text-base">{duration}</span>
          <h1 className="whitespace-normal text-sm 2xl:text-base font-semibold">{`Episode ${episodeNumber}`}</h1>
        </div>
          {
          progress > 0 &&
          <div className="absolute w-full bottom-3 h-1 z-10 px-5">
            <div className="relative w-full h-full">
              <div style={{ width: `${progress}%`}} className="transition absolute z-10 h-full bg-primary rounded-full" />
              <div className="w-full transition h-full absolute bottom-0 bg-primary-foreground rounded-full" />
            </div>
          </div>
          }
      </Fade>
    </div>
  )
}
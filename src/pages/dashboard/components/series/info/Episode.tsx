import { Progress } from "@/components/ui/progress"
import { Fade } from "react-awesome-reveal"
import { FaPlay } from "react-icons/fa"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { motion } from 'framer-motion'

interface Props {
  imageSrc: string
  cover: string
  progress: number
  episodeNumber: number
  description: string
}

export function Episode({ imageSrc, cover, progress, episodeNumber, description }: Props) {

  return (
    <div className="w-80 2xl:w-80 cursor-pointer group relative">
      <Fade duration={500} className="z-10">
        <div className="relative shadow-lg group-hover:opacity-80 flex items-center aspect-video justify-center overflow-hidden rounded-lg">
          {
            imageSrc ? <LazyLoadImage src={imageSrc} className="w-full object-cover opacity-70" />
            : <LazyLoadImage src={cover} className="object-cover w-full h-full opacity-70" />
          }
          <FaPlay className="absolute  size-8" />
          
          <div className="inset-0 w-full absolute bg-gradient-to-b from-transparent to-background/80" />
        </div>
        <div className="flex flex-col absolute bottom-5 left-5 z-10">
          <span className="text-muted-foreground">43m</span>
          <span className="whitespace-normal text-lg font-bold">{`Episode ${episodeNumber}`}</span>
        </div>
          {
          progress > 0 &&
          <div className="absolute w-full bottom-3 h-0.5 z-10 px-5">
            <div style={{ width: `${progress}%`}} className="w-1/2 transition h-full bg-primary rounded-full" />
          </div>
          }
      </Fade>
    </div>
  )
}
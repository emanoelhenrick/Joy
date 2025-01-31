import { Progress } from "@/components/ui/progress"
import { Fade } from "react-awesome-reveal"
import { FaPlay } from "react-icons/fa"
import { LazyLoadImage } from "react-lazy-load-image-component"

interface Props {
  imageSrc: string
  cover: string
  progress: number
  episodeNumber: number
  description: string
}

export function Episode({ imageSrc, cover, progress, episodeNumber, description }: Props) {

  return (
    <div className="w-56 2xl:w-64 cursor-pointer hover:opacity-80">
      <Fade duration={500}>
        <div className="relative shadow-lg flex items-center aspect-video justify-center overflow-hidden rounded-lg">
          {
            imageSrc ? <LazyLoadImage src={imageSrc} width={256} className="h-full object-cover opacity-70" />
            : <img src={cover} className="object-cover w-full h-full opacity-70" />
          }
          <FaPlay className="absolute  size-8" />
          {
            progress > 0 &&
            <div className="absolute w-full transition bottom-0 h-fit">
              <Progress value={progress} className="w-full transition h-1 rounded-none" />
            </div>
          }
        </div>
      </Fade>
      <p className="whitespace-normal text-base font-bold mt-3">{`Episode ${episodeNumber}`}</p>
      <span className="text-wrap text-sm text-muted-foreground line-clamp-2 2xl:line-clamp-3">{description}</span>
    </div>
  )
}
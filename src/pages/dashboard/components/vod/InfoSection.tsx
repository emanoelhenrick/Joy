import { RatingStars } from "@/components/RatingStars"
import { Skeleton } from "@/components/ui/skeleton"
import { TitleLogo } from "moviedb-promise"
import { Fade } from "react-awesome-reveal"

interface Props {
  title: string
  releaseDate: string
  genre: string
  description: string
  cast: string
  director: string
  logos: TitleLogo[]
  rating: any
  duration: string
}

export function InfoSection({ title, releaseDate, description, director, genre, logos, rating, duration }: Props) {

  function getRightLogo(logos: TitleLogo[]) {
    if (!logos) return
    if (logos.length === 0) return
    const filteredByAspectRatio = logos.filter(l => l.aspect_ratio! > 1.3 && l.aspect_ratio! < 12)
    if (filteredByAspectRatio.length > 0) {
      const filteredByIso = filteredByAspectRatio.filter(l => l.iso_639_1 === 'en')
      if (filteredByIso.length === 0) {
        const filteredByIsoNull = filteredByAspectRatio.filter(l => l.iso_639_1 === null)
        if (filteredByIsoNull.length === 0) return `https://image.tmdb.org/t/p/w500${filteredByAspectRatio[0].file_path}`
        return `https://image.tmdb.org/t/p/w500${filteredByIsoNull[0].file_path}`  
      }
      return `https://image.tmdb.org/t/p/w500${filteredByIso[0].file_path}`
    }
    const filteredByIso = logos.filter(l => l.iso_639_1 === 'en')
    if (filteredByIso.length === 0) return `https://image.tmdb.org/t/p/w500${logos[0].file_path}`
    return `https://image.tmdb.org/t/p/w500${filteredByIso[0].file_path}`
  }

  const logoPath = getRightLogo(logos)

  return (
    <div>
        <div className="max-w-96 h-fit">
          <Fade triggerOnce>
            {logoPath !== undefined ? (
                  <img key={'logo'} className="object-contain max-h-40" src={logoPath} alt="" />
            ) : <h1 className="text-5xl">{title || <Skeleton className="h-16" />}</h1>}
          </Fade>
        </div>

        {(releaseDate || genre || rating || duration) && (
          <div className="flex items-center gap-6 mt-4 py-1 animate-fade font-semibold">
            {releaseDate && <h1 style={{ lineHeight: 1}} className="text-base 2xl:text-lg text-muted-foreground">{releaseDate}</h1>}
            {duration && <h1 style={{ lineHeight: 1}} className="text-base 2xl:text-lg text-muted-foreground">{duration}</h1>}
            {genre && <h1 style={{ lineHeight: 1}} className="text-base 2xl:text-lg text-muted-foreground">{genre}</h1>}
            {director && (
              <h1 style={{ lineHeight: 1}} className="text-base 2xl:text-lg text-muted-foreground">
                {director && 'By ' + director}
              </h1>
            )}
            {rating && <RatingStars rating={parseFloat(rating)} />}
          </div>
        )}
      
        <div className="mt-2 animate-fade">
          {description && <span className="text-base 2xl:text-lg max-w-screen-md 2xl:max-w-screen-lg text-primary line-clamp-6">{description}</span>}
        </div>
    </div>
  )
    
}
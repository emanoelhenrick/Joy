import { RatingStars } from "@/components/RatingStars"
import { TmdbCast } from "@/components/TmdbCast";
import { Skeleton } from "@/components/ui/skeleton"
import { Cast, TitleLogo } from "moviedb-promise"
import { useCallback, useState } from "react";
import { Fade } from "react-awesome-reveal"
import { GoPersonFill } from "react-icons/go";
import { LazyLoadImage } from "react-lazy-load-image-component";

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
  tmdbCast: Cast[]
}

export function InfoSection({ title, releaseDate, cast, tmdbCast, description, director, genre, logos, rating, duration }: Props) {

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
            <div className="flex items-center gap-3 mt-4 py-1 animate-fade">
            {releaseDate && <span style={{ lineHeight: 1}} className="text-base backdrop-blur-md 2xl:text-lg text-muted-foreground bg-primary/10 rounded-sm px-2 py-1">{releaseDate}</span>}
            {duration && <span style={{ lineHeight: 1}} className="text-base backdrop-blur-md 2xl:text-lg text-muted-foreground bg-primary/10 rounded-sm px-2 py-1">{duration}</span>}
            {genre && <span style={{ lineHeight: 1}} className="text-base backdrop-blur-md 2xl:text-lg text-muted-foreground bg-primary/10 rounded-sm px-2 py-1">{genre}</span>}
            {rating && <RatingStars rating={parseFloat(rating)} />}
          </div>
        )}
      
        <div className="mt-2 space-y-2 animate-fade">
          {description && <span className="text-base 2xl:text-lg max-w-screen-md 2xl:max-w-screen-lg text-primary line-clamp-6">{description}</span>}
          
          {(cast || director || tmdbCast) && (
            <div className="space-y-4">
              <h1 className="text-sm 2xl:text-base text-muted-foreground max-w-screen-md 2xl:max-w-screen-lg">
                {director && 'Directed by ' + director}
              </h1>
              <div className="flex gap-8 w-fit">
                {(tmdbCast && tmdbCast.length > 0) ? <TmdbCast tmdbCast={tmdbCast}  /> : (
                  <p className="truncate text-sm 2xl:text-base max-w-xl text-muted-foreground">
                    {cast}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-base mt-4 text-muted-foreground max-w-screen-md 2xl:max-w-screen-lg animate-fade">{title}</div>
    </div>
  )
    
}
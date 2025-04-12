import { RatingStars } from "@/components/RatingStars"
import { TmdbCast } from "@/components/TmdbCast"
import { Cast, TitleLogo } from "moviedb-promise"
import { useState } from "react"
import { PiCheck, PiPlus } from "react-icons/pi"

interface Props {
  title: string
  releaseDate: number
  genre: string
  description: string
  cast: string
  director: string
  rating: any
  logos: TitleLogo[]
  tmdbCast: Cast[]
  handleFavorite: () => void
  isFetching: boolean
  favorite: boolean
}

export function InfoSection({ title, releaseDate, genre, description, cast, tmdbCast, director, rating, logos, handleFavorite, isFetching, favorite }: Props) {
  const [isTitleVisible, setIsTitleVisible] = useState(false)
  
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
    <div className="px-16 py-0 h-fit z-10">
      <div className="max-w-md 2xl:max-w-xl h-fit w-full">
        {(logoPath !== undefined) ? (
            <div onClick={() => setIsTitleVisible(prev => !prev)} className="relative h-full cursor-pointer hover:opacity-80 transition-opacity">
              <img key={'logo'} className={`absolute bottom-0 object-cover transition-opacity max-h-32 2xl:max-h-40 ${isTitleVisible ? 'opacity-0' : 'opacity-100'}`} src={logoPath} alt="" />
              <h1 className={`text-5xl 2xl:text-5xl line-clamp-4 transition-opacity ${isTitleVisible ? 'opacity-100' : 'opacity-0'}`}>{title}</h1>
            </div>
        ) : <h1 className="text-4xl 2xl:text-5xl line-clamp-4">{title}</h1>}
      </div>

      <div className="flex items-center mt-2 gap-1 uppercase font-semibold">
        {((releaseDate && releaseDate != 0) || genre || rating) && (
          <div className="flex items-center gap-6 py-1 animate-fade">
            {(releaseDate && releaseDate != 0) && <h1 style={{ lineHeight: 1}} className="text-base 2xl:text-lg text-muted-foreground">{releaseDate}</h1>}
            {genre && <h1 style={{ lineHeight: 1}} className="text-base 2xl:text-lg text-muted-foreground">{genre}</h1>}
            {rating && <RatingStars rating={parseFloat(rating)} />}
          </div>
        )}

        <button onClick={handleFavorite} disabled={isFetching} className="p-2 rounded-full hover:bg-primary/10 transition-none">
          {favorite ? <PiCheck className="size-5" /> : <PiPlus className="size-5" />}
        </button>
      </div>

      <div className="max-w-screen-md 2xl:max-w-screen-lg mt-1.5 flex flex-col gap-4">
        {description && <span className="text-base 2xl:text-lg text-primary line-clamp-4 2xl:line-clamp-6">{description}</span>}

        {(cast || director || tmdbCast) && (
          <div className="space-y-2">
            {director && <h1 className="text-sm 2xl:text-base text-muted-foreground max-w-screen-md 2xl:max-w-screen-lg">
              {'Directed by ' + director}
            </h1>}
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
      
    </div>
  )
}
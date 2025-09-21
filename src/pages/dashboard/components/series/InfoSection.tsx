import { RatingStars } from "@/components/RatingStars"
import { TitleLogo } from "moviedb-promise"
import { useState } from "react"

interface Props {
  title: string
  releaseDate: number
  genre: string
  description: string
  director: string
  rating: any
  logos: TitleLogo[],
}

export function InfoSection({ title, releaseDate, genre, description, director, rating, logos }: Props) {
  const [isTitleVisible, setIsTitleVisible] = useState(false)
  
  function getRightLogo(logos: TitleLogo[]) {
    if (!logos) return
    if (logos.length === 0) return
    const filteredByIso = logos.filter(l => (l.iso_639_1 === 'en') || (l.iso_639_1 === 'pt'))
    if (filteredByIso.length > 0) {
      const filteredByAspectRatio = filteredByIso.filter(l => l.aspect_ratio! > 1.3 && l.aspect_ratio! < 12)
      if (filteredByAspectRatio.length === 0) {
        return `https://image.tmdb.org/t/p/w500${filteredByIso[0].file_path}`
      }
      return `https://image.tmdb.org/t/p/w500${filteredByAspectRatio[0].file_path}`
    }
    return `https://image.tmdb.org/t/p/w500${logos[0].file_path}`
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

      <div className="flex items-center mt-3 gap-1 font-semibold">
        {((releaseDate && releaseDate != 0) || genre || rating) && (
          <div className="flex items-center gap-3 py-1 animate-fade">
            {genre && <h1 style={{ lineHeight: 1}} className="text-sm px-3 py-1.5 rounded-lg bg-primary/10 2xl:text-base text-primary/60">{genre}</h1>}
            {(releaseDate && releaseDate != 0) && <h1 style={{ lineHeight: 1}} className="text-sm px-3 py-1.5 bg-primary/10 rounded-lg 2xl:text-base text-primary/60">{releaseDate}</h1>}
            {director && <h1 style={{ lineHeight: 1}} className="text-sm px-3 py-1.5 bg-primary/10 rounded-lg 2xl:text-base text-primary/60">
              {'By ' + director}
            </h1>}
            {rating && <RatingStars rating={parseFloat(rating)} />}
          </div>
        )}
      </div>

      <div className="max-w-screen-md 2xl:max-w-screen-lg mt-1.5">
        {description && <span className="text-base 2xl:text-lg text-primary line-clamp-4 2xl:line-clamp-6">{description}</span>}
      </div>
    </div>
  )
}
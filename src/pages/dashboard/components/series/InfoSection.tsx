import { RatingStars } from "@/components/RatingStars"
import { TitleLogo } from "moviedb-promise"

interface Props {
  title: string
  releaseDate: number
  genre: string
  description: string
  cast: string
  director: string
  rating: any
  logos: TitleLogo[]
}

export function InfoSection({ title, releaseDate, genre, description, cast, director, rating, logos }: Props) {
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
      <div className="max-w-96 2xl:max-w-[500px] h-fit">
        {logoPath !== undefined ? (
            <img key={'logo'} className="object-cover max-h-32 2xl:max-h-40" src={logoPath} alt="" />
        ) : <h1 className="text-4xl 2xl:text-5xl">{title}</h1>}
      </div>

      {((releaseDate && releaseDate != 0) || genre || rating) && (
        <div className="flex items-center gap-3 mt-4 py-1">
          {(releaseDate && releaseDate != 0) && <span style={{ lineHeight: 1}} className="text-base backdrop-blur-sm 2xl:text-lg text-muted-foreground bg-primary/10 rounded-sm px-2 py-1">{releaseDate}</span>}
          {genre && <span style={{ lineHeight: 1}} className="text-base 2xl:text-lg backdrop-blur-sm text-muted-foreground bg-primary/10 rounded-sm px-2 py-1">{genre}</span>}
          {rating && <RatingStars rating={parseFloat(rating)} />}
        </div>
      )}

      <div className="max-w-screen-md 2xl:max-w-screen-lg mt-1.5 flex flex-col gap-2">
        {description && <span className="text-base 2xl:text-lg text-primary line-clamp-4 2xl:line-clamp-6">{description}</span>}
        <div>
          <p className="text-sm 2xl:text-base truncate max-w-xl text-muted-foreground">{cast}</p>
          <p className="text-sm 2xl:text-base text-muted-foreground">{director && 'Directed by ' + director}</p>
        </div>
      </div>
      <span className="text-sm 2xl:text-base text-muted-foreground">Title: {title}</span>
    </div>
  )
}
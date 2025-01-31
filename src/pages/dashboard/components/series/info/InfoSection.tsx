import { format } from "date-fns"

interface Props {
  title: string
  releaseDate: string
  genre: string
  description: string
  cast: string
  director: string
}

export function InfoSection({ title, releaseDate, genre, description, cast, director }: Props) {

  return (
    <div className="p-16 pb-0 h-fit z-10">
      <h1 className="text-5xl font-semibold line-clamp-1 max-w-screen-xl">{title}</h1>

      <div className="flex items-center gap-4 mt-2">
        { releaseDate && <span className="text-base 2xl:text-lg text-muted-foreground">{format(releaseDate, 'u')}</span>}
        {genre && <span className="text-base 2xl:text-lg text-muted-foreground">{genre}</span>}
      </div>

      <div className="max-w-screen-lg mt-2 flex flex-col gap-2">
        {description && <span className="text-lg 2xl:text-xl text-primary line-clamp-4 2xl:line-clamp-6">{description}</span>}
        <div>
          <p className="text-sm 2xl:text-base truncate max-w-xl text-muted-foreground">{cast}</p>
          <p className="text-sm 2xl:text-base text-muted-foreground">{director && 'Directed by ' + director}</p>
        </div>
      </div>
    </div>
  )
}
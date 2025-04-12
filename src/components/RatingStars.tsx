import { FaStar } from "react-icons/fa"

export function RatingStars({ rating, blur = true }: { rating: number, blur?: boolean }) {
  if (!rating || rating == 0) return <></>
  const ratingFloat = rating < 10 ? rating.toFixed(1) : 10

  return (
    <div className={`mr-2 flex items-center gap-1.5`}>
      <FaStar className="opacity-50 size-3 2xl:size-3.5" />
      <h1 style={{ lineHeight: 1 }} className="text-muted-foreground text-base 2xl:text-lg">{ratingFloat}</h1>
    </div>
  )
}


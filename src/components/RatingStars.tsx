import { FaStar } from "react-icons/fa"

export function RatingStars({ rating }: { rating: number }) {
  if (!rating || rating == 0) return <></>
  const ratingFloat = rating < 10 ? rating.toFixed(1) : 10

  return (
    <div className="px-2 py-1 bg-primary/10 rounded-sm backdrop-blur-md mr-2 flex items-center gap-1.5">
      <div style={{ lineHeight: 1 }} className="text-muted-foreground text-base 2xl:text-lg">{ratingFloat}</div>
      <FaStar className="opacity-50 size-3 2xl:size-3.5" />
    </div>
  )
}


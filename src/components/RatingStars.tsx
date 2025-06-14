import { HugeiconsIcon } from '@hugeicons/react';
import { StarIcon } from '@hugeicons/core-free-icons';

export function RatingStars({ rating }: { rating: number }) {
  if (!rating || rating == 0) return <></>
  const ratingFloat = rating < 10 ? rating.toFixed(1) : 10

  return (
    <div className={`mr-2 flex items-center gap-1.5`}>
      <HugeiconsIcon
        icon={StarIcon}
        strokeWidth={0.5}
        className="opacity-50 size-3.5 fill-primary"
      />
      <h1 style={{ lineHeight: 1 }} className="text-muted-foreground text-base 2xl:text-lg">{ratingFloat}</h1>
    </div>
  )
}


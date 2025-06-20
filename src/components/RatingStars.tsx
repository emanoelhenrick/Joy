import { HugeiconsIcon } from '@hugeicons/react';
import { StarIcon } from '@hugeicons/core-free-icons';

export function RatingStars({ rating }: { rating: number }) {
  if (!rating || rating == 0) return <></>
  const ratingFloat = rating < 10 ? rating.toFixed(1) : 10

  return (
    <div className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-primary/10`}>
      <HugeiconsIcon
        icon={StarIcon}
        strokeWidth={0.5}
        className="opacity-60 size-3 fill-primary"
      />
      <h1 style={{ lineHeight: 1 }} className="text-primary/60 text-sm 2xl:text-base">{ratingFloat}</h1>
    </div>
  )
}


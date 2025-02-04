import { Bounce, Fade } from "react-awesome-reveal"
import { FaStar } from "react-icons/fa"

export function RatingStars({ rating }: { rating: number }) {
  if (!rating || rating == 0) return <></>

  const fiveRating = (rating / 2)
  const fullStars = Math.trunc(fiveRating)
  const isDouble = fiveRating > fullStars
  
  const stars = []
  for (let index = 0; index < fullStars; index++) stars.push(1)

  if (isDouble) {
    const factor = Math.pow(10, 1);
    const value =  Math.floor(parseFloat((fiveRating - fullStars).toFixed(2)) * factor) / factor;
    stars.push(value)
  }
  
  const zeroStars = 5 - stars.length
  for (let index = 0; index < zeroStars; index++) {
    stars.push(0)
  }

  const HalfStar = ({ value }: { value: number }) => {
    return (
      <div className="relative">
        <FaStar className="opacity-40 size-3.5" />
        <div style={{ width: `${value * 100}%`}} className="absolute top-0 overflow-hidden">
          <FaStar className="text-primary size-3.5" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-1 items-center">
      <Fade cascade delay={200} duration={500} damping={0.1} direction="right" triggerOnce>
        {stars.map((star, index) => {
          if (star === 0) return <FaStar key={index} className="opacity-40 size-3.5" />
          if (star < 1) return <HalfStar value={star} />
          return <FaStar className="text-primary size-3.5" />
        })}
        <span className="ml-1 leading-none font-medium text-muted-foreground text-sm">{fiveRating.toFixed(1)}</span>
      </Fade>
    </div>
  )
}


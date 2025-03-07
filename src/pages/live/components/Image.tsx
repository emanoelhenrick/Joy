import { useState } from "react"

export function LiveImage({ src }: { src: string }) {
  const [isOk, setIsOk] = useState(true)
  return (
    isOk && (<img onError={() => setIsOk(false)} className="size-24 aspect-square rounded-lg" src={src} />)
  )
}
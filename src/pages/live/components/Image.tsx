import { useState } from "react"

export function LiveImage({ src }: { src: string }) {
  const [isOk, setIsOk] = useState(true)
  return (
    isOk && (<img onError={() => setIsOk(false)} className="h-12 aspect-square rounded-lg" src={src} />)
  )
}
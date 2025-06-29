import { LazyLoadImage } from "react-lazy-load-image-component";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ImageNotFound01Icon } from "@hugeicons/core-free-icons";

export function Cover({ src, title }: { src: string, title: string }) {
  const [img, setImg] = useState(src ? true : false)

  function getImageTmdb() {
    if (!src) return
    if (!src.includes('tmdb')) return src
    const stringList = src.split('/')
    return `https://image.tmdb.org/t/p/w185/${stringList[stringList.length - 1]}`
  }

  const imagePath = getImageTmdb()
  
  return (
    <div style={{ aspectRatio: '2/3' }} className={`group w-full`}>
      <div className="w-full h-full bg-primary-foreground overflow-hidden flex">
        {img ? (
          <LazyLoadImage
            width={150}
            height={300}
            src={imagePath}
            onError={() => setImg(false)}
            className={`w-full h-full object-cover`}
          />
        ) : (
          <div className="bg-primary-foreground w-full h-full p-4 flex justify-center items-center">
            <div className="h-full">
              <h1 className="text-md line-clamp-6 text-muted-foreground">{title}</h1>
            </div>
            <HugeiconsIcon icon={ImageNotFound01Icon} className="absolute text-muted-foreground" />
          </div>
        ) }
      </div>
    </div>
  )
}
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useState } from "react";

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
      <div className="w-full h-full bg-secondary rounded-lg overflow-hidden flex">
        {img ? (
          <LazyLoadImage
            width={150}
            height={300}
            src={imagePath}
            onError={() => setImg(false)}
            className={`w-full h-full object-cover`}
          />
        ) : (
          <div className="bg-secondary w-full h-full p-4">
            <h1 className="text-md line-clamp-6 text-muted-foreground">
              {title}
            </h1>
          </div>
        ) }
      </div>
    </div>
  )
}
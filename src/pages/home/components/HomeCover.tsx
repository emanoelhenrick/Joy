import { LazyLoadImage } from "react-lazy-load-image-component";
import { useState } from "react";

export function HomeCover({ src, title }: { src: string, title: string }) {
  const [img, setImg] = useState(src ? true : false)

  function getImageTmdb() {
    if (!src) return
    if (!src.includes('tmdb')) return src
    const stringList = src.split('/')
    return `https://image.tmdb.org/t/p/w185/${stringList[stringList.length - 1]}`
  }

  const imagePath = getImageTmdb()

  return (
    <div className={`group w-full`}>
      <div style={{ width: 154, aspectRatio: '2/3' }} className="bg-secondary transition rounded-lg overflow-hidden">
        {img ? (
          <LazyLoadImage
            src={imagePath}
            onError={() => setImg(false)}
            className={`bg-secondary object-cover h-full w-full`}
          />
        ) : <div className="bg-secondary w-full h-fit p-4">
          <h1 className="text-md line-clamp-6 text-muted-foreground">
            {title}
          </h1>
        </div>}
      </div>
    </div>
  )
}
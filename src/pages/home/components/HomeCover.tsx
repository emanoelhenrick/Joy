import { LazyLoadImage } from "react-lazy-load-image-component";
import { useState } from "react";

export function HomeCover({ src, title }: { src: string, title: string }) {
  const [img, setImg] = useState(src ? true : false)

  return (
    <div  className={`group w-full`}>
      <div style={{ width: 150, height: 225 }} className="bg-secondary rounded-lg overflow-hidden">
        {img ? (
          <LazyLoadImage
            width={150}
            height={300}
            src={src}
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
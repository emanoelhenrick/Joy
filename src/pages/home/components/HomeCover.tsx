import { LazyLoadImage } from "react-lazy-load-image-component";
import { useState } from "react";
import { useMeasure } from "@uidotdev/usehooks";

export function HomeCover({ src, title }: { src: string, title: string }) {
  const [img, setImg] = useState(src ? true : false)
  const [ref, { width }] = useMeasure();

  return (
    <div ref={ref} style={{ height: width ? width * 1.5 : '100%' }} className={`group w-full`}>
      <div className="bg-secondary rounded-lg overflow-hidden">
        {img ? (
          <LazyLoadImage
            width={150}
            height={300}
            src={src}
            onError={() => setImg(false)}
            className={`bg-secondary object-cover`}
          />
        ) : <div className="bg-secondary w-full h-full p-4">
          <h1 className="text-md line-clamp-6 text-muted-foreground">
            {title}
          </h1>
        </div>}
      </div>
    </div>
  )
}
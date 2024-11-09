import { useInView } from "react-intersection-observer";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Skeleton } from "./ui/skeleton";
import { useState } from "react";
import { Ban } from "lucide-react";

export function Cover({ src, title }: { src: string, title: string}) {
  const { ref, inView } = useInView({ rootMargin: '500px'});
  const [img, setImg] = useState(true)
  
  return (
    <div ref={ref} className={`relative group`}>
      <div className="w-36 h-52 relative bg-secondary rounded-lg overflow-hidden flex">
          { img ? (
            <LazyLoadImage
            height={231}
            src={src}
            width={154}
            onError={() => setImg(false)}
            className={`relative bg-secondary hover:opacity-80 object-fill ${!inView && 'hidden'}`}
            placeholder={<Skeleton className="w-36 h-full" />}
          />
          ) : <div className="bg-secondary p-4 text-md text-muted-foreground w-36 flex flex-col h-full">
              {title}
            </div>}
      </div>
    </div>
  )
}
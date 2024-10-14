import { useInView } from "react-intersection-observer";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Skeleton } from "./ui/skeleton";

export function Cover({ src }: { src: string}) {
  const { ref, inView } = useInView({ rootMargin: '500px'});
  
  return (
    <div ref={ref} className={`relative group`}>
      <div className="w-36 h-52 relative bg-secondary rounded-lg overflow-hidden flex">
          { src ? (
            <LazyLoadImage
            height={231}
            src={src}
            width={154}
            className={`relative bg-secondary hover:opacity-80 object-fill ${!inView && 'hidden'}`}
            placeholder={<Skeleton className="w-36 h-full" />}
          />
          ) : <div className="bg-secondary block w-36 h-fit"></div>}
      </div>
    </div>
  )
}
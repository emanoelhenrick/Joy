import { useInView } from "react-intersection-observer";
import { LazyLoadImage } from "react-lazy-load-image-component";

export function Cover({ src }: { src: string }) {
function replaceTMDBIMageSize(path: string) {
    if (path.includes('tmdb')) return path.replace(/w780/, "w154")
    return path
  }

  const { ref, inView } = useInView();

  return (
    <div ref={ref}>
      {src ? <LazyLoadImage
        height={231}
        src={replaceTMDBIMageSize(src)}
        width={154}
        className={`rounded-lg bg-secondary hover:opacity-80 transition-opacity ${!inView && 'invisible'}`}
        placeholder={(<div className="bg-secondary block w-[154px] h-[231px] rounded-lg"></div>)}
      /> : <div className="bg-secondary block w-[154px] h-[231px] rounded-lg"></div>}
    </div>
  )
}
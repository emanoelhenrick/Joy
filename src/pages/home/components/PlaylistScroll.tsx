import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { VodProps } from "@/core/models/VodModels";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function PlaylistScroll({ playlist, fetchMore }: { playlist: VodProps[], fetchMore: () => void }) {
  const { ref, inView,  } = useInView()

  useEffect(() => {
    if (inView) fetchMore();
  }, [inView])

  function replaceTMDBIMageSize(path: string) {
    if (path.includes('tmdb')) return path.replace(/w780/, "w154")
    return path
  }


  return (
    <div className="">
      <ScrollArea className="w-full whitespace-nowrap rounded-md h-fit">
        
        <div className="flex flex-wrap gap-6">
          {playlist.map((movie) => (
            <div className="flex flex-col gap-3 w-[154px] h-fit cursor-pointer" key={movie.stream_id}>
              {movie.stream_icon ?
                <LazyLoadImage
                  height={231}
                  src={replaceTMDBIMageSize(movie.stream_icon)}
                  width={154}
                  className="rounded-lg hover:opacity-80"
                  placeholder={(<div className="bg-secondary block w-[154px] h-[231] rounded-lg"></div>)}
                /> : <div className="bg-secondary block w-[154px] h-[231px] rounded-lg"></div>}
              <h3 className="text-wrap text-sm font-bold">{movie.title}</h3>
            </div>
          ))}
          <div ref={ref} className="block w-[154px] h-[231px] rounded-lg"></div>
        </div>

        <ScrollBar orientation="vertical" />
        
      </ScrollArea>
    </div>
  )
}
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import { MovieDb, TrendingResponse } from "moviedb-promise";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import electronApi from "@/config/electronApi";

export function Trending() {
  const [data, setData] = useState<TrendingResponse['results']>()

    async function fetchTrending() {
      const meta = await electronApi.getMetadata()
      if (!meta.tmdbKey) return
      const moviedb = new MovieDb(meta.tmdbKey)
      const res = await moviedb.trending({ media_type: 'all', time_window: 'week', language: 'pt-BR'})
      setData(res.results)
    }

    useEffect(() => {
      fetchTrending()
    }, [])

    const renderItem = useCallback((info: any) => {
      const releaseDate = format(info.release_date || info.first_air_date, "u")
      return (
        <CarouselItem> 
          <div className="flex items-center h-full justify-center rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr] 2xl:grid-cols-[3fr_2fr] h-full relative">
              <div className="p-12 flex flex-col justify-between gap-2">
                <div className="flex flex-col gap-3 z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-fit text-muted-foreground text-lg 2xl:text-xl">
                      Trending
                      <span className="ml-2 text-xs opacity-70">by TMDB</span>
                    </span>
                  </div>
                
                  <h1 className="text-5xl 2xl:text-6xl font-bold">{info.title || info.name}</h1>
                  <div className="flex items-center gap-2">
                    
                    <span className="w-fit text-sm 2xl:text-base px-2 py-1 2xl:py-0.5 rounded-md bg-primary-foreground text-white leading-none">
                      {info.media_type === 'movie' ? 'Movies' : 'Series'}
                    </span>
                    <span className="text-muted-foreground">{releaseDate}</span>
                  </div>
                  
                  <span className="text-sm 2xl:text-lg line-clamp-5 2xl:line-clamp-6 text-muted-foreground max-w-screen-md">{info.overview}</span>
                </div>
                <Button className="w-fit flex gap-2 justify-self-end z-10">
                  Search for matches
                </Button>
              </div>

              <div className="z-10 p-2 h-full">
                <img className="object-cover rounded-xl h-full shadow-lg z-20" src={`https://image.tmdb.org/t/p/w1280${info.backdrop_path}`} />
              </div>
            </div>

            <img className="absolute w-full z-0 blur-3xl opacity-20 scale-105" src={`https://image.tmdb.org/t/p/w300${info.backdrop_path}`} />
          </div>
        </CarouselItem>
      )
    }, [data])

  if (data) return (
    <section className="pr-3 mb-3 relative">
      <Carousel
        plugins={[Autoplay({ delay: 5000 })]}
        className="bg-background rounded-2xl overflow-hidden"
      >
        <CarouselContent>
          {data.map(info => renderItem(info))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 bottom-2 border-none bg-background/10" />
        <CarouselNext className="absolute right-2 bottom-2 border-none bg-background/10" />
      </Carousel>
    </section>
  )

  return <></>
}
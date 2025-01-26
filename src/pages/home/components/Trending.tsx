import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import { useCallback, useState } from "react";
import { format } from "date-fns";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useNavigate, useParams } from "react-router-dom";
import { useTrending } from "@/states/useTrending";
import { FaPlay } from "react-icons/fa";

export function Trending() {
  const navigate = useNavigate()
  const params = useParams()

  const data = useTrending(state => state.matches)
  
  function handleSearchForMatch(mediaType: string, search: string) {
    const type = mediaType === 'movie' ? 'vod' : 'series'
    navigate(`/dashboard/explore?type=${type}&search=${search}`)
  }

  const renderItem = useCallback((info: any) => {
    const releaseDate = format(info.release_date || info.first_air_date, "u")
    const perfectMatch = info.matches[0]

    const url = `/dashboard/home/${params.playlistName}/player?streamId=${perfectMatch.stream_id}&container_extension=${perfectMatch.container_extension}`

    return (
      <CarouselItem key={info.poster_path}> 
        <div className="flex items-center h-full justify-center rounded-2xl overflow-hidden">
          <div className="flex h-full w-full relative">
            <div className="p-16 flex flex-col justify-between gap-2 z-20">
              <div className="mb-3">
                <h1 className="w-fit text-muted-foreground text-base">
                  Trending
                </h1>
                <HoverCard openDelay={400}>
                  <HoverCardTrigger>
                  <h1 className="text-xs w-fit opacity-50 hover:opacity-40 cursor-pointer">by TMDB</h1>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <span className="text-sm">
                    TMDB is an external service that provides data about films and series and has no relation to your private playlist.
                    </span>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="flex flex-col gap-3 z-10">
                <h1 className="text-5xl 2xl:text-6xl font-bold">{info.title || info.name}</h1>
                <div className="flex items-center gap-2">
                  
                  <span className="w-fit text-sm 2xl:text-base px-2 py-1 2xl:py-0.5 rounded-md bg-primary text-background leading-none">
                    {info.media_type === 'movie' ? 'Movies' : 'Series'}
                  </span>
                  <span className="text-muted-foreground">{releaseDate}</span>
                </div>
                
                <span className="text-sm 2xl:text-base line-clamp-5 text-muted-foreground max-w-screen-sm">{info.overview}</span>
                <div className="flex gap-3 items-center">
                  <div className="mt-2 flex gap-3 bg-primary/5 backdrop-blur-3xl shadow-lg p-3 rounded-lg pr-4 relative">
                    <img className="w-16 rounded-md " src={perfectMatch.stream_icon || perfectMatch.cover} alt="" />

                    <div className="flex flex-col justify-between">
                      <div>
                        <h1 className="text-xs text-muted-foreground">Perfect match</h1>
                        <span className="text-xl">{perfectMatch.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => navigate(url)}
                          className="flex-1 px-6 flex gap-2 bg-primary/10 text-primary hover:text-background">
                          <FaPlay className="size-3 opacity-90" />
                          <span>Watch</span>
                        </Button>
                        <Button onClick={() => handleSearchForMatch(info.media_type, info.title || info.name)} variant={"ghost"} className="hover:bg-primary/10">See matches</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="z-10 w-full h-full absolute flex items-center justify-start">
            <div className="inset-0 w-full h-full bg-gradient-to-l from-transparent to-background/95" />
          </div>
          <img className="absolute w-full h-full object-cover" src={`https://image.tmdb.org/t/p/original${info.backdrop_path}`} />
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
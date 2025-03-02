import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useNavigate } from "react-router-dom";
import { useTrending } from "@/states/useTrending";
import { FaPlay } from "react-icons/fa";
import { MovieMatch } from "electron/core/services/fetchTmdbTrending";
import { TitleLogo } from "moviedb-promise";
import { VlcDialog } from "@/pages/dashboard/components/VlcDialog";
import electronApi from "@/config/electronApi";
import { usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useUserData } from "@/states/useUserData";
import { VodProps } from "electron/core/models/VodModels";

export function Trending({ refresh, slideActive }: { refresh: () => void, slideActive: boolean }) {
  const navigate = useNavigate()

  const [selectedMovie, setSelectedMovie] = useState<VodProps | undefined>(undefined)
  const [state, setState] = useState<any>(undefined)

  const baseUrl = usePlaylistUrl(state => state.urls.getVodStreamUrl)
  const data = useTrending(state => state.matches)
  const updateVodStatus = useUserData(state => state.updateVodStatus)

  function updateUserStatus(data: { length: number, time: number }) {
    if (!selectedMovie) return
    setState({
      id: selectedMovie.stream_id,
      data: data
    })
  }

  useEffect(() => {
    if (!selectedMovie && state) {
      if (!state) return
      const { time, length } = state.data
      updateVodStatus(
        state.id.toString(),
        time,
        length,
        time / length < 0.95
      )
      setState(undefined)
      setTimeout(refresh, 100)
    }
  }, [selectedMovie, updateVodStatus])

  function handleSearchForMatch(mediaType: string, search: string) {
    const type = mediaType === 'movie' ? 'vod' : 'series'
    navigate(`/dashboard/explore?type=${type}&search=${search}`)
  }

  const renderItem = useCallback((info: MovieMatch) => {
    function getRightLogo(logos: TitleLogo[]) {
      if (!logos) return
      if (logos.length === 0) return
      const filteredByIso = logos.filter(l => l.iso_639_1 === 'pt-BR' || l.iso_639_1 === 'en')
      if (filteredByIso.length === 0) return `https://image.tmdb.org/t/p/w500${logos[0].file_path}`
      const filteredByAspectRatio = filteredByIso.filter(l => l.aspect_ratio! > 1.5 )
      if (filteredByAspectRatio.length === 0) return `https://image.tmdb.org/t/p/w500${filteredByIso[0].file_path}`
      return `https://image.tmdb.org/t/p/w500${filteredByAspectRatio[0].file_path}`
    }

    const releaseDate = format(info.release_date!, "u")
    const perfectMatch = info.matches![0]
    const logoPath = getRightLogo(info.images!.logos!)

    const userVodData = useUserData(state => state.userData.vod?.find(v => v.id == perfectMatch.stream_id))
    
    async function launchVlc() {
      setSelectedMovie(perfectMatch)
      const props = {
        path: `${baseUrl}${perfectMatch.stream_id}.${perfectMatch.container_extension}`,
        startTime: (userVodData && userVodData.currentTime) ? userVodData.currentTime : 0
      }
      await electronApi.launchVLC(props)
    }

    return (
      <CarouselItem key={info.poster_path}> 
        <div className="flex items-center h-full justify-center rounded-2xl overflow-hidden">
          <div className="flex h-full w-full relative">
            <div className="p-12 flex flex-col justify-between gap-2 z-20">
              <div className="mb-3">
                <HoverCard openDelay={400}>
                  <HoverCardTrigger>
                  <h1 className="text-xs font-medium w-fit opacity-50 hover:opacity-40 cursor-pointer">by TMDB</h1>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <span className="text-sm">
                    TMDB is an external service that provides data about films and series and has no relation to your private playlist.
                    </span>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="flex flex-col gap-2 z-10">
                <div className="max-w-96 2xl:max-w-screen-sm h-fit">
                  { logoPath ? <img src={logoPath} className="object-contain w-fit max-h-28 2xl:max-h-36 mb-2 mt-2" /> : (
                    <h1 className="text-5xl 2xl:text-6xl font-bold">{info.title}</h1>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="w-fit text-sm 2xl:text-base px-2 py-1 2xl:py-0.5 rounded-md bg-primary/10 backdrop-blur-3xl text-primary leading-none">
                    Trending
                  </span>
                  <span className="text-muted-foreground">{releaseDate}</span>
                </div>

                <span className="text-base 2xl:text-lg line-clamp-4 text-muted-foreground max-w-screen-sm">{info.overview}</span>
                
                <div className="flex gap-3 items-center">
                  <div className="mt-1 flex gap-2 bg-primary/5 backdrop-blur-3xl shadow-lg p-3 rounded-xl pr-4 relative">
                    <img className="w-14 rounded-md" src={perfectMatch.stream_icon} alt="" />
                    <div className="flex flex-col justify-between">
                      <div>
                        <h1 className="text-xs text-muted-foreground">Perfect match</h1>
                        <h1 className="text-xl line-clamp-1 max-w-72">{perfectMatch.name}</h1>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={launchVlc}
                          className="flex-1 px-6 flex gap-2 bg-primary/10 text-primary hover:text-background">
                          <FaPlay className="size-3 opacity-90" />
                          <span>Watch</span>
                        </Button>
                        <Button onClick={() => handleSearchForMatch('movie', info.title!)} variant={"ghost"} className="hover:bg-primary/10">See matches</Button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="z-10 w-full h-full absolute flex items-end justify-start">
            <div className="inset-0 w-full h-full bg-gradient-to-l from-transparent to-background/95" />
          </div>
          <img className="absolute h-full w-full object-cover" src={`https://image.tmdb.org/t/p/original${info.backdrop_path}`} />
        </div>
      </CarouselItem>
    )
  }, [data])

  if (data) return (
    <section className="pr-4 mb-3 relative">
      <Carousel
        plugins={[Autoplay({ delay: 5000, active: (!selectedMovie && slideActive) })]}
        className="bg-background rounded-2xl overflow-hidden"
      >
        <CarouselContent>
          {data.map(info => renderItem(info))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-1 bottom-1 border-none bg-background/5" />
        <CarouselNext className="absolute right-1 bottom-1 border-none bg-background/5" />
      </Carousel>

      {selectedMovie && (
        <VlcDialog
          updateUserStatus={updateUserStatus}
          open={selectedMovie ? true : false}
          closeDialog={() => setSelectedMovie(undefined)}
        />
      )}
    </section>
  )

  return <></>
}
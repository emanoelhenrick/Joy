import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import FadeSlide from "embla-carousel-fade"
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaStar } from "react-icons/fa";
import { TitleLogo } from "moviedb-promise";
import { VlcDialog } from "@/pages/dashboard/components/VlcDialog";
import electronApi from "@/config/electronApi";
import { usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useUserData } from "@/states/useUserData";
import { VodProps } from "electron/core/models/VodModels";
import { ImSpinner8 } from "react-icons/im";

export function Trending({ refresh, slideActive }: { refresh: () => void, slideActive: boolean }) {
  const navigate = useNavigate()

  const [selectedMovie, setSelectedMovie] = useState<VodProps | undefined>(undefined)
  const [state, setState] = useState<any>(undefined)
  const baseUrl = usePlaylistUrl(state => state.urls.getVodStreamUrl)
  const [data, setData] = useState<any[]>([])
  const updateVodStatus = useUserData(state => state.updateVodStatus)

  function updateUserStatus(data: { length: number, time: number }) {
    if (!selectedMovie) return
    setState({
      id: selectedMovie.stream_id,
      data: data
    })
  }

  function RatingStars({ rating }: { rating: number, blur?: boolean }) {
    if (!rating || rating == 0) return <></>
    const ratingFloat = rating < 10 ? rating.toFixed(1) : 10
  
    return (
      <div className={`flex items-center gap-1.5`}>
        <FaStar className="size-3.5 2xl:size-3.5" />
        <h1 className="text-sm leading-none">{ratingFloat}</h1>
      </div>
    )
  }

  async function getTrending() {
    const trending = await electronApi.getLocalTmdbTrending()
    if (!trending || trending.length === 0) return await electronApi.fetchTmdbTrending()
    setData(trending)
  }

  function handleSearchForMatch(mediaType: string, search: string) {
    const type = mediaType === 'movie' ? 'vod' : 'series'
    navigate(`/dashboard/explore?type=${type}&search=${search}`)
  }

  const renderItem = useCallback((info: any) => {
    function getRightLogo(logos: TitleLogo[]) {
      if (!logos) return
      if (logos.length === 0) return
      const filteredByIso = logos.filter(l => l.iso_639_1 === 'pt-BR' || l.iso_639_1 === 'en')
      if (filteredByIso.length === 0) return `https://image.tmdb.org/t/p/w300${logos[0].file_path}`
      const filteredByAspectRatio = filteredByIso.filter(l => l.aspect_ratio! > 1.5 )
      if (filteredByAspectRatio.length === 0) return `https://image.tmdb.org/t/p/w300${filteredByIso[0].file_path}`
      return `https://image.tmdb.org/t/p/w500${filteredByAspectRatio[0].file_path}`
    }

    const releaseDate = format(info.release_date!, "u")
    const perfectMatch = info.matches![0]
    const logoPath = getRightLogo(info.images!.logos!)
    
    async function launchVlc() {
      setSelectedMovie(perfectMatch)
      const props = {
        path: `${baseUrl}${perfectMatch.stream_id}.${perfectMatch.container_extension}`,
        startTime: 0
      }
      await electronApi.launchVLC(props)
    }

    return (
      <CarouselItem key={info.poster_path}> 
        <div className="flex items-center h-full justify-center rounded-xl overflow-hidden">
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
                
                <div className="flex items-center gap-6 font-bold text-sm">
                  <h1 className="leading-none">TRENDING</h1>
                  <h1 className="leading-none">{releaseDate}</h1>
                  {info.matches![0].rating && <RatingStars rating={parseFloat(info.matches![0].rating)} />}
                </div>

                <h1 className="text-sm 2xl:text-lg text-primary/80 font-medium line-clamp-4 max-w-screen-sm">{info.overview}</h1>
                
                <div className="flex gap-2 mt-1">
                  <div
                    onClick={launchVlc}
                    className="p-7 py-2 rounded-xl transition-none flex gap-2 items-center bg-primary/10 text-primary hover:opacity-80 cursor-pointer">
                    <FaPlay className="size-3.5 opacity-90" />
                    <h1 className="font-medium">Watch</h1>
                  </div>
                  <div onClick={() => handleSearchForMatch('movie', info.title!)} className="px-6 py-2 rounded-lg transition-none flex gap-2 items-center text-primary hover:bg-primary/10 cursor-pointer">
                    <h1>See matches</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="z-10 w-full h-full absolute flex items-end justify-start">
            <div className="inset-0 w-full h-full scale-105 bg-gradient-to-l from-transparent to-background" />
          </div>
          <img className="absolute opacity-60 h-full w-full object-cover" src={`https://image.tmdb.org/t/p/original${info.backdrop_path}`} />

        </div>
      </CarouselItem>
    )
  }, [data])

  useEffect(() => {
    getTrending()

    window.ipcRenderer.on('trending', (_event, args) => {
      if (args.isSuccess) getTrending()
    });

    return () => {
      electronApi.removeAllListeners('trending')
    }
  }, [data])

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

  return (
    <section className="relative bg-primary-foreground rounded-2xl">
      <Carousel
        plugins={[
          Autoplay({ delay: 10000, active: (!selectedMovie && slideActive) }),
          FadeSlide()
        ]}
        className="bg-background rounded-xl overflow-hidden"
      >
        <CarouselContent>
          {data.length > 0 ? (
            data.map(info => renderItem(info))
          ) : (
            <CarouselItem key={'loading'}>
              <div className="min-h-96 bg-primary-foreground flex justify-center items-center">
                <ImSpinner8 className="size-8 animate-spin text-muted-foreground" />
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
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
}
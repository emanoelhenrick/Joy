import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import FadeSlide from "embla-carousel-fade"
import { useCallback, useEffect, useState } from "react";
import { TitleLogo } from "moviedb-promise";
import electronApi from "@/config/electronApi";
import { ImSpinner8 } from "react-icons/im";
import { Fade } from "react-awesome-reveal";

export function Trending({ setSelectedVod, selectedVod, slideActive }: { setSelectedVod: (data: any) => void, selectedVod: any, slideActive: boolean }) {
  const [api, setApi] = useState<CarouselApi>()
  const [data, setData] = useState<any[]>([])

  async function getTrending() {
    const trending = await electronApi.getLocalTmdbTrending()
    if (!trending || trending.length === 0) return await electronApi.fetchTmdbTrending()
    setData(trending)
  }

  const renderItem = useCallback((info: any) => {
    function getRightLogo(logos: TitleLogo[]) {
      if (!logos) return
      if (logos.length === 0) return
      const filteredByIso = logos.filter(l => l.iso_639_1 === 'pt' || l.iso_639_1 === 'en')
      if (filteredByIso.length === 0) return `https://image.tmdb.org/t/p/w300${logos[0].file_path}`
      const filteredByAspectRatio = filteredByIso.filter(l => l.aspect_ratio! > 1.5 )
      if (filteredByAspectRatio.length === 0) return `https://image.tmdb.org/t/p/w300${filteredByIso[0].file_path}`
      return `https://image.tmdb.org/t/p/w500${filteredByAspectRatio[0].file_path}`
    }

    const logoPath = getRightLogo(info.images!.logos!)

    const backdrop = info.images.backdrops.length > 0 ? info.images.backdrops[1] : info.images.backdrops[0]

    return (
      <CarouselItem key={info.poster_path}> 
        <div onClick={() => setSelectedVod(info.perfectMatch.movie_data)} className="group cursor-pointer min-h-[46rem] flex items-center h-full justify-center rounded-3xl relative">
          <div className="left-36 flex flex-col justify-between gap-2 z-20 absolute bottom-32">
            <div className="flex flex-col gap-2 z-10">
              <div className="max-w-96 2xl:max-w-screen-sm h-fit">
                { logoPath ? <img src={logoPath} className="object-contain w-fit max-h-28 2xl:max-h-36 mb-2 mt-2" /> : (
                  <h1 className="text-5xl 2xl:text-6xl font-bold">{info.title}</h1>
                )}
              </div>
              <h1 className="text-sm 2xl:text-lg text-primary/60 font-medium line-clamp-4 max-w-screen-sm">{info.overview}</h1>
            </div>
          </div>

          <div className="z-10 w-full h-full absolute flex items-end justify-start">
            <div className="absolute bottom-0 w-full h-full bg-gradient-to-b from-transparent to-background" />
            <div className="absolute left-0 w-96 h-full bg-gradient-to-l from-transparent to-background/40" />
          </div>
          <Fade className="absolute top-0 w-full h-full">
            <img className="h-full w-full object-cover opacity-90 transition" src={`https://image.tmdb.org/t/p/original${backdrop.file_path}`} />
          </Fade>
        </div>

        <h1 className="absolute top-10 left-40 z-10 text-lg font-medium opacity-60"># {info.title}</h1>
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

  return (
    <section className="absolute right-0 left-0 rounded-3xl ">
      <Carousel
        plugins={[
          Autoplay({ delay: 10000, active: (!selectedVod && slideActive) }),
          FadeSlide()
        ]}
        className="bg-background"
        setApi={setApi}
      >
        <CarouselContent className="overflow-visible">
          {data.length > 0 ? (
            data.map(info => renderItem(info))
          ) : (
            <CarouselItem key={'loading'}>
              <div className="min-h-[30rem] flex justify-center items-center">
                <ImSpinner8 className="size-8 animate-spin text-muted-foreground" />
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
      </Carousel>

      <div className="flex absolute right-8 bottom-36 gap-4">
        {data.length > 0 && data.map((info, index) => {
          return (
            <div style={{ aspectRatio: '2/3' }} onClick={() => api?.scrollTo(index)} className={`w-16 bg-primary-foreground hover:scale-105 transition cursor-pointer rounded-2xl overflow-hidden ${(api && api.selectedScrollSnap() === index) ? 'opacity-100 scale-110' : 'opacity-40'}`}>
              <img src={info.perfectMatch.info.movie_image} alt="" />
            </div>
          )
        })}
      </div>
    </section>
  )
}
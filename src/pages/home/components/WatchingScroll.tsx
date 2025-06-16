import { ScrollArea } from "@/components/ui/scroll-area"
import { SeriesProps } from "electron/core/models/SeriesModels"
import { VodProps } from "electron/core/models/VodModels"
import { useCallback, useEffect, useRef, useState } from "react"
import { HomeCover } from "./HomeCover"
import { ScrollBarStyled } from "@/components/ScrollBarStyled"
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { usePlaylistUrl } from "@/states/usePlaylistUrl"
import electronApi from "@/config/electronApi"
import { formatDurationFromSeconds } from "@/utils/formatDuration"

interface WatchingScrollProps {
  watchingVod: VodProps[]
  watchingSeries: SeriesProps[]
  setSelectedSeries: (series: SeriesProps) => void
  setSelectedVod: (vod: VodProps) => void
}

export function WatchingScroll({ watchingVod, watchingSeries, setSelectedSeries, setSelectedVod }: WatchingScrollProps) {
  const watchingList = [ ...watchingVod, ...watchingSeries ].sort((a, b) => b.updatedAt! - a.updatedAt!)
  const [snapshots, setSnapshots] = useState<any[]>()
  const { urls } = usePlaylistUrl()

  async function getAllSnapshots() {
    const snaps = []
    for (let item of watchingVod) {
      const image64 = await electronApi.getSnapshot(`${urls.getVodStreamUrl}${item.stream_id}.${item.container_extension}`)
      snaps.push({ id: item.stream_id, image: image64 })
    }
    setSnapshots(snaps)
  }

  useEffect(() => {
    getAllSnapshots()
  }, [setSelectedVod, snapshots])

  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const scrollAmount = 600;

  const handleScrollRight = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        left: scrollViewportRef.current.scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const handleScrollLeft = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        left: scrollViewportRef.current.scrollLeft - scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const renderSeriesItem = useCallback((series: SeriesProps) => {
    if (!watchingSeries) return
    
    return (
      <div onClick={() => setSelectedSeries(series)} className="aspect-video hover:scale-95 transition duration-200 group cursor-pointer relative w-96 h-full flex justify-center items-center rounded-3xl overflow-hidden">
        <div className="absolute w-full bottom-4 px-6 z-10">
          <div className="w-full">
            <h1 className="text-lg font-semibold text-white">{series.name}</h1>
            <h1 className="text-sm font-medium opacity-60">{series.watchingNow?.episode}</h1>
          </div>
        </div>
        <img className="h-full w-full object-cover transition duration-200" src={series.backdrop_path[0]} alt="" />
        <div className="z-0 inset-0 w-full absolute h-full bg-gradient-to-b from-transparent to-background/80" />
      </div>
      )
  }, [watchingSeries])
  
  const renderVodItem = useCallback((movie: VodProps) => {
    if (!watchingVod) return
    if (!snapshots) return

    const snapshot = snapshots.find(s => s.id === movie.stream_id)
    if (!snapshot) return

    const duration = formatDurationFromSeconds(movie && movie.progress)

    return (
      <div onClick={() => setSelectedVod(movie)} className="aspect-video hover:scale-95 transition duration-200 group cursor-pointer relative w-96 h-full flex justify-center items-center rounded-3xl overflow-hidden">
        <div className="absolute w-full bottom-4 px-6 z-10">
          <div className="w-full">
            <h1 className="text-lg font-semibold text-white">{movie.name}</h1>
            <h1 className="text-sm font-medium opacity-60">{duration}</h1>
          </div>
        </div>
        <img className="h-full w-full object-cover transition duration-200" src={snapshot.image} alt="" />
        <div className="z-0 inset-0 w-full absolute h-full bg-gradient-to-b from-transparent to-background/80" />
      </div>
      )
  }, [snapshots])

  return ((watchingVod.length > 0) || (watchingSeries.length > 0)) && (
    <div className="w-full my-8 rounded-2xl space-y-4">
      <div className='flex gap-4 justify-between items-center'>
        <h1 className="text-lg font-medium">Watching</h1>

        <div className="flex gap-2 pr-6 opacity-60">
          <HugeiconsIcon icon={ArrowRight01Icon} className="rotate-180 size-6 cursor-pointer hover:opacity-80 text-primary transition" onClick={handleScrollLeft} />
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-6 cursor-pointer hover:opacity-80 text-primary transition" onClick={handleScrollRight} />
        </div>
      </div>
      <ScrollArea ref={scrollViewportRef} className="w-full relative">
        <div  className="flex w-max space-x-4 rounded-md pr-8">
          {/* <div className="aspect-video relative w-96 h-full flex justify-center items-center rounded-3xl overflow-hidden">
            <div className="absolute w-full top-4 px-6 z-10">
              <div className="w-full">
                <h1 className="text-lg font-semibold text-white">Duna</h1>
                <h1 className="text-sm font-medium opacity-60">1h05m</h1>
              </div>
            </div>
            <img className="h-full w-full object-cover opacity-60" src="https://cdn-dkepej.nitrocdn.com/xHPizjaXJNONuYnLnfsGSUCsMnIlzOEq/assets/images/optimized/rev-ef469ea/blog.frame.io/wp-content/uploads/2024/04/dune2-javier-bardeim.jpg" alt="" />
            <div className="z-0 inset-0 w-full absolute h-full bg-gradient-to-b from-transparent to-background/60" />
          </div>

          <div className="aspect-video relative w-96 h-full flex justify-center items-center rounded-3xl overflow-hidden">
            <div className="absolute w-full top-4 px-6 z-10">
              <div className="w-full">
                <h1 className="text-lg font-semibold text-white">Blade Runner</h1>
                <h1 className="text-sm font-medium opacity-60">49m</h1>
              </div>
            </div>
            <img className="h-full w-full object-cover opacity-60" src="https://www.framerated.co.uk/frwpcontent/uploads/2017/10/bladerunner01.jpg" alt="" />
            <div className="z-0 inset-0 w-full absolute h-full bg-gradient-to-b from-transparent to-background/80" />
          </div>

          <div className="aspect-video relative w-96 h-full flex justify-center items-center rounded-3xl overflow-hidden">
            <div className="absolute w-full top-4 px-6 z-10">
              <div className="w-full">
                <h1 className="text-lg font-semibold text-white">Mr. Robot</h1>
                <h1 className="text-sm font-medium opacity-60">S01 E01</h1>
              </div>
            </div>
            <img className="h-full w-full object-cover opacity-60" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-n6E_HWm3UIkrAyjXCVHFCf62A-XQWfwhaQ&s" alt="" />
            <div className="z-0 inset-0 w-full absolute h-full bg-gradient-to-b from-transparent to-background/60" />
          </div> */}
          {watchingList && watchingList.map((m: any) => {
            if (m.stream_id) return renderVodItem(m as VodProps)
            return renderSeriesItem(m as SeriesProps)
          })}
        </div>
        {/* <div className="w-16 right-0 top-0 absolute h-full bg-gradient-to-r from-transparent to-background/95" /> */}
        <ScrollBarStyled orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
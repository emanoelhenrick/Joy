import { VodProps } from "electron/core/models/VodModels";
import { useCallback, useState } from "react";
import { Cover } from "@/components/Cover";
import { Dialog, DialogContent, DialogTitle } from "../../../components/MediaInfoDialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Fade } from "react-awesome-reveal";
import { useMeasure } from "@uidotdev/usehooks";
import { VodPage } from "./vod";
import { SeriesProps } from "electron/core/models/SeriesModels";
import { SeriesPage } from "./series";
import { FaStar } from "react-icons/fa";
import { parseNumber } from "@/utils/parseNumber";
import { ArrowRight01Icon, MoreHorizontalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from "@hugeicons/react";

export default function PlaylistScroll({ data }: any) {
  const [ref, { width }] = useMeasure();
  const columns = Math.floor(width! / 140)
  const playlist: any = data
  const [selectedMovie, setSelectedMovie] = useState<VodProps>()
  const [selectedSeries, setSelectedSeries] = useState<SeriesProps>()

  const renderItem = useCallback((item: any) => {
    const isVod =  item.stream_id ? true : false
    const selectFunction = isVod ? () => setSelectedMovie(item) : () => setSelectedSeries(item)
    const itemKey = isVod ? item.num : item.series_id + '-' + item.num
    const coverSrc = isVod ? item.stream_icon : item.cover
    const title = item.name
    const rating = item.rating == 10 ? 10 : item.rating == 0 ? 0 : parseNumber(item.rating).toFixed(1) 

    return (
      <div className="w-full h-fit cursor-pointer relative group drop-shadow-lg" key={itemKey}>
        <div onClick={selectFunction} className="relative group-hover:opacity-70 transition-transform group-hover:scale-95">
          <div className="rounded-3xl overflow-hidden">
            <Cover src={coverSrc} title={title} />
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between">
              <h1 className="text-xs font-semibold text-muted-foreground">{isVod ? 'MOVIE' : 'TV SHOW'}</h1>
              {parseNumber(rating) > 0 && (
                <div className="flex gap-1 items-center">
                  <FaStar className="opacity-50 size-2.5 2xl:size-3" />
                  <h1 className="text-muted-foreground text-xs font-medium leading-tight">{rating}</h1>
                </div>
              )}
            </div>
            <h1 className="text-sm font-semibold line-clamp-3">{title}</h1>
          </div>
        </div>
      </div>
    )
  }, [playlist])

  return (
    <div className="h-fit rounded-xl">
      <Dialog open={selectedMovie && true}>
        <DialogContent className="w-screen h-screen items-center justify-center" aria-describedby={undefined}>
          <div
            onClick={() => setSelectedMovie(undefined)}
            className="cursor-pointer absolute left-16 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-20">
            <HugeiconsIcon icon={ArrowRight01Icon} className="rotate-180 size-8" />
          </div>
          <DialogTitle className="hidden" />
          <div className="h-screen">
            <VodPage
              streamId={selectedMovie! && selectedMovie!.stream_id.toString()}
              cover={selectedMovie! ? selectedMovie!.stream_icon : ''}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedSeries && true}>
        <DialogContent className="w-screen h-screen items-center justify-center" aria-describedby={undefined}>
          <div
            onClick={() => setSelectedSeries(undefined)}
            className="cursor-pointer absolute left-16 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-20">
            <HugeiconsIcon icon={ArrowRight01Icon} className="rotate-180 size-8" />
          </div>
          <DialogTitle className="hidden" />
          <div className="h-screen">
            <SeriesPage
              seriesId={selectedSeries ? selectedSeries!.series_id.toString() : ''}
              cover={selectedSeries ? selectedSeries!.cover : ''}
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className={`w-full`}>
        <div
          ref={ref}
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          className={`grid w-full gap-6 h-fit`}
          >
          <Fade triggerOnce duration={250} direction="up">
            {playlist!.map((item: any) => renderItem(item))}
          </Fade>
        </div>
      </div>
    </div>
  );
}


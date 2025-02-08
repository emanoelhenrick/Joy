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

export default function PlaylistScroll({ data }: any) {
  const [ref, { width }] = useMeasure();
  const columns = Math.floor(width! / 154)
  const playlist: any = data
  const [selectedMovie, setSelectedMovie] = useState<VodProps>()
  const [selectedSeries, setSelectedSeries] = useState<SeriesProps>()

  const renderItem = useCallback((item: any) => {
    const isVod =  item.stream_id ? true : false
    const selectFunction = isVod ? () => setSelectedMovie(item) : () => setSelectedSeries(item)
    const itemKey = isVod ? item.num : item.series_id + '-' + item.num
    const coverSrc = isVod ? item.stream_icon : item.cover
    const title = item.name

    return (
      <div className="w-full h-fit cursor-pointer relative group" key={itemKey}>
        <div onClick={selectFunction} className="group-hover:opacity-70 transition-transform group-hover:scale-95">
          <Cover src={coverSrc} title={title} />
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
            className="cursor-pointer absolute right-16 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-20">
            <Cross2Icon className="size-8 p-1 rounded-md bg-background/50" />
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
            className="cursor-pointer absolute right-16 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-20">
            <Cross2Icon className="size-8 p-1 rounded-md bg-background/50" />
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

      <div className={`w-full flex`}>
        <div
          ref={ref}
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          className={`grid w-full gap-3 h-fit mr-4`}
          >
          <Fade triggerOnce duration={250}>
            {playlist!.map((item: any) => renderItem(item))}
          </Fade>
        </div>
      </div>
    </div>
  );
}


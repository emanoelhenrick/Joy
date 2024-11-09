import { useQuery } from '@tanstack/react-query'
import { useParams } from "react-router-dom";
import electronApi from '@/config/electronApi';
import { useMemo, useState } from 'react';
import { Cover } from "@/components/Cover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DialogContent, DialogTitle, Dialog } from '@/components/MediaInfoDialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { SeriesInfo } from '../series/SeriesInfo';
import { SeriesProps } from 'electron/core/models/SeriesModels';
import { VodProps } from 'electron/core/models/VodModels';
import { VodInfo } from '../vod/VodInfo';


export function HomeDashboard() {
  let { playlistName } = useParams();
  const { data: vodData, isFetched: vodIsFetched } = useQuery({ queryKey: ['vodPlaylist'], queryFn: () => electronApi.getLocalVodPlaylist(playlistName!), staleTime: Infinity })
  const { data: seriesData, isFetched: seriesIsFetched } = useQuery({ queryKey: ['seriesPlaylist'], queryFn: () => electronApi.getLocalSeriesPlaylist(playlistName!), staleTime: Infinity })
  const [selectedVod, setSelectedVod] = useState<VodProps | undefined>(undefined)
  const [selectedSeries, setSelectedSeries] = useState<SeriesProps | undefined>(undefined)

  const vodByDate = useMemo(() => {
    if (vodIsFetched) return vodData!.playlist.slice(0, 25)
  }, [vodIsFetched])

  const vodByRating = useMemo(() => {
    if (vodIsFetched) {
      const playlist = vodData!.playlist.slice().sort((a, b) => parseInt(b.rating.toString()) - parseInt(a.rating.toString()))
      return playlist.filter(v => parseInt(v.rating) < 10).slice(0, 25)
    }
  }, [vodIsFetched])

  const seriesByDate = useMemo(() => {
    if (seriesIsFetched) return seriesData!.playlist
      .slice()
      .sort((a, b) => parseInt(b.last_modified.toString()) - parseInt(a.last_modified.toString()))
      .slice(0, 25)
  }, [seriesIsFetched])

  const seriesByRating = useMemo(() => {
    if (seriesIsFetched) {
      const playlist = seriesData!.playlist.slice().sort((a, b) => parseInt(b.rating.toString()) - parseInt(a.rating.toString()))
      return playlist.filter(s => parseInt(s.rating) < 10).slice(0, 25)
    }
  }, [seriesIsFetched])

  if (vodIsFetched && seriesIsFetched) {

    return (
      <div className="h-fit w-full">
        {selectedSeries && (
          <Dialog open={selectedSeries && true}>
            <DialogContent className="w-fit items-center justify-center" aria-describedby={undefined}>
              <div onClick={() => setSelectedSeries(undefined)} className="cursor-pointer absolute right-14 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <Cross2Icon className="h-8 w-8" />
              </div>
              <DialogTitle className="invisible">{selectedSeries!.name}</DialogTitle>
              <div className="w-screen">
                <SeriesInfo seriesId={selectedSeries!.series_id.toString()} title={selectedSeries!.title} cover={selectedSeries!.cover} />
              </div>
            </DialogContent>
          </Dialog>
        )}
        {selectedVod && (
          <Dialog open={selectedVod && true}>
            <DialogContent className="w-fit items-center justify-center" aria-describedby={undefined}>
              <div onClick={() => setSelectedVod(undefined)} className="cursor-pointer absolute right-14 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <Cross2Icon className="h-8 w-8" />
              </div>
              <DialogTitle className="invisible">{selectedVod!.name}</DialogTitle>
              <div className="w-screen">
                <VodInfo streamId={selectedVod!.stream_id.toString()} title={selectedVod!.title} cover={selectedVod!.stream_icon} />
              </div>
            </DialogContent>
          </Dialog>
        )}
        <div className='ml-16 mb-6 mt-4'>
          <div className="ml-6 flex flex-col gap-6">
            <div>
              <p className={`h-fit border text-sm py-1 px-6 w-fit mb-3 rounded-full transition gap-2`}>
                Recently updated series
              </p>
              <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex w-max space-x-4 pb-6 whitespace-nowrap rounded-md">
                {seriesByDate!.map(series => {
                  return (
                  <div
                    className="flex flex-col hover:scale-95 transition gap-3 w-fit h-fit cursor-pointer relative group"
                    key={series.series_id}
                    onClick={() => setSelectedSeries(series)}
                  >
                    <div>
                      <Cover src={series.cover} title={series.name} />
                    </div>
                    <h3 className="truncate w-36 text-xs text-muted-foreground">{series.title || series.name}</h3>
                  </div>
                  )
                })}
                </div>
                <ScrollBar color="blue" orientation="horizontal" />
              </ScrollArea>
            </div>

            <div>
              <p className={`h-fit border text-sm py-1 px-6 w-fit mb-3 rounded-full transition gap-2`}>
                Top rated series
              </p>
              <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex w-max space-x-4 pb-6 whitespace-nowrap rounded-md">
                {seriesByRating!.map(series => {
                  return (
                  <div
                    className="flex flex-col hover:scale-95 transition gap-3 w-fit h-fit cursor-pointer relative group"
                    key={series.series_id}
                    onClick={() => setSelectedSeries(series)}
                  >
                    <div>
                      <Cover src={series.cover} title={series.name} />
                    </div>
                    <h3 className="truncate w-36 text-xs text-muted-foreground">{series.title || series.name}</h3>
                  </div>
                  )
                })}
                </div>
                <ScrollBar color="blue" orientation="horizontal" />
              </ScrollArea>
            </div>

            <div>
              <p className={`h-fit border text-sm py-1 px-6 w-fit mb-3 rounded-full transition gap-2`}>
                Recently added movies
              </p>
              <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex w-max space-x-4 pb-6 whitespace-nowrap rounded-md">
                {vodByDate!.map(movie => {
                  return (
                  <div
                    className="w-fit h-fit hover:scale-105 transition cursor-pointer relative group flex flex-col gap-2"
                    key={movie.num}
                    onClick={() => setSelectedVod(movie)}
                    >
                    <div>
                      <Cover src={movie.stream_icon} title={movie.name} />
                    </div>
                    <h3 className="truncate w-36 text-xs text-muted-foreground">{movie.title || movie.name}</h3>
                  </div>
                  )
                })}
                </div>
                <ScrollBar color="blue" orientation="horizontal" />
              </ScrollArea>
            </div>

            <div>
              <p className={`h-fit border text-sm py-1 px-6 w-fit mb-3 rounded-full transition gap-2`}>
                Top rated movies
              </p>
              <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex w-max space-x-4 pb-6 whitespace-nowrap rounded-md">
                {vodByRating!.map(movie => {
                  return (
                  <div
                    className="w-fit h-fit hover:scale-105 transition cursor-pointer relative group flex flex-col gap-2"
                    key={movie.num}
                    onClick={() => setSelectedVod(movie)}
                  >
                    <div>
                      <Cover src={movie.stream_icon} title={movie.name} />
                    </div>
                    <h3 className="truncate w-36 text-xs text-muted-foreground">{movie.title || movie.name}</h3>
                  </div>
                  )
                })}
                </div>
                <ScrollBar color="blue" orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <></>
}
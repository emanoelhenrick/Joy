import { useMemo, useState } from 'react';
import { Cover } from "@/components/Cover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DialogContent, DialogTitle, Dialog } from '@/components/MediaInfoDialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { SeriesProps } from 'electron/core/models/SeriesModels';
import { VodProps } from 'electron/core/models/VodModels';
import { Fade } from 'react-awesome-reveal';
import { useUserData } from '@/states/useUserData';
import { useSeriesPlaylist, useVodPlaylist } from '@/states/usePlaylistData';
import { SeriesInfo } from '../dashboard/components/series/SeriesInfo';
import { VodInfo } from '../dashboard/components/vod/VodInfo';

export function HomeDashboard() {
  const vodData = useVodPlaylist(state => state.data)
  const seriesData = useSeriesPlaylist(state => state.data)

  const [selectedVod, setSelectedVod] = useState<VodProps | undefined>(undefined)
  const [selectedSeries, setSelectedSeries] = useState<SeriesProps | undefined>(undefined)
  const userDataSeries = useUserData(state => state.userData.series)
  const userDataVod = useUserData(state => state.userData.vod)
  const [watchingTab, setWatchingTab] = useState(0)

  const vodByDate = useMemo(() => {
    if (vodData) {
      return vodData!.playlist.slice(0, 25)
    }
  }, [vodData])

  const seriesByDate = useMemo(() => {
    if (seriesData) {
      return seriesData!.playlist
        .slice()
        .sort((a, b) => parseInt(b.last_modified.toString()) - parseInt(a.last_modified.toString()))
        .slice(0, 25)
    }
  }, [seriesData])
  
  const watchingSeries = useMemo(() => {
    if (userDataSeries && seriesData) {
      const udlist = ['']
      for (const s of userDataSeries) {
        if(s.episodes) {
          if (s.episodes.find(e => e.watching)) udlist.push(s.id!)
        }
      }

      const series: SeriesProps[] | undefined = []
      if (seriesData!.playlist.length > 0) {
        seriesData!.playlist.forEach((s) => {
          if (udlist.includes(s.series_id.toString())) {
            series.push(s)
          }
        })
        return series
      }
      return []
    }
    return []
  }, [userDataSeries, seriesData])

  const watchingVod = useMemo(() => {
    if (userDataVod && vodData) {
      const udlist = ['']
      for (const v of userDataVod) {
        if (v.watching) udlist.push(v.id!.toString())
      }

      const vod: VodProps[] | undefined = []
      if (vodData!.playlist.length > 0) {
        vodData!.playlist.forEach((v) => {
          if (udlist.includes(v.stream_id.toString())) {
            vod.push(v)
          }
        })
        return vod
      }
      return []
    }
    return []
  }, [userDataVod, vodData])

  if (vodData && seriesData) {

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
          {((watchingVod.length > 0) || (watchingSeries.length > 0)) && (
            <div>
            <div className='flex gap-2'>
             <p className={`h-fit border text-muted-foreground bg-secondary text-sm py-1 px-6 w-fit mb-3 rounded-full transition gap-2`}>
               Continue watching
              </p>
              {watchingSeries!.length > 0 && (
                <p
                  onClick={() => setWatchingTab(0)}
                  className={`h-fit border ${watchingTab == 0 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'} cursor-pointer text-sm py-1 px-6 w-fit mb-3 rounded-full transition gap-2`}>
                  Series
                </p>
              )}
              {watchingVod!.length > 0 && (
                <p
                  onClick={() => setWatchingTab(1)}
                  className={`h-fit border ${watchingTab == 1 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'} cursor-pointer text-sm py-1 px-6 w-fit mb-3 rounded-full transition gap-2`}>
                  Movies
                </p>
              )}
            </div>
              <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex w-max space-x-4 pb-6 whitespace-nowrap rounded-md">
                  <Fade duration={200} cascade damping={0.09} direction='up'>
                    {(watchingTab == 0 && watchingSeries) && watchingSeries!.map(series => {
                      return (
                      <div
                        className="flex flex-col hover:scale-95 transition gap-3 w-fit h-fit cursor-pointer relative"
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
                    {(watchingTab == 1 && watchingVod) && watchingVod!.map(movie => {
                      return (
                        <div
                          className="flex flex-col hover:scale-95 transition gap-3 w-fit h-fit cursor-pointer relative"
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
                  </Fade>
                </div>
                <ScrollBar color="blue" orientation="horizontal" />
              </ScrollArea>
          </div>
          )}


            <div>
              <p className={`h-fit border text-muted-foreground bg-secondary text-sm py-1 px-6 w-fit mb-3 rounded-full transition gap-2`}>
                Recently updated series
              </p>
              <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex w-max space-x-4 pb-6 whitespace-nowrap rounded-md">
                  <Fade duration={200} cascade triggerOnce damping={0.09} direction='up'>
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
                  </Fade>
                </div>
                <ScrollBar color="blue" orientation="horizontal" />
              </ScrollArea>
            </div>

            <div>
              <p className={`h-fit border text-muted-foreground bg-secondary text-sm py-1 px-6 w-fit mb-3 rounded-full transition gap-2`}>
                Recently added movies
              </p>
              <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex w-max space-x-4 pb-6 whitespace-nowrap rounded-md">
                <Fade duration={200} cascade triggerOnce damping={0.09} direction='up'>
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
                </Fade>
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
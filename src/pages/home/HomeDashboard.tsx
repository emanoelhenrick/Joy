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
import { WatchingScroll } from './components/WatchingScroll';
import { FavoritesScroll } from './components/FavoritesScroll';

export function HomeDashboard() {
  const vodData = useVodPlaylist(state => state.data)
  const seriesData = useSeriesPlaylist(state => state.data)

  const [selectedVod, setSelectedVod] = useState<VodProps | undefined>(undefined)
  const [selectedSeries, setSelectedSeries] = useState<SeriesProps | undefined>(undefined)
  const userDataSeries = useUserData(state => state.userData.series)
  const userDataVod = useUserData(state => state.userData.vod)

  const updateFavorite = useUserData(state => state.updateFavorite)
  const [_update, setUpdate] = useState(false)
  
  async function updateRender(streamId: string, type: string) {
    updateFavorite(streamId, type)
    setUpdate(prev => !prev)
  }

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
  
  const userSeries = useMemo(() => {
    if (userDataSeries && seriesData) {
      const watchingList: string[] = []
      const favoritesList: string[] = []
      for (const s of userDataSeries) {
        if(s.episodes) {
          if (s.episodes.find(e => e.watching)) watchingList.push(s.id!)
        }
      }

      userDataSeries.forEach(s => {
        if (s.favorite) {
          favoritesList.push(s.id!)
        }
      })

      const watchingSeries: SeriesProps[] | undefined = []
      if (seriesData!.playlist.length > 0) {
        seriesData!.playlist.forEach((s) => {
          const series = userDataSeries.find(ser => {
            return (s.series_id.toString() == ser.id!.toString()) && watchingList.includes(ser.id!)
          })
          if (series) {
            watchingSeries.push({ ...s, updatedAt: series.updatedAt })
          }
        })
      }

      const favoritesSeries: SeriesProps[] | undefined = []
      if (seriesData!.playlist.length > 0) {
        seriesData!.playlist.forEach((s) => {
          if (favoritesList.includes(s.series_id.toString())) {
            favoritesSeries.push(s)
          }
        })
      }

      return { watchingSeries, favoritesSeries }
    }
    return { watchingSeries: [], favoritesSeries: [] }
  }, [userDataSeries, seriesData])

  const userVod = useMemo(() => {
    if (userDataVod && vodData) {
      const watchingList: string[] = []
      const favoritesList: string[] = []
      for (const v of userDataVod) {
        if (v.watching) watchingList.push(v.id!.toString())
      }

      userDataVod.forEach(s => {
        if (s.favorite) {
          favoritesList.push(s.id!)
        }
      })

      const watchingVod: VodProps[] | undefined = []
      if (vodData!.playlist.length > 0) {
        vodData!.playlist.forEach((v) => {
          const vod = userDataVod.find(vd => {
            return (v.stream_id.toString() == vd.id!.toString()) && watchingList.includes(vd.id!)
          })
          if (vod) {
            watchingVod.push({ ...v, updatedAt: vod.updatedAt })
          }
        })
      }

      const favoritesVod: VodProps[] | undefined = []
      if (vodData!.playlist.length > 0) {
        vodData!.playlist.forEach((s) => {
          if (favoritesList.includes(s.stream_id.toString())) {
            favoritesVod.push(s)
          }
        })
      }
      return { watchingVod, favoritesVod }
    }
    return { watchingVod: [], favoritesVod: [] }
  }, [userDataVod, vodData])

  const { watchingSeries, favoritesSeries } = userSeries
  const { watchingVod, favoritesVod } = userVod

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
        <div className='ml-20 mb-6 mt-5'>
          <div className="flex flex-col gap-2">
            <WatchingScroll watchingVod={watchingVod} watchingSeries={watchingSeries} setSelectedSeries={setSelectedSeries} setSelectedVod={setSelectedVod} />
            <FavoritesScroll favoritesSeries={favoritesSeries} favoritesVod={favoritesVod} setSelectedSeries={setSelectedSeries} setSelectedVod={setSelectedVod} updateFavorites={updateRender} />
            
            <div>
              <p className={`h-fit border text-muted-foreground bg-secondary text-sm py-0.5 px-4 w-fit mb-3 rounded-full transition gap-2`}>
                Recently updated series
              </p>
              <ScrollArea className="w-full rounded-md">
                <div className="flex w-max gap-2 pb-6 pr-4 rounded-md">
                  <Fade duration={200} triggerOnce>
                    {seriesByDate!.map(series => {
                      return (
                      <div
                        className="flex flex-col hover:scale-95 transition gap-3 w-fit h-fit cursor-pointer relative group"
                        key={series.series_id}
                        onClick={() => setSelectedSeries(series)}
                      >
                        <Cover src={series.cover} title={series.name} />
                      </div>
                      )
                    })}
                  </Fade>
                </div>
                <ScrollBar color="blue" orientation="horizontal" />
              </ScrollArea>
            </div>
            <div>
              <p className={`h-fit border text-muted-foreground bg-secondary text-sm py-0.5 px-4 w-fit mb-3 rounded-full transition gap-2`}>
                Recently added movies
              </p>
              <ScrollArea className="w-full rounded-md">
                <div className="flex w-max gap-2 pb-6 pr-4 rounded-md">
                <Fade duration={200} triggerOnce>
                {vodByDate!.map(movie => {
                  return (
                  <div
                    className="flex flex-col hover:scale-95 transition gap-3 w-fit h-fit cursor-pointer relative group"
                    key={movie.num}
                    onClick={() => setSelectedVod(movie)}
                    >
                    <Cover src={movie.stream_icon} title={movie.name} />
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogContent, DialogTitle, Dialog } from '@/components/MediaInfoDialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { SeriesProps } from 'electron/core/models/SeriesModels';
import { VodProps } from 'electron/core/models/VodModels';
import { useUserData } from '@/states/useUserData';
import { useSeriesPlaylist, useVodPlaylist } from '@/states/usePlaylistData';
import { SeriesPage } from '../dashboard/components/series';
import { WatchingScroll } from './components/WatchingScroll';
import { FavoritesScroll } from './components/FavoritesScroll';
import { Trending } from './components/Trending';
import { HomeCover } from './components/HomeCover';
import { VodPage } from '../dashboard/components/vod';
import { Fade } from 'react-awesome-reveal';
import { UpdatedMediaContainer } from './components/UpdatedMediaContainer';
import electronApi from '@/config/electronApi';
import { SearchInput } from '@/components/SearchInput';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CommandPalette from '@/components/ui/command-palette';
import { CommandSearch } from './components/CommandSearch';

export function HomeDashboard() {
  const vodData = useVodPlaylist(state => state.data)
  const seriesData = useSeriesPlaylist(state => state.data)

  const [selectedVod, setSelectedVod] = useState<VodProps | undefined>(undefined)
  const [selectedSeries, setSelectedSeries] = useState<SeriesProps | undefined>(undefined)
  const userDataSeries = useUserData(state => state.userData.series)
  const userDataVod = useUserData(state => state.userData.vod)
  const [update, setUpdate] = useState(false)
  const [openCommand, setOpenCommand] = useState(false)

  const vodByDate = useMemo(() => {
    if (vodData && vodData.playlist) {
      return vodData!.playlist
        .sort((a, b) => parseInt(b.added.toString()) - parseInt(a.added.toString()))
        .slice(0, 25)
    }
  }, [vodData])

  const seriesByDate = useMemo(() => {
    if (seriesData && seriesData.playlist) {
      return seriesData.playlist
        .sort((a, b) => parseInt(b.last_modified.toString()) - parseInt(a.last_modified.toString()))
        .slice(0, 25)
    }
  }, [seriesData])
  
  const userSeries = useMemo(() => {
    if (userDataSeries && seriesData) {
      const watchingList: string[] = []
      const favoritesList: string[] = []
      for (const s of userDataSeries) {
        if(s.watching) watchingList.push(s.id!)
        if (s.favorite) favoritesList.push(s.id!)
      }

      const watchingSeries: SeriesProps[] | undefined = []
      if (seriesData!.playlist.length > 0) {
        seriesData!.playlist.forEach((s) => {
          const series = userDataSeries.find(ser => {
            return (s.series_id.toString() == ser.id!.toString()) && watchingList.includes(ser.id!)
          })
          if (series) {
            const episode = series.episodes![series.episodes!.length - 1]
            const watchingNow = {
              episode: `S${episode.season} E${episode.episodeNum}`,
              progress: episode.currentTime / episode.duration
            }
            watchingSeries.push({ ...s, updatedAt: series.updatedAt, watchingNow })
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
  }, [userDataSeries, seriesData, update])

  const userVod = useMemo(() => {
    if (userDataVod && vodData) {
      const watchingList: string[] = []
      const favoritesList: string[] = []
      for (const v of userDataVod) {
        if (v.watching) watchingList.push(v.id!.toString())
        if (v.favorite) favoritesList.push(v.id!)
      }

      const watchingVod: VodProps[] | undefined = []
      if (vodData!.playlist.length > 0) {
        vodData!.playlist.forEach((v) => {
          const vod = userDataVod.find(vd => {
            return (v.stream_id.toString() == vd.id!.toString()) && watchingList.includes(vd.id!)
          })
          if (vod) {
            watchingVod.push({ ...v, updatedAt: vod.updatedAt, progress: (vod.currentTime! / vod.duration!) })
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
  }, [userDataVod, vodData, update])

  const { watchingSeries, favoritesSeries } = userSeries
  const { watchingVod, favoritesVod } = userVod

  const renderSeriesItem = useCallback((series: SeriesProps) => {
    if (!seriesData) return
    return (
      <div
        className="hover:scale-95 transition duration-75 gap-3 w-fit h-fit cursor-pointer relative hover:opacity-70 rounded-2xl overflow-hidden"
        key={series.series_id}
        onClick={() => setSelectedSeries(series)}
      >
        <HomeCover src={series.cover} title={series.name} />
      </div>
      )
  }, [seriesData])

  const renderVodItem = useCallback((movie: VodProps) => {
    if (!vodData) return
    return (
      <div
        className="hover:scale-95 hover:opacity-70 duration-75 transition gap-3 w-fit h-fit cursor-pointer relative rounded-2xl overflow-hidden"
        key={movie.num}
        onClick={() => setSelectedVod(movie)}
      >
        <HomeCover src={movie.stream_icon} title={movie.name} />
      </div>
      )
  }, [vodData])

  useEffect(() => {
    setTimeout(() => setUpdate(p => !p), 50)
  }, [selectedSeries, selectedVod])

  useEffect(() => {
    window.scrollTo({ top: 1 })
  }, [])

  if (vodData && seriesData) {

    return (
        <section className='w-full overflow-hidden'>
          <ScrollArea className='w-full'>
            <div className="h-fit z-0 py-8 pr-4">
              <Dialog open={selectedSeries && true}>
                <DialogContent className="w-screen items-center justify-center" aria-describedby={undefined}>
                  <div onClick={() => setSelectedSeries(undefined)} className="cursor-pointer absolute right-16 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-20">
                    <Cross2Icon className="size-8 p-1 rounded-md bg-background/50" />
                  </div>
                  <DialogTitle className="hidden" />
                  <div className="w-screen">
                    <SeriesPage seriesId={selectedSeries ? selectedSeries!.series_id.toString() : ''} cover={selectedSeries ? selectedSeries!.cover : ''} />
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={selectedVod && true}>
                <DialogContent className="w-screen h-screen items-center justify-center" aria-describedby={undefined}>
                  <div onClick={() => setSelectedVod(undefined)} className="cursor-pointer absolute right-16 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-20">
                    <Cross2Icon className="size-8 p-1 rounded-md bg-background/50" />
                  </div>
                  <DialogTitle className="hidden" />
                  <div className="w-screen">
                    <VodPage streamId={selectedVod ? selectedVod!.stream_id.toString() : ''} cover={selectedVod ? selectedVod!.stream_icon : ''} />
                  </div>
                </DialogContent>
              </Dialog>
              <div>
                <div className="flex flex-col gap-3">
                  <Fade duration={500} direction='up' triggerOnce>
                    <Trending
                      slideActive={(!selectedSeries && !selectedVod)}
                      refresh={() => setUpdate(p => !p)}
                    />

                    <WatchingScroll
                      watchingVod={watchingVod}
                      watchingSeries={watchingSeries}
                      setSelectedSeries={setSelectedSeries}
                      setSelectedVod={setSelectedVod}
                    />

                    <FavoritesScroll
                      favoritesSeries={favoritesSeries}
                      favoritesVod={favoritesVod}
                      setSelectedSeries={setSelectedSeries}
                      setSelectedVod={setSelectedVod}
                    />

                    <UpdatedMediaContainer title='Updated series'>
                      {seriesByDate!.map(series => renderSeriesItem(series))}
                    </UpdatedMediaContainer>

                    <UpdatedMediaContainer title='Added movies'>
                      {vodByDate!.map(movie => renderVodItem(movie))}
                    </UpdatedMediaContainer>
                  </Fade>
                </div>
              </div>
            </div>
          </ScrollArea>
        </section>
    )
  }

  return <></>
}
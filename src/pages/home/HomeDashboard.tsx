import { useQuery } from '@tanstack/react-query'
import { useParams } from "react-router-dom";
import electronApi from '@/config/electronApi';
import { useMemo } from 'react';
import { Cover } from "@/components/Cover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function HomeDashboard() {
  let { playlistName } = useParams();
  const { data: vodData, isFetched: vodIsFetched } = useQuery({ queryKey: ['vodPlaylist'], queryFn: () => electronApi.getLocalVodPlaylist(playlistName!), staleTime: Infinity })
  const { data: seriesData, isFetched: seriesIsFetched } = useQuery({ queryKey: ['seriesPlaylist'], queryFn: () => electronApi.getLocalSeriesPlaylist(playlistName!), staleTime: Infinity })

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
        <div className='ml-16 mb-6 mt-4'>
          <div className="ml-6 flex flex-col gap-6">
            <div>
              <p className={`h-fit border text-sm py-1 px-6 w-fit mb-3 rounded-full transition gap-2`}>
                Recently added series
              </p>
              <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex w-max space-x-4 pb-6 whitespace-nowrap rounded-md">
                {seriesByDate!.map(s => {
                  return (
                    <Cover src={s.cover} title={s.name} />
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
                {seriesByRating!.map(s => {
                  return (
                    <Cover src={s.cover} title={s.name} />
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
                {vodByDate!.map(v => {
                  return (
                    <Cover src={v.stream_icon} title={v.name} />
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
                {vodByRating!.map(v => {
                  return (
                    <Cover src={v.stream_icon} title={v.name} />
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
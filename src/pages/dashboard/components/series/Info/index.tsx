import electronApi from "@/config/electronApi"
import { usePlaylistUrl } from "@/states/usePlaylistUrl"
import { FaPlay, FaStar } from "react-icons/fa";
import { useEffect, useState } from "react"
import { QueryFilters, useQuery, useQueryClient } from "@tanstack/react-query"
import { useUserData } from "@/states/useUserData";
import { Button } from "@/components/ui/button";
import { EpisodesSection } from "./EpisodesSection";
import { ClearDataAlertDialog } from "./ClearDataAlertDialog";
import { InfoSection } from "./InfoSection";

export function SeriesPage({ seriesId, cover }: { seriesId: string, cover: string }) {
  const queryClient = useQueryClient();

  const { urls } = usePlaylistUrl()
  const { data } = useQuery({ queryKey: [`seriesInfo`], queryFn: async () => await electronApi.getSerieInfo(urls.getSeriesInfoUrl + seriesId) })

  const userSeriesData = useUserData(state => state.userData.series?.find(s => s.id == seriesId))
  const removeSeriesStatus = useUserData(state => state.removeSeriesStatus)

  const [_refresh, setRefresh] = useState(false)

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['seriesInfo'], exact: true } as QueryFilters)
    }
  }, [])

  if (!data) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
          <img key='loading' src={cover} className="max-w-80 rounded-2xl animate-pulse -z-20" />
      </div>
    )
  }

  const backdropPath = getRightBackdrop(data.info.backdrop_path)

  const description = data.info.plot
  const title = data.info.name
  const releaseDate = data.info.releaseDate
  const cast = data.info.cast
  const director = data.info.director

  const genres = data!.info.genre.replaceAll(/^\s+|\s+$/g, "").split(/[^\w\sÀ-ÿ-]/g) || ['']
  const genre = genres[0]

  return (
    <div className="w-full h-screen flex flex-col justify-end">
        <Backdrop backdropPath={backdropPath!} cover={cover} />

        <InfoSection
          title={title} releaseDate={releaseDate}
          genre={genre}
          description={description}
          cast={cast}
          director={director}
        />

        <div className="px-16 justify-between items-end flex gap-2 mt-4 w-full mb-8">
          <div className="flex gap-2">
            <Button size={"lg"} className="flex gap-2 items-center bg-primary">
              <FaPlay className="size-4" />
              <span className="leading-none text-base">Watch</span>
            </Button>
            <Button variant={'ghost'} size={"lg"} className="flex gap-2 items-center">
              <FaStar className="size-4" />
              <span className="leading-none text-base">Add to favorites</span>
            </Button>
          </div>

          {userSeriesData && <ClearDataAlertDialog setUpdate={setRefresh} removeSeriesData={() => removeSeriesStatus(seriesId)}  />}
        </div>

        <EpisodesSection
          seriesCover={cover}
          seriesId={seriesId}
          data={data}
          userSeriesData={userSeriesData!}
        />
      </div>
    )
}

function Backdrop({ backdropPath, cover }: { backdropPath: string, cover: string }) {
  return (
    <>
    { backdropPath ? (
        <img
          className="w-full h-full object-cover fixed top-0 -z-10"
          src={backdropPath}
        />
      ) : (
        <img
          className="w-full h-full object-cover fixed top-0 blur-lg -z-10"
          src={cover}
        />
      )}
      <div className="inset-0 w-full h-full -z-10 fixed bg-gradient-to-l from-transparent to-background/95" />
      <div className="inset-0 w-full h-full -z-10 fixed bg-gradient-to-b from-transparent to-background/50" />
    </>
  )
}

function getRightBackdrop(backdropList: string[]) {
  if (!backdropList) return
  if (backdropList.length === 0) return
  const url = backdropList[0]
  if (url.includes('tmdb')) {
    const list = url.split('/')
    const path = list[list.length - 1]
    return `https://image.tmdb.org/t/p/original/${path}`
  }
  return url
}
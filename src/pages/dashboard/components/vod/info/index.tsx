import electronApi from "@/config/electronApi"
import { usePlaylistUrl } from "@/states/usePlaylistUrl"
import { QueryFilters, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { Fade, Zoom } from "react-awesome-reveal"
import { FaPlay, FaSpinner, FaStar } from "react-icons/fa"
import { useUserData } from "@/states/useUserData"
import { Backdrop as BackdropType, MovieDb, } from "moviedb-promise"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { VlcDialog } from "../../VlcDialog"
import { ClearDataAlertDialog } from "./ClearDataAlertDialog"
import { InfoSection } from "./InfoSection"
import { formatDuration } from "date-fns"
import { ImSpinner8 } from "react-icons/im";

interface Props {
  streamId: string
  cover: string
}

export function VodPage({ streamId, cover }: Props) {
  const queryClient = useQueryClient()

  const moviedb = new MovieDb(import.meta.env.VITE_TMDB_API_KEY)

  const [isRunning, setIsRunning] = useState(false)
  const userVodData = useUserData(state => state.userData.vod?.find(v => v.id == streamId))
  const updateVodStatus = useUserData(state => state.updateVodStatus)
  const removeVodStatus = useUserData(state => state.removeVodStatus)
  const updateFavorite = useUserData(state => state.updateFavorite)
  const { data, isSuccess, isFetching } = useQuery({ queryKey: [`vodInfo`], queryFn: async () => await fetchMovieData() })
  const { urls } = usePlaylistUrl()
  const [_refresh, setRefresh] = useState(false)

  const [state, setState] = useState<any>(undefined)
  
  function updateUserStatus(dataState: { length: number, time: number }) {
    if (!isRunning) return
    setState(dataState)
  }

  function handleFavorite() {
    updateFavorite(streamId, 'vod')
    setTimeout(() => setRefresh(p => !p), 100)
  }

  useEffect(() => {
    if (!isRunning && state) {
      if (!state) return
      const { time, length } = state
      updateVodStatus(
        streamId,
        time,
        length,
        time / length < 0.95
      )
      setState(undefined)
    }
  }, [isRunning, updateVodStatus])

  async function fetchMovieData() {
    const vodInfo = await electronApi.getVodInfo(urls.getVodInfoUrl + streamId)
    if (!vodInfo) return
    if (!vodInfo.info) return
    if (vodInfo.info.tmdb_id) {
      const tmdbData = await moviedb.movieImages({ id: vodInfo.info.tmdb_id })
      return { ...vodInfo, tmdbImages: tmdbData }
    }
    return vodInfo
  } 

  async function launchVlc() {
    const props = {
      path: `${urls.getVodStreamUrl}${streamId}.${data?.movie_data.container_extension}`,
      startTime: (userVodData && userVodData.currentTime) ? userVodData.currentTime : 0
    }
    await electronApi.launchVLC(props)
    setIsRunning(true)
  }

  useEffect(() => { 
    return () => {
      queryClient.removeQueries({ queryKey: ['vodInfo'], exact: true } as QueryFilters)
    }
  }, [])

  const genres: string[] = useMemo(() => {
    if (data) {
      if (data.info.genre) {
        return data!.info.genre.replaceAll(/^\s+|\s+$/g, "").split(/[^\w\sÀ-ÿ-]/g)
      }
    }
    return []
  }, [isSuccess])

  function getString(str: string) {
    if (!str) return undefined
    const newStr = str.trim()
    if (newStr.length > 1) return newStr
  }

  const cast = data ? data.info.cast : undefined
  const director = data ? data.info.director : undefined
  const releaseDate = data ? data.info.releasedate && format(data?.info.releasedate, 'u') :  undefined
  const description = data ? (data.info.description || data.info.plot).trim() : undefined
  const title = data ? getString(data!.info.title)  || getString(data!.movie_data.name) : undefined

  function duration(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    const duration: any = {};
  
    if (hours === 0 && minutes === 0) {
      duration.seconds = remainingSeconds;
    } else {
      duration.hours = hours;
      duration.minutes = minutes;
    }
  
    return formatDuration(duration, { delimiter: ' and '});
  }

  return (
    <div className="w-full h-screen flex flex-col justify-end">
      
      {isFetching ? (
        <Fade>
          <div className="w-full h-full fixed flex items-center justify-center top-0 z-20">
            <ImSpinner8 className="size-8 animate-spin text-muted-foreground" />
          </div>
        </Fade>
      ) : (
        <Backdrop
          backdrops={data && data.tmdbImages ? data.tmdbImages.backdrops! : []}
          cover={cover}
        />
      )}

      <Fade className="z-10">
        {isSuccess && (
          <div className="p-16 pb-20 z-10 space-y-4">
            <InfoSection
              cast={cast!}
              description={description!}
              director={director!}
              genre={genres[0]}
              logos={data && data.tmdbImages ? data.tmdbImages.logos! : []}
              releaseDate={releaseDate!}
              title={title!}
              isFetching={isFetching}
            />
            
            <div className="mt-2 flex flex-col gap-4 z-10">
              <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Button key='vlc' disabled={isFetching} onClick={launchVlc} size={"lg"} className="bg-primary transition-none">
                    {userVodData && userVodData.currentTime ?
                      <span className="leading-none text-base">{`Resume from ${duration(userVodData.currentTime)}`}</span>
                      : (
                        <div className="flex gap-2">
                          <FaPlay />
                          <span className="leading-none text-base">Watch</span>
                        </div>
                      )}
                  </Button>
                  <Button variant={'ghost'} onClick={handleFavorite} disabled={isFetching} size={"lg"} className="flex gap-2 items-center hover:bg-primary/10 transition-none">
                    <FaStar className={`size-4 ${userVodData?.favorite && 'text-yellow-400'}`} />
                    <span className="leading-none text-base">
                      {userVodData?.favorite ? 'Remove from favorites' : 'Add to favorites'}
                    </span>
                  </Button>
                </div>

                {userVodData && <ClearDataAlertDialog removeVodData={() => removeVodStatus(streamId)} refresh={() => setRefresh(p => !p)}  />}
              </div>
            </div>
        </div>
        )}
      </Fade>

      {isRunning && (
        <VlcDialog
          updateUserStatus={updateUserStatus}
          open={isRunning}
          closeDialog={() => setIsRunning(false)}
        />
      )}
    </div>
  )
}

function Backdrop({ backdrops, cover }: { backdrops: BackdropType[], cover: string }) {
  const imageSrc = backdrops.length === 0 ? cover
      : `https://image.tmdb.org/t/p/original${backdrops[0].file_path}`

  if (!imageSrc.includes('tmdb')) {
    return (
      <div>
        <Fade>
          <img
            className="w-full h-full object-cover fixed top-0 -z-10"
            src={imageSrc}
          />
        </Fade>
        <div className="inset-0 w-full h-full z-10 fixed bg-gradient-to-l from-transparent to-background/95" />
        <div className="inset-0 w-full h-full z-10 fixed bg-gradient-to-b from-transparent to-background/60" />
      </div>
    )
  }

  function getLowImageTmdb() {
    const stringList = imageSrc.split('/')
    return `https://image.tmdb.org/t/p/w780/${stringList[stringList.length - 1]}`
  }

  function getOriginalImageTmdb() {
    const stringList = imageSrc.split('/')
    return `https://image.tmdb.org/t/p/original/${stringList[stringList.length - 1]}`
  }

  const [imageLoaded, setImageLoaded] = useState(false)

  const lowImage = getLowImageTmdb()
  const highImage = getOriginalImageTmdb()

  return (
    <>
      <Fade>
        <img
          className={`w-full h-full object-cover fixed top-0 -z-20`}
          src={lowImage}
        />
      <LazyLoadImage
        onLoad={() => setImageLoaded(true)}
        src={highImage}
        className={`w-full h-full object-cover fixed top-0 transition -z-10 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </Fade>
      <div className="inset-0 w-full h-full z-10 fixed bg-gradient-to-l from-transparent to-background/80" />
      <div className="inset-0 w-full h-full z-10 fixed bg-gradient-to-b from-transparent to-background/50" />
    </>
  )

}
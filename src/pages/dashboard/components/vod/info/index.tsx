import electronApi from "@/config/electronApi"
import { usePlaylistUrl } from "@/states/usePlaylistUrl"
import { QueryFilters, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { Fade } from "react-awesome-reveal"
import { FaPlay, FaStar } from "react-icons/fa"
import { useUserData } from "@/states/useUserData"
import { Backdrop as BackdropType, MovieDb, } from "moviedb-promise"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { VlcDialog } from "../../VlcDialog"
import { ClearDataAlertDialog } from "./ClearDataAlertDialog"
import { InfoSection } from "./InfoSection"
import { formatDuration } from "date-fns"

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
  const { data, isSuccess, isFetching } = useQuery({ queryKey: [`vodInfo`], queryFn: async () => await fetchMovieData() })
  const { urls } = usePlaylistUrl()
  const [_refresh, setRefresh] = useState(false)

  const [state, setState] = useState<any>(undefined)
  
  function updateUserStatus(dataState: { length: number, time: number }) {
    if (!isRunning) return
    setState(dataState)
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

  if (isFetching) {
    return (
      <div className="w-full h-screen flex items-center justify-center z-50">
        <img key='loading' src={cover} className="max-w-80 w-full rounded-2xl animate-pulse" />
        <img key='backdropLoading' src={cover} className="w-full bg-background h-full object-cover blur-3xl opacity-10 fixed" />
      </div>
    )
  }

  if (!data) return

  function getString(str: string) {
    if (!str) return undefined
    const newStr = str.trim()
    if (newStr.length > 1) return newStr
  }

  const cast = data.info.cast
  const director = data?.info.director
  const releaseDate = data.info.releasedate && format(data.info.releasedate, 'u')
  const description = data.info.description || data.info.plot
  const title = getString(data.info.title)  || getString(data.movie_data.name)

  console.log(data);
  

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
      <Backdrop
        backdrops={data.tmdbImages ? data.tmdbImages.backdrops! : []}
        cover={cover}
      />

      <div className="p-16 z-10 space-y-4">
        <InfoSection
          cast={cast}
          description={description}
          director={director}
          genre={genres[0]}
          logos={data.tmdbImages ? data.tmdbImages.logos! : []}
          releaseDate={releaseDate}
          title={title!}
        />
        
        <div className="mt-2 flex flex-col gap-4 z-10">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Button key='vlc' onClick={launchVlc} size={"lg"} className="bg-primary duration-100">
                {userVodData && userVodData.currentTime ?
                  <span className="leading-none text-base">{`Resume from ${duration(userVodData.currentTime)}`}</span>
                  : (
                    <div className="flex gap-2">
                      <FaPlay />
                      <span className="leading-none text-base">Watch</span>
                    </div>
                  )}
              </Button>
              <Button variant={'ghost'} size={"lg"} className="flex gap-2 duration-100 items-center hover:bg-primary/10">
                <FaStar className="size-4" />
                <span className="leading-none text-base">Add to favorites</span>
              </Button>
            </div>

            {userVodData && <ClearDataAlertDialog removeVodData={() => removeVodStatus(streamId)} refresh={() => setRefresh(p => !p)}  />}
          </div>
        </div>
      </div>

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
      <div className="">
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
    return `https://image.tmdb.org/t/p/w1280/${stringList[stringList.length - 1]}`
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
          className={`w-full h-full object-cover fixed top-0 -z-10 ${imageLoaded ? 'block' : 'hidden'}`}
        />
      </Fade>
      <div className="inset-0 w-full h-full z-10 fixed bg-gradient-to-l from-transparent to-background/95" />
      <div className="inset-0 w-full h-full z-10 fixed bg-gradient-to-b from-transparent to-background/60" />
    </>
  )

}
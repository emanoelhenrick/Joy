import electronApi from "@/config/electronApi"
import { usePlaylistUrl } from "@/states/usePlaylistUrl"
import { useState, useEffect, useMemo } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { EpisodesSection } from "./EpisodesSection";
import { ClearDataAlertDialog } from "./ClearDataAlertDialog";
import { InfoSection } from "./InfoSection";
import { VlcDialog } from "../VlcDialog";
import { Fade } from "react-awesome-reveal";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ImSpinner8 } from "react-icons/im";
import { useUserData } from "@/states/useUserData";
import { MovieDb } from "moviedb-promise";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react";
import { Bookmark02Icon, PlayIcon } from "@hugeicons/core-free-icons";
import { EpisodeProps } from "electron/core/models/SeriesModels";

const moviedb = new MovieDb(import.meta.env.VITE_TMDB_API_KEY)

export function SeriesPage({ seriesId, cover }: { seriesId: string, cover: string }) {
  const queryClient = useQueryClient();

  const { urls } = usePlaylistUrl()
  const { data, isFetching } = useQuery({ queryKey: [`seriesInfo-${seriesId}`], queryFn: fetchSeriesData })
  const updateFavorite = useUserData(state => state.updateFavorite)
  const updateSeriesStatus = useUserData(state => state.updateSeriesStatus)
  const updateDefaultSeason = useUserData(state => state.updateSeason)
  const userSeriesData = useUserData(state => state.userData.series?.find(s => s.id == seriesId))
  const [_refresh, setRefresh] = useState(false)
  const [isPlayingFromButton, setIsPlayingFromButton] = useState(false)
  const [episodeRunning, setEpisodeRunning] = useState<EpisodeProps & { season: string } | undefined>()
  const [vlcState, setVlcState] = useState<any>(undefined)

  async function fetchSeriesData() {
    const seriesInfo = await electronApi.getSerieInfo(urls.getSeriesInfoUrl + seriesId)
    
    if (!seriesInfo) return
    if (!seriesInfo.info) return

    
    const title = seriesInfo.info.name.replace(/\[\d+\]|\(\d+\)/g, '').replaceAll(' -', '').replaceAll('-', '').split('[')
    const releaseDateRaw =
      seriesInfo.info?.releaseDate ??
      seriesInfo.info?.year ??
      seriesInfo.seasons?.[0]?.air_date ??
      null;

    const releaseDate = releaseDateRaw && parseInt(format(releaseDateRaw, 'u'))
    
    if (!releaseDate || releaseDate === '0' as unknown as number) return seriesInfo
    
    let res = await moviedb.searchTv({ query: title[0].trim(), first_air_date_year: releaseDate })

    if (res.results!.length === 0) res = await moviedb.searchTv({ query: title[0].trim(), first_air_date_year: releaseDate, language: 'pt' })
    if (res.results!.length === 0) return seriesInfo
    if (res.results && res.results.length === 0) return seriesInfo
    
    const isSeries = res.results!.find(s => s.first_air_date ===  (seriesInfo.info.releaseDate ? seriesInfo.info.releaseDate : seriesInfo.seasons[0].air_date))

    if (!isSeries) return seriesInfo

    const seriesTMDBinfo = await moviedb.tvInfo(isSeries.id!)
    
    const tmdbId = isSeries.id!.toString()
    const seasonStated = (userSeriesData && userSeriesData.season) ? userSeriesData.season : '1'
    
    await queryClient.prefetchQuery({
      queryKey: [`${seriesId}-${seasonStated}-${tmdbId}`],
      queryFn: async () => {
        return await moviedb.seasonInfo({ id: tmdbId!, season_number: parseInt(seasonStated), language: 'pt' })
      },
      staleTime: Infinity
    });

    const images = await moviedb.tvImages({ id: tmdbId! })

    let imageSrc = ''
    let filteredByIso = (images.backdrops && images.backdrops.length > 0) && images.backdrops.filter(b => !b.iso_639_1)
    if (filteredByIso && filteredByIso.length > 0) {
      const filteredByWidth = filteredByIso.filter(b => b.width && b.width > 1920)
      if (filteredByWidth.length > 0) {
        imageSrc = `https://image.tmdb.org/t/p/original${filteredByWidth[0].file_path}`
      } else {
        imageSrc = `https://image.tmdb.org/t/p/original${filteredByIso[0].file_path!}`
      } 
    } else {
      imageSrc = cover
    }

    seriesInfo.info.backdrop_path = [imageSrc] 
    return { ...seriesInfo, tmdbImages: images, tmdbId, networkLogo: seriesTMDBinfo.networks![0].logo_path  }
  } 

  function refresh() {
    setRefresh(prev => !prev)
  }

  function handleFavorite() {
    updateFavorite(seriesId, 'series')
    setTimeout(() => setRefresh(p => !p), 100)
  }

  function updateUserStatus(dataState: { length: number, time: number }) {
    if (!episodeRunning) return
    setVlcState({
      id: episodeRunning.id,
      season: episodeRunning.season,
      episodeNum: episodeRunning.episode_num,
      data: dataState
    })
  }

  useEffect(() => {
    if (!episodeRunning && vlcState) {
      const { time, length } = vlcState.data
      updateSeriesStatus(
        seriesId,
        vlcState.episodeNum,
        vlcState.season,
        vlcState.id,
        time,
        length,
        (time / length) > 0
      )
      updateDefaultSeason(seriesId, vlcState.season)
      
      setVlcState(undefined)
    }
  }, [episodeRunning, vlcState, updateSeriesStatus, updateDefaultSeason, seriesId, queryClient])
  

  function findTargetEpisodeInfo() {
    if (!data || !data.episodes) return null

    // Get all episodes flattened with season info
    const allEpisodes: (EpisodeProps & { season: string })[] = []
    for (const season in data.episodes) {
      for (const episode of data.episodes[season]) {
        allEpisodes.push({ ...episode, season })
      }
    }

    if (allEpisodes.length === 0) return null

    const userEpisodes = userSeriesData?.episodes || []

    // Find the last watched episode using season + episodeNum for chronological ordering
    let lastWatchedEpisode = null
    if (userEpisodes.length > 0) {
      lastWatchedEpisode = userEpisodes.reduce((latest, current) => {
        const latestSeasonNum = parseInt(latest.season)
        const currentSeasonNum = parseInt(current.season)
        
        // Safety check: prevent division by zero
        if (latest.duration <= 0 || current.duration <= 0) {
          return latest.duration > 0 ? latest : current
        }

        // Compare by season first, then by episode number
        if (currentSeasonNum !== latestSeasonNum) {
          return currentSeasonNum > latestSeasonNum ? current : latest
        }
        return current.episodeNum > latest.episodeNum ? current : latest
      })
    }

    let targetEpisode: EpisodeProps & { season: string } | null = null

    if (lastWatchedEpisode) {
      // Check if last watched episode is completed (>95% watched)
      const progressPercent = lastWatchedEpisode.duration > 0 
        ? (lastWatchedEpisode.currentTime / lastWatchedEpisode.duration) * 100
        : 0
      
      if (progressPercent >= 95) {
        // Episode is finished, find the next episode
        const lastWatchedInAllEpisodes = allEpisodes.find(e => e.id === lastWatchedEpisode.episodeId)
        
        if (!lastWatchedInAllEpisodes) {
          targetEpisode = allEpisodes[0]
        } else {
          const lastWatchedIndex = allEpisodes.indexOf(lastWatchedInAllEpisodes)
          if (lastWatchedIndex !== -1 && lastWatchedIndex + 1 < allEpisodes.length) {
            targetEpisode = allEpisodes[lastWatchedIndex + 1]
          } else {
            targetEpisode = allEpisodes[0]
          }
        }
      } else {
        // Episode not finished, resume from it
        const resumeEpisode = allEpisodes.find(e => e.id === lastWatchedEpisode.episodeId)
        if (!resumeEpisode) {
          targetEpisode = allEpisodes[0]
        } else {
          targetEpisode = resumeEpisode
        }
      }
    } else if (allEpisodes.length > 0) {
      // No watch history, start from first episode
      targetEpisode = allEpisodes[0]
    }

    if (!targetEpisode) return null

    return {
      episode: targetEpisode,
      season: targetEpisode.season,
      episodeNum: targetEpisode.episode_num,
      hasHistory: userEpisodes.length > 0
    }
  }
  

  async function handlePlayButtonClick() {
    if (!data || !data.episodes) return
    setIsPlayingFromButton(true)

    try {
      // Reuse the target episode finding logic
      const episodeInfo = findTargetEpisodeInfo()
      
      
      
      if (!episodeInfo) {
        setIsPlayingFromButton(false)
        return
      }

      const targetEpisode = episodeInfo.episode

      // Validate required properties
      if (!targetEpisode.id || !targetEpisode.container_extension) {
        console.error('Target episode missing required properties: id or container_extension')
        setIsPlayingFromButton(false)
        return
      }

      // Get user episodes to find resumable time
      const userEpisodes = userSeriesData?.episodes || []
      const resTime = userEpisodes.find(e => e.episodeId === targetEpisode.id)?.currentTime || 0

      // Launch VLC with the target episode
      const props = {
        path: `${urls.getSeriesStreamUrl}${targetEpisode.id}.${targetEpisode.container_extension}`,
        startTime: resTime,
        seriesId: seriesId
      }

      

      await electronApi.launchVLC(props)
      
      // Set episode as running for VlcDialog management
      setEpisodeRunning(targetEpisode)
      setIsPlayingFromButton(false)
    } catch (error) {
      console.error('Error launching episode:', error)
      setIsPlayingFromButton(false)
    }
  }
  
  const backdropPath = getRightBackdrop(data ? data.info.backdrop_path : [])

  const description = data ? data.info.plot : undefined
  const title = data ? data.info.name.replace(/\[\d+\]|\(\d+\)/g, '') : undefined
  const releaseDate = data ? (data.info.releaseDate && parseInt(format(data.info.releaseDate, 'u'))) || data.info.year : undefined
  const director = data ? (data.info.director && data.info.director.trim()) : undefined

  const genres = (data && data.info.genre) ? data.info.genre.replaceAll(/^\s+|\s+$/g, "").split(/[^\w\sÀ-ÿ-]/g) : ['']
  const rating = data ? data.info.rating || (data.info.rating_5based && data.info.rating_5based * 2) : undefined

  const tmdbId = data ? data.tmdbId : undefined
  
  // Compute target episode info for button display
  const targetEpisodeInfo = useMemo(() => {
    return findTargetEpisodeInfo()
  }, [data, userSeriesData, episodeRunning])
  
  // Cleanup on unmount to prevent state updates on unmounted component
  useEffect(() => {
    return () => {
      setIsPlayingFromButton(false)
    }
  }, [])
  
  return (
    <div className="w-screen h-screen flex flex-col justify-end">
        
          {isFetching ? (
            <Fade>
              <div className="w-screen h-screen fixed flex items-center justify-center top-0 z-20">
                <ImSpinner8 className="size-8 animate-spin text-muted-foreground" />
              </div>
            </Fade>
          ) : (
              <div className="-z-10">
                <Backdrop
                  backdropPath={backdropPath!}
                  cover={cover}
                />
              </div>
          )}

        <div className={`transition pb-10 space-y-6 duration-500 flex flex-col ${isFetching ? 'opacity-0' : 'opacity-100'}`}>

          <div className="flex justify-between items-end">
            <InfoSection
              title={title!}
              releaseDate={releaseDate!}
              genre={genres[0]!}
              description={description!}
              director={director!}
              rating={rating!}
              logos={data && data.tmdbImages ? data.tmdbImages.logos! : []}
            />

            
          </div>

          <section className="flex justify-between items-center pr-16 pb-1">
            <section className="flex gap-4 items-center">
              <button 
                onClick={handlePlayButtonClick} 
                disabled={isFetching || isPlayingFromButton}
                className="w-fit ml-16 transition bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-2xl text-background relative overflow-hidden hover:scale-95">
                <div className="flex items-center gap-2 pr-2">
                  <HugeiconsIcon icon={PlayIcon} className="fill-black size-7" />
                  {targetEpisodeInfo && targetEpisodeInfo.hasHistory ? (
                    <h1 className="leading-none text-base">{`Resume from S${targetEpisodeInfo.season} EP${targetEpisodeInfo.episodeNum}`}</h1>
                  ) : (
                    <h1 className="leading-none text-base font-medium">Watch</h1>
                  )}
                </div>
              </button>

              <button title="Favorite" onClick={handleFavorite} disabled={isFetching} className="duration-300 hover:opacity-80 transition ">
                <HugeiconsIcon
                  icon={Bookmark02Icon}
                  strokeWidth={1.5}
                  className={`size-6 fill-primary ${!userSeriesData?.favorite && 'opacity-25'} transition duration-300 ease-in-out`}
                />
              </button>

              <div title="Remove all data" className="-ml-1">
                <ClearDataAlertDialog refresh={refresh} seriesId={seriesId}  />
              </div>
            </section>
            {(data && data.networkLogo) && <img className="h-8 max-w-36 object-contain grayscale-100 brightness-0 invert" src={`https://image.tmdb.org/t/p/w154/${data.networkLogo!}`} alt="" />}
            
          </section>

          {data && (
            <EpisodesSection
              seriesCover={cover}
              seriesId={seriesId}
              tmdbId={tmdbId}
              data={data}
            />
          )}
        </div>

        {episodeRunning && (
          <VlcDialog
            updateUserStatus={updateUserStatus}
            open={episodeRunning ? true : false}
            closeDialog={() => setEpisodeRunning(undefined)}
          />
        )}
      </div>
    )
}

function Backdrop({ backdropPath, cover }: { backdropPath: string, cover: string }) {
  const imageSrc = backdropPath || cover

  if (!imageSrc.includes('tmdb')) {
    return (
      <div className="fixed">
        <Fade triggerOnce>
          <img
            className={`w-full h-full duration-700 object-cover fixed transition ease-out top-0`}
            src={imageSrc}
          />
        </Fade>
        <div className="inset-0 w-full h-full scale-105 z-0 fixed bg-gradient-to-l from-transparent to-background/95" />
        <div className="inset-0 w-full h-full scale-105 fixed bg-gradient-to-b from-transparent to-background" />
        <div className="inset-0 w-full h-full scale-105 fixed bg-gradient-to-b from-transparent to-background" />
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
    <div className="fixed top-0 w-screen h-screen">
      <Fade triggerOnce duration={500}>
        <img
          className={`w-full h-full object-cover fixed top-0`}
          src={lowImage}
        />
        <LazyLoadImage
          onLoad={() => setImageLoaded(true)}
          src={highImage}
          className={`w-full h-full duration-1000 object-cover fixed transition ease-out top-0 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </Fade>
      <div className="inset-0 w-1/2 h-full fixed scale-105 bg-gradient-to-l from-transparent to-background" />
      <div className="inset-0 w-1/2 h-full fixed scale-105 bg-gradient-to-l from-transparent to-background" />

      <div className="inset-0 w-full h-full fixed scale-105 bg-gradient-to-b from-transparent to-background" />
      <div className="inset-0 w-full h-full fixed bg-gradient-to-b from-transparent to-background" />
      <div className="inset-0 w-full h-full fixed bg-gradient-to-b from-transparent to-background" />
    </div>
  )
}

function getRightBackdrop(backdropList: string[]) {
  if (!backdropList) return
  if (backdropList.length === 0) return
  const url = backdropList[0]
  if (url?.includes('tmdb')) {
    const list = url.split('/')
    const path = list[list.length - 1]
    return `https://image.tmdb.org/t/p/original/${path}`
  }
  return url
}
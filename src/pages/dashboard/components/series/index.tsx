import electronApi from "@/config/electronApi"
import { usePlaylistUrl } from "@/states/usePlaylistUrl"
import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { EpisodesSection } from "./EpisodesSection";
import { ClearDataAlertDialog } from "./ClearDataAlertDialog";
import { InfoSection } from "./InfoSection";
import { Fade } from "react-awesome-reveal";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ImSpinner8 } from "react-icons/im";
import { useUserData } from "@/states/useUserData";
import { MovieDb } from "moviedb-promise";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react";
import { Bookmark02Icon, PlayIcon } from "@hugeicons/core-free-icons";

const moviedb = new MovieDb(import.meta.env.VITE_TMDB_API_KEY)

export function SeriesPage({ seriesId, cover }: { seriesId: string, cover: string }) {
  const queryClient = useQueryClient();

  const { urls } = usePlaylistUrl()
  const { data, isFetching } = useQuery({ queryKey: [`seriesInfo-${seriesId}`], queryFn: fetchSeriesData, })
  const updateFavorite = useUserData(state => state.updateFavorite)
  const userSeriesData = useUserData(state => state.userData.series?.find(s => s.id == seriesId))
  const [_refresh, setRefresh] = useState(false)

  async function fetchSeriesData() {
    const seriesInfo = await electronApi.getSerieInfo(urls.getSeriesInfoUrl + seriesId)
    if (!seriesInfo) return
    if (!seriesInfo.info) return

    const title = seriesInfo.info.name.replace(/\[\d+\]|\(\d+\)/g, '').replaceAll(' -', '').replaceAll('-', '').split('[')
    const releaseDate = seriesInfo && seriesInfo.info.releaseDate ? parseInt(format(seriesInfo.info.releaseDate, 'u')) : seriesInfo.info.year ? seriesInfo.info.year : parseInt(format(seriesInfo.seasons[0].air_date, 'u')) 
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
  
  const backdropPath = getRightBackdrop(data ? data.info.backdrop_path : [])

  const description = data ? data.info.plot : undefined
  const title = data ? data.info.name.replace(/\[\d+\]|\(\d+\)/g, '') : undefined
  const releaseDate = data ? (data.info.releaseDate && parseInt(format(data.info.releaseDate, 'u'))) || data.info.year : undefined
  const director = data ? (data.info.director && data.info.director.trim()) : undefined

  const genres = (data && data.info.genre) ? data.info.genre.replaceAll(/^\s+|\s+$/g, "").split(/[^\w\sÀ-ÿ-]/g) : ['']
  const rating = data ? data.info.rating || (data.info.rating_5based && data.info.rating_5based * 2) : undefined

  const tmdbId = data ? data.tmdbId : undefined
  
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
              <button disabled key='vlc' className="w-fit ml-16 transition bg-primary hover:bg-primary/90 px-6 py-3 rounded-2xl text-background relative overflow-hidden hover:scale-95">
                <div className="flex items-center gap-2 pr-2">
                  <HugeiconsIcon icon={PlayIcon} className="fill-black size-7" />
                  <h1 className="leading-none text-base font-medium">Watch</h1>
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
  if (url.includes('tmdb')) {
    const list = url.split('/')
    const path = list[list.length - 1]
    return `https://image.tmdb.org/t/p/original/${path}`
  }
  return url
}
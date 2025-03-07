import electronApi from "@/config/electronApi"
import { usePlaylistUrl } from "@/states/usePlaylistUrl"
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react"
import { QueryFilters, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button";
import { EpisodesSection } from "./EpisodesSection";
import { ClearDataAlertDialog } from "./ClearDataAlertDialog";
import { InfoSection } from "./InfoSection";
import { Fade } from "react-awesome-reveal";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ImSpinner8 } from "react-icons/im";
import { useUserData } from "@/states/useUserData";
import { Cast, MovieDb } from "moviedb-promise";
import { format } from "date-fns";

export function SeriesPage({ seriesId, cover }: { seriesId: string, cover: string }) {
  const queryClient = useQueryClient();
  const moviedb = new MovieDb(import.meta.env.VITE_TMDB_API_KEY)

  const { urls } = usePlaylistUrl()
  const { data, isFetching } = useQuery({ queryKey: [`seriesInfo`], queryFn: fetchSeriesData})
  const updateFavorite = useUserData(state => state.updateFavorite)
  const userSeriesData = useUserData(state => state.userData.series?.find(s => s.id == seriesId))
  const [_refresh, setRefresh] = useState(false)

  async function fetchSeriesData() {
    const seriesInfo = await electronApi.getSerieInfo(urls.getSeriesInfoUrl + seriesId)
    if (!seriesInfo) return
    if (!seriesInfo.info) return

    const title = seriesInfo.info.name.replace(/\[\d+\]|\(\d+\)/g, '').split('-')
    const releaseDate = seriesInfo ? (seriesInfo.info.releaseDate && parseInt(format(seriesInfo.info.releaseDate, 'u'))) || seriesInfo.info.year : undefined
    if (!releaseDate || releaseDate === '0' as unknown as number) return seriesInfo

    const res = await moviedb.searchTv({ query: title[0], first_air_date_year: releaseDate })
    if (!res.results) return seriesInfo
    if (res.results && res.results.length === 0) return seriesInfo

    const tmdbId = res.results[0].id
    const images = await moviedb.tvImages({ id: tmdbId! })
    const tmdbCast = await moviedb.tvCredits(tmdbId!.toString())

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
    return { ...seriesInfo, tmdbImages: images, tmdbCast: tmdbCast.cast || [] }
  } 

  function refresh() {
    setRefresh(prev => !prev)
  }

  function handleFavorite() {
    updateFavorite(seriesId, 'series')
    setTimeout(() => setRefresh(p => !p), 100)
  }

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['seriesInfo'], exact: true } as QueryFilters)
    }
  }, [])
  
  const backdropPath = getRightBackdrop(data ? data.info.backdrop_path : [])

  const description = data ? data.info.plot : undefined
  const title = data ? data.info.name.replace(/\[\d+\]|\(\d+\)/g, '') : undefined
  const releaseDate = data ? (data.info.releaseDate && parseInt(format(data.info.releaseDate, 'u'))) || data.info.year : undefined
  const cast = data ? (data.info.cast && data.info.cast.trim()) : undefined
  const tmdbCast = data ? (data.tmdbCast && data.tmdbCast) : []
  const director = data ? (data.info.director && data.info.director.trim()) : undefined

  const genres = (data && data.info.genre) ? data.info.genre.replaceAll(/^\s+|\s+$/g, "").split(/[^\w\sÀ-ÿ-]/g) : ['']
  const rating = data ? data.info.rating || (data.info.rating_5based && data.info.rating_5based * 2) : undefined
  
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

        <div className={`transition pb-4 duration-500 flex flex-col ${isFetching ? 'opacity-0' : 'opacity-100'}`}>
          <InfoSection
            title={title!}
            releaseDate={releaseDate!}
            genre={genres[0]!}
            description={description!}
            cast={cast!}
            tmdbCast={tmdbCast!}
            director={director!}
            rating={rating!}
            logos={data && data.tmdbImages ? data.tmdbImages.logos! : []}
          />

          <div className="px-16 justify-between items-end flex gap-2 mt-4 w-full mb-4 z-10">
            <div className="flex gap-2">
              <Button variant={'ghost'} onClick={handleFavorite} disabled={isFetching} size={"lg"} className="flex gap-2 items-center bg-primary/10 border-none hover:bg-primary/5">
                <FaStar className={`size-4 transition duration-300 ease-in-out ${userSeriesData?.favorite && 'text-amber-300'}`} />
                <span className="leading-none text-base">
                  {userSeriesData?.favorite ? 'Remove from favorites' : 'Add to favorites'}
                </span>
              </Button>
            </div>

            <ClearDataAlertDialog refresh={refresh} seriesId={seriesId}  />
          </div>

        {data && (
            <EpisodesSection
              seriesCover={cover}
              seriesId={seriesId}
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
          className={`w-full h-full duration-700 object-cover fixed transition ease-out top-0 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </Fade>
      <div className="inset-0 w-1/2 h-full fixed scale-105 bg-gradient-to-l from-transparent to-background" />
      <div className="inset-0 w-full h-full fixed scale-105 bg-gradient-to-b from-transparent to-background" />
      <div className="inset-0 w-full h-full fixed scale-105 bg-gradient-to-b from-transparent to-background" />
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
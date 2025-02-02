import electronApi from "@/config/electronApi"
import { usePlaylistUrl } from "@/states/usePlaylistUrl"
import { FaPlay, FaStar } from "react-icons/fa";
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
import { MovieDb } from "moviedb-promise";
import { format } from "date-fns";

export function SeriesPage({ seriesId, cover }: { seriesId: string, cover: string }) {
  const queryClient = useQueryClient();
  const moviedb = new MovieDb(import.meta.env.VITE_TMDB_API_KEY)

  const { urls } = usePlaylistUrl()
  const { data, isFetching } = useQuery({ queryKey: [`seriesInfo`], queryFn: fetchSeriesData})
  const updateFavorite = useUserData(state => state.updateFavorite)
  const userSeriesData = useUserData(state => state.userData.series?.find(s => s.id == seriesId))
  const [_refresh, setRefresh] = useState(false)
  const [blurBackdrop, setBlurBackdrop] = useState(false)

  function setBlur(v: boolean) {
    setBlurBackdrop(v) 
  }

  async function fetchSeriesData() {
    const seriesInfo = await electronApi.getSerieInfo(urls.getSeriesInfoUrl + seriesId)
    if (!seriesInfo) return
    if (!seriesInfo.info) return

    const title = seriesInfo.info.name.replace(/\[\d+\]|\(\d+\)/g, '').split('-')
    const releaseDate = seriesInfo ? (seriesInfo.info.releaseDate && parseInt(format(seriesInfo.info.releaseDate, 'u'))) || seriesInfo.info.year : undefined
    if (!releaseDate) return seriesInfo

    const res = await moviedb.searchTv({ query: title[0], first_air_date_year: releaseDate })
    if (!res.results) return seriesInfo
    if (res.results && res.results.length === 0) return seriesInfo
    
    seriesInfo.info.backdrop_path = [`https://image.tmdb.org/t/p/w1280/${res.results[0].backdrop_path}`] 
    const tmdbId = res.results[0].id
    const images = await moviedb.tvImages({ id: tmdbId! })
    return { ...seriesInfo, tmdbImages: images }
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
  const director = data ? (data.info.director && data.info.director.trim()) : undefined

  const genres = data ? data.info.genre.replaceAll(/^\s+|\s+$/g, "").split(/[^\w\sÀ-ÿ-]/g) : ['']
  const rating = data ? data.info.rating || (data.info.rating_5based && data.info.rating_5based * 2) : undefined
  
  console.log(blurBackdrop);
  
  return (
    <div className="w-full h-screen flex flex-col justify-end">
        
          {isFetching ? (
            <Fade>
              <div className="w-full h-full fixed flex items-center justify-center top-0 z-20">
                <ImSpinner8 className="size-8 animate-spin text-muted-foreground" />
              </div>
            </Fade>
          ) : (
              <div className="-z-10">
                <Backdrop
              backdropPath={backdropPath!}
              cover={cover}
              blur={blurBackdrop}
            />
              </div>
          )}

        <div className={`transition duration-500 flex flex-col ${isFetching ? 'opacity-0' : 'opacity-100'}`}>
          <InfoSection
            title={title!}
            releaseDate={releaseDate!}
            genre={genres[0]!}
            description={description!}
            cast={cast!}
            director={director!}
            rating={rating!}
            logos={data && data.tmdbImages ? data.tmdbImages.logos! : []}
          />

          <div className="px-16 justify-between items-end flex gap-2 mt-4 w-full mb-4 z-10">
            <div className="flex gap-2">
              <Button variant={'ghost'} onClick={handleFavorite} disabled={isFetching} size={"lg"} className="flex gap-2 items-center bg-primary/10 border-none hover:bg-primary/5 transition-none">
                <FaStar className={`size-4 ${userSeriesData?.favorite && 'text-yellow-400'}`} />
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
              setBlur={setBlur}
            />
        )}
        </div>
      </div>
    )
}

function Backdrop({ backdropPath, cover, blur }: { backdropPath: string, cover: string, blur: boolean }) {
  const imageSrc = backdropPath || cover

  if (!imageSrc.includes('tmdb')) {
    return (
      <div className="fixed">
        <Fade triggerOnce>
          <img
            className="w-full h-full object-cover fixed top-0 -z-10"
            src={imageSrc}
          />
        </Fade>
        <div className="inset-0 w-full h-full z-0 scale-105 fixed bg-gradient-to-l from-transparent to-background/95" />
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
    <div className="fixed">
      <Fade triggerOnce duration={500}>
        <img
          className={`w-full h-full object-cover fixed top-0 invisible`}
          src={lowImage}
        />
        <LazyLoadImage
          onLoad={() => setImageLoaded(true)}
          src={highImage}
          className={`w-full h-full ${blur ? 'blur-sm brightness-75 scale-100' : 'scale-105'} duration-700 object-cover fixed transition ease-out top-0 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </Fade>
      <div className="inset-0 w-full h-full fixed scale-105 bg-gradient-to-l from-transparent to-background/95" />
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
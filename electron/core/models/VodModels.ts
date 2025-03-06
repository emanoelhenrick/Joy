import { Cast, MovieImagesResponse } from "moviedb-promise"

export interface VodPlaylistProps {
  playlist: VodProps[]
  categories: CategoriesProps[]
}

export interface VodProps {
  container_extension: any
  title: string
  num: string | number
  name: string
  stream_id: string
  rating: string
  added: string
  plot: string
  cast: string
  director: string
  category_id: string
  stream_icon: string
  updatedAt?: number
  progress?: number
}

export interface VodInfoProps {
  info: {
    name: string
    title: string
    director: string
    cast: string
    plot: string
    genre: string
    rating?: number
    rating_kinopoisk?: number
    description: string
    backdrop_path: string[]
    releasedate: string
    tmdb_id?: number
    duration_secs: number
  },
  movie_data: {
    container_extension: string
    name: string
  },
  url: string
  username: string
  password: string
  tmdbImages?: MovieImagesResponse
  tmdbCast?: Cast[]
}

export interface CategoriesProps {
  category_id: string,
  category_name: string
}

export interface UserVodDataProps {
  id?: string
  favorite?: boolean
  currentTime?: number
  duration?: number
  watching?: boolean
  updatedAt?: number
}
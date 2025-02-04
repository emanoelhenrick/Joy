import { TvImagesResponse } from "moviedb-promise"

export interface SeriesPlaylistProps {
  playlist: SeriesProps[] 
  categories: CategoriesProps[]
}

export interface SeriesProps {
  title: string
  name: string
  num: number
  series_id: number
  rating: string
  plot: string
  last_modified: string
  cast: string
  director: string
  category_id: string
  cover: string
  updatedAt?: number
  watchingNow?: {
    episode: string
    progress: number
  }
}

export interface EpisodeProps {
  id: string
  title: string
  container_extension: string
  episode_num: string
  info: {
    movie_image?: string
    plot: string
    duration_secs: number
  }
}

export interface SerieInfoProps {
  info: {
    name: string
    plot: string
    director: string
    cast: string
    genre: string
    backdrop_path: string[]
    releaseDate: string
    rating: number
    rating_5based: number
    year: number
  }
  episodes: {
    [key: string]: EpisodeProps[]
  },
  tmdbImages: TvImagesResponse
}

export interface CategoriesProps {
  category_id: string,
  category_name: string
}

export interface UserEpisodeProps {
  episodeId: string
  episodeNum: number,
  season: string
  currentTime: number
  duration: number
}

export interface UserSeriesDataProps {
  id?: string
  favorite?: boolean
  episodes?: UserEpisodeProps[]
  updatedAt?: number
  season?: string
  watching?: boolean
}
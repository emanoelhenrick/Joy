export interface VodPlaylistProps {
  playlist: VodProps[]
  categories: CategoriesProps[]
}

export interface VodProps {
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
}

export interface VodInfoProps {
  info: {
    name: string
    title: string
    director: string
    cast: string
    plot: string
    genre: string
    description: string
  },
  movie_data: {
    container_extension: string
    name: string
  },
  url: string
  username: string
  password: string
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
}
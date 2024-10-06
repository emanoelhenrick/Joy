export interface VodPlaylistProps {
  playlist: VodProps[]
  categories: CategoriesProps[]
}

export interface VodProps {
  title: string,
  stream_id: string,
  rating_5based: number,
  plot: string,
  cast: string,
  director: string,
  category_id: string,
  stream_icon: string
}

export interface CategoriesProps {
  category_id: string,
  category_name: string
}
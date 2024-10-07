export interface SeriesPlaylistProps {
  playlist: SeriesProps[] 
  categories: CategoriesProps[]
}

export interface SeriesProps {
  title: string,
  series_id: number,
  rating_5based: number,
  plot: string,
  cast: string,
  director: string,
  category_id: string,
  cover: string
}

export interface CategoriesProps {
  category_id: string,
  category_name: string
}
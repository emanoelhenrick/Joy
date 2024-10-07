export interface LivePlaylistProps {
  playlist: LiveProps[]
  categories: CategoriesProps[]
}

export interface LiveProps {
  name: string,
  stream_id: string,
  category_id: string,
  stream_icon: string
}

export interface CategoriesProps {
  category_id: string,
  category_name: string
}
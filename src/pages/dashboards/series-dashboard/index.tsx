import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/select"
import { Input } from "@/components/ui/input";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce';
import { useParams } from "react-router-dom";
import { SeriesProps } from "@/core/models/SeriesModels";
import { getLocalSeriesPlaylist } from "@/core/files/getLocalSeriesPlaylist";
import { MenuBar } from "../../menubar/MenuBar";
import { Search } from "lucide-react";

const elementsPerPage = 20

const PlaylistScroll = lazy(() => import('./components/PlaylistScroll'))

export function SeriesDashboard() {
  let { playlistName } = useParams();
  const { data, isFetched } = useQuery({ queryKey: ['SeriesPlaylist'], queryFn: () => getLocalSeriesPlaylist(playlistName!), staleTime: Infinity })

  const [playlist, setPlaylist] = useState<SeriesProps[]>([]);
  const [currentCategory, setCurrentCategory] = useState('all')
  const [hasMore, setHasMore] = useState(true)

  const [searchText, setSearchValue] = useState('')
  const [search] = useDebounce(searchText, 400)

  const filtered = useMemo(() => {
    if (isFetched) {
      if (currentCategory === 'all') {
        return search.length > 0 ? data!.playlist!.filter(p => p.title.toLowerCase().includes(search.toLowerCase())) : data!.playlist
      } else {
        return data!.playlist!.filter(p => p.category_id === currentCategory && p.title.toLowerCase().includes(search.toLowerCase()))
      }
    }
    
  }, [search, isFetched, currentCategory])

  const categories = useMemo(() => {
    if (isFetched) {
      return data!.categories
    }
  }, [isFetched])

  function paginate(page: number) {
    if (!filtered) return []

    const startIndex = (page - 1) * elementsPerPage
    const endIndex = (page * elementsPerPage) > filtered.length ? (filtered.length - 1) : (page * elementsPerPage)

    if (endIndex === filtered.length - 1) setHasMore(false)

    const paginated = filtered.slice(startIndex, endIndex)
    if (playlist.length > 0) return setPlaylist(prev => [...prev, ...paginated])
    return setPlaylist(paginated)
  }

  function fetchMore() {
    const nextPage = Math.floor((playlist.length + elementsPerPage) / elementsPerPage)
    if (hasMore) paginate(nextPage)
  }

  useEffect(() => {
    if (isFetched) {
      setPlaylist([])
      setHasMore(true)
      paginate(1)
    }
  }, [search, currentCategory, isFetched])

  return (
    <div className="h-screen flex">
      <MenuBar playlist={playlistName} tab='series-dashboard' />

      <div className="flex flex-col w-full px-4 py-9 gap-4 ml-24">
        <div className="flex justify-between items-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Series</h1>
          <div className="flex gap-4 items-center">
            <Input className="w-72 text-xl h-fit" onChange={(e) => setSearchValue(e.target.value)} />
            <Search className="mr-4 opacity-60" />
          </div>
        </div>

        <Select onValueChange={(value) => setCurrentCategory(value)}>
          <SelectTrigger  className="w-fit gap-2">
            <SelectValue  placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={'all'}>All</SelectItem>
              {categories && categories.map(c => <SelectItem value={c.category_id} key={c.category_id}>{c.category_name}</SelectItem>)}
            </SelectGroup>
          </SelectContent>
        </Select>
        {playlist.length > 0 &&
          <Suspense fallback={<p>loading...</p>}>
            <PlaylistScroll playlist={playlist} fetchMore={fetchMore} hasMore={hasMore} />
          </Suspense>
        }
      </div>
    </div>
  )
}
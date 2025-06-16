import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger
} from "../../components/dashboard/SelectCategories"
import { Suspense, useEffect, useMemo, useState } from "react";
import { useDebounce } from 'use-debounce';
import { useSeriesPlaylist, useVodPlaylist } from '@/states/usePlaylistData';
import { useMeasure } from "@uidotdev/usehooks";
import Fuse from "fuse.js"
import PaginationComponent from '@/components/PaginationComponent'
import { useSearchParams } from 'react-router-dom';
import { SearchInput } from '@/components/SearchInput';
import PlaylistScroll from "./components/PlaylistScroll";
import { Ellipsis, ListFilter } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Fade } from "react-awesome-reveal";
import { parseNumber } from "@/utils/parseNumber";


export function Dashboard() {
  const vodData = useVodPlaylist((state => state.data))
  const seriesData = useSeriesPlaylist((state => state.data))

  const [ref, { width }] = useMeasure();
  const itemsPerPage = Math.floor(width! / 145) * 10
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  const [currentCategory, setCurrentCategory] = useState('all')

  const [sortByRating, setSortByRating] = useState(false)
  const [showMovies, setShowMovies] = useState(true)
  const [showSeries, setShowSeries] = useState(true)

  const [page, setPage] = useState(1)
  const [searchValue, setSearchValue] = useState('')
  const [search, { flush }] = useDebounce(searchValue, 400)

  const data = useMemo(() => {
    if (showMovies && showSeries) {
      return {
        categories: [],
        playlist: [...vodData.playlist, ...seriesData.playlist]
      }
    }
    if (showMovies && !showSeries) return vodData
    return seriesData
  }, [seriesData, vodData, showMovies, showSeries])

  const fuse: any = useMemo(() => {
    if (!data) return 
    return new Fuse(data.playlist as any, {
      keys: ['name'],
      threshold: 0.4,
      minMatchCharLength: 2
    })
  }, [data])

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = useMemo(() => {
    setPage(1)
    if (!data) return
    const isSearching = search.length > 0
    if (currentCategory === 'all') {
      if (isSearching) return fuse!.search(search).map((i: { item: any; }) => i.item)
      return data!.playlist
    }
    if (isSearching) {
      return fuse!.search(search)
        .map((i: { item: any; }) => i.item)
        .filter((p: { category_id: string; }) => p.category_id === currentCategory)
    }
    return data!.playlist.filter(p => p.category_id === currentCategory)
  }, [search, currentCategory, data])

  const pages = useMemo(() => {
    if (!filtered) return 0
    return Math.ceil(filtered!.length / itemsPerPage)
  }, [width, filtered])

  const playlist = useMemo(() => {
    return paginate(page, itemsPerPage)
  }, [page, itemsPerPage, filtered, sortByRating])

  function paginate(page: number, elements: number) {
    if (!filtered) return []
    const filtered2 = [...filtered]
    if (sortByRating) filtered2.sort((a, b) => parseNumber(b.rating) - parseNumber(a.rating))
    const startIndex = (page - 1) * elements
    const endIndex = (page * elements) > filtered2.length ? (filtered2.length) : (page * elements)
    const paginated = filtered2.length === 1 ? filtered2 : filtered2.slice(startIndex, endIndex)
    return paginated
  }

 useEffect(() => {
  if (initialSearch) setSearchValue(initialSearch)
 }, [])

  useEffect(() => {
    flush()
    setCurrentCategory('all')
  }, [showMovies, showSeries])

  useEffect(() => {
    if (initialSearch || (searchValue === '')) return
    setSearchValue('')
  }, [currentCategory])

  useEffect(() => {
    handleScrollToTop()
  }, [page])

  function handleShowMovies() {
    if (showMovies && showSeries) setShowSeries(false)
    if (showMovies && !showSeries) setShowSeries(true)
    if (!showMovies && showSeries) {
      setShowSeries(false)
      setShowMovies(true)
    }
  }

  function handleShowSeries() {
    if (showSeries && showMovies) setShowMovies(false)
    if (showSeries && !showMovies) setShowMovies(true)
    if (!showSeries && showMovies) {
      setShowMovies(false)
      setShowSeries(true)
    }
  }

  return (
    <div className="h-fit w-full overflow-hidden my-3 rounded-3xl mr-3 relative">
      <div className='flex flex-col gap-4 w-full'>
        <section ref={ref} className='flex items-center justify-between w-full pr-5 pt-5'>
          <div className="flex gap-4 items-center w-52">
            <div className="flex gap-4 items-end">
              <h1 onClick={handleShowMovies} className={`${showMovies && !showSeries ? 'text-2xl text-primary' : 'text-lg text-muted-foreground'} transition duration-1000 font-medium hover:opacity-80 cursor-pointer`}>Movies</h1>
              <h1 onClick={handleShowSeries} className={`${showSeries && !showMovies ? 'text-2xl text-primary' : 'text-lg text-muted-foreground'} transition font-medium hover:opacity-80 cursor-pointer`}>Series</h1>
            </div>

            <Select disabled={showMovies && showSeries} onValueChange={(value) => setCurrentCategory(value)} value={currentCategory}>
              <SelectTrigger className="w-fit font-medium">
                <button disabled={showMovies && showSeries} aria-label="Categories" className={`cursor-pointer transition ${showMovies && showSeries ? 'opacity-0' : 'opacity-100'}`}>
                  <Ellipsis />
                </button>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={'all'}>All</SelectItem>
                  {data.categories && data.categories.map(c => <SelectItem value={c.category_id} key={c.category_id}>{c.category_name}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <SearchInput setSearchValue={setSearchValue} searchValue={searchValue} />
          </div>

          <div className="flex gap-2 justify-end w-52">
            <span className="text-sm text-muted-foreground">Sort by Rating</span>
            <Switch checked={sortByRating} onCheckedChange={setSortByRating} />
          </div>
        </section>

        {playlist.length > 0 ?
          <Suspense fallback={<div className='w-full h-screen' />}>
            <section className="space-y-4 rounded-2xl pr-5">
              <div className="w-full flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {filtered ? `Showing ${itemsPerPage} of ${filtered.length} results...` : '0 results...'}
                </span>

                <span className="text-sm text-muted-foreground">{data.categories.find(v => v.category_id == currentCategory)?.category_name}</span>
              </div>
              <PlaylistScroll data={playlist} />
            </section>
          </Suspense> : (
            search && <span className='pl-5 text-muted-foreground'>No results found</span>
          )
        }
      </div>
      <div className='flex justify-center mb-8'>
      {(!(filtered!.length < itemsPerPage) && playlist.length > 0) && (
          <PaginationComponent currentPage={page} totalPages={pages} setPage={setPage} />
        )}
      </div>
    </div>
  )
}
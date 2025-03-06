import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/dashboard/SelectCategories"
import { Suspense, useEffect, useMemo, useState } from "react";
import { useDebounce } from 'use-debounce';
import { useSeriesPlaylist, useVodPlaylist } from '@/states/usePlaylistData';
import { MenuTab } from './components/MenuTab';
import { useMeasure } from "@uidotdev/usehooks";
import Fuse from "fuse.js"
import PaginationComponent from '@/components/PaginationComponent'
import { useSearchParams } from 'react-router-dom';
import { SearchInput } from '@/components/SearchInput';
import PlaylistScroll from "./components/PlaylistScroll";

export function Dashboard() {
  const vodData = useVodPlaylist((state => state.data))
  const seriesData = useSeriesPlaylist((state => state.data))

  const [ref, { width }] = useMeasure();
  const itemsPerPage = Math.floor(width! / 156) * 10

  const [searchParams] = useSearchParams()

  const initialTab = searchParams.get('type') || 'vod'
  const initialSearch = searchParams.get('search') || ''
  
  const [currentCategory, setCurrentCategory] = useState('all')
  const [sortByRating, setSortByRating] = useState(false)
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState(initialTab)
  const [searchValue, setSearchValue] = useState(initialSearch)
  const [search, { flush }] = useDebounce(searchValue, 500)

  function switchTab(tab: string) {
    setSearchValue('')
    setTab(tab)
  }

  const data = useMemo(() => {
    if (tab === 'vod') return vodData
    return seriesData
  }, [seriesData, vodData, tab])

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
  }, [search, currentCategory, page, data, width, filtered, sortByRating])

  function handleSortByRating() {
    setPage(1)
    setSortByRating(prev => !prev)
  }

  function paginate(page: number, elements: number) {
    if (!filtered) return []
    const filtered2 = [...filtered]
    if (sortByRating) filtered2.sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'))
    const startIndex = (page - 1) * elements
    const endIndex = (page * elements) > filtered2.length ? (filtered2.length) : (page * elements)
    const paginated = filtered2.length === 1 ? filtered2 : filtered2.slice(startIndex, endIndex)
    return paginated
  }

  useEffect(() => {
    flush()
    setCurrentCategory('all')
  }, [tab])

  useEffect(() => {
    if (initialSearch || (searchValue === '')) return
    setSearchValue('')
  }, [currentCategory])

  useEffect(() => {
    handleScrollToTop()
  }, [page])

  return (
    <div className="h-fit w-full">
      <div className='flex flex-col gap-2'>
        <div ref={ref} className='flex items-center justify-between mt-4 mb-1'>
          <div className='flex items-center gap-2'>
            <MenuTab tab={tab} switchTab={switchTab} />

            <div onClick={handleSortByRating} className={`cursor-pointer transition hover:opacity-80 px-3 py-1.5 rounded-lg ${sortByRating ? 'bg-primary text-background' : 'bg-secondary text-muted-foreground'}`}>
              <span className="text-sm leading-none">Sort by Rating</span>
            </div>

            <Select onValueChange={(value) => setCurrentCategory(value)} value={currentCategory}>
              <SelectTrigger className="w-fit gap-2">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={'all'}>All</SelectItem>
                  {data.categories && data.categories.map(c => <SelectItem value={c.category_id} key={c.category_id}>{c.category_name}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            
          </div>

          <SearchInput setSearchValue={setSearchValue} searchValue={searchValue} />
        </div>
        {playlist.length > 0 ?
          <Suspense fallback={<div className='w-full h-screen' />}>
            <PlaylistScroll data={playlist} />
          </Suspense> : (
            search && <p className='text-sm text-muted-foreground'>No results found</p>
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
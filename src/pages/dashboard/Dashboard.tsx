import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/dashboard/SelectCategories"
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useDebounce } from 'use-debounce';
import { useSeriesPlaylist, useVodPlaylist } from '@/states/usePlaylistData';
import { MenuTab } from './components/MenuTab';
import { useMeasure } from "@uidotdev/usehooks";
import Fuse from "fuse.js"
import PaginationComponent from '@/components/PaginationComponent'
import { useSearchParams } from 'react-router-dom';
import { SearchInput } from '@/components/SearchInput';

const VodPlaylistScroll = lazy(() => import('./components/vod/VodPlaylistScroll'))
const SeriesPlaylistScroll = lazy(() => import('./components/series/SeriesPlaylistScroll'))

export function Dashboard() {
  const vodData = useVodPlaylist((state => state.data))
  const seriesData = useSeriesPlaylist((state => state.data))

  const [ref, { width }] = useMeasure();
  const itemsPerPage = Math.floor(width! / 156) * 10

  const [searchParams] = useSearchParams()

  const initialTab = searchParams.get('type') || 'vod'
  const initialSearch = searchParams.get('search') || ''
  
  const [currentCategory, setCurrentCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState(initialTab)
  const [searchValue, setSearchValue] = useState(initialSearch)
  const [search, { flush }] = useDebounce(searchValue, 500)

  function switchTab(tab: string) {
    setSearchValue('')
    setTab(tab)
  }

  let data: { categories: any[], playlist: any[] } = vodData;
  if (tab === 'vod') data = vodData
  if (tab === 'series') data = seriesData

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = useMemo(() => {
    setPage(1)
    if (data) {
      const fuse = new Fuse(data!.playlist, {
        keys: ['name'],
        threshold: 0.4,
        minMatchCharLength: 2
      })

      if (currentCategory === 'all') {
        return search.length > 0 ? fuse.search(search).map(i => i.item) : data!.playlist
      }

      return search.length > 0 ? fuse.search(search)
        .map(i => i.item)
        .filter(p => p.category_id === currentCategory) :
          data!.playlist.filter(p => p.category_id === currentCategory)
    }
    
  }, [search, currentCategory, data, tab])

  
  

  const pages = useMemo(() => {
    if (!filtered) return 0
    return Math.ceil(filtered!.length / itemsPerPage)
  }, [width, filtered])

  const playlist = useMemo(() => {
    return paginate(page, itemsPerPage)
  }, [search, currentCategory, page, data, tab, width, filtered])
  
  function paginate(page: number, elements: number) {
    if (!filtered) return []
    const startIndex = (page - 1) * elements
    const endIndex = (page * elements) > filtered.length ? (filtered.length) : (page * elements)
    const paginated = filtered.length === 1 ? filtered : filtered.slice(startIndex, endIndex)
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
        <div ref={ref} className='flex items-center justify-between mt-4'>
          <div className='flex items-center gap-2'>
            <MenuTab tab={tab} switchTab={switchTab} />
            <Select onValueChange={(value) => setCurrentCategory(value)} value={currentCategory}>
              <SelectTrigger className="w-fit gap-2">
                <SelectValue  placeholder="All" />
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
            {tab === 'vod' && <VodPlaylistScroll data={playlist} />}
            {tab === 'series' && <SeriesPlaylistScroll data={playlist} />}
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
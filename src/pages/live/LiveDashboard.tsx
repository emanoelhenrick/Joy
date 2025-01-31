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
import { useLivePlaylist } from '@/states/usePlaylistData';
import { LiveProps } from 'electron/core/models/LiveModels';
import Fuse from "fuse.js"
import { SearchInput } from '@/components/SearchInput';

const LivePlaylistScroll = lazy(() => import('./components/LivePlaylistScroll'))

const elementsPerPage = 50

export function LiveDashboard() {
  const liveData = useLivePlaylist((state => state.data))

  const [playlist, setPlaylist] = useState<LiveProps[]>([]);
  const [currentCategory, setCurrentCategory] = useState('all')
  const [hasMore, setHasMore] = useState(true)

  let data: { categories: any[], playlist: any[] } = liveData;

  const [searchValue, setSearchValue] = useState('')
  const [search] = useDebounce(searchValue, 500)

  const filtered = useMemo(() => {
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
    
  }, [search, currentCategory, data])

  const firstChannel = useMemo(() => {
    return data.playlist.find(c => c.name.includes(' HD'))
  }, [])

  function paginate(page: number) {
    if (!filtered) return []

    const startIndex = (page - 1) * elementsPerPage
    const endIndex = (page * elementsPerPage) > filtered.length ? (filtered.length - 1) : (page * elementsPerPage)

    if (endIndex === filtered.length - 1) setHasMore(false)

    const paginated = filtered.length === 1 ? filtered : filtered.slice(startIndex, endIndex)
    if (playlist.length > 0) return setPlaylist(prev => [...prev, ...paginated])
    return setPlaylist(paginated)
  }

  async function fetchMore() {
    const nextPage = Math.floor((playlist.length + elementsPerPage) / elementsPerPage)
    if (hasMore) paginate(nextPage)
  }

  useEffect(() => {
    setSearchValue('')
  }, [currentCategory])

  useEffect(() => {
    if (liveData) {
      setPlaylist([])
      setHasMore(true)
      paginate(1)
    }
  }, [search, currentCategory, liveData])

  return (
    <div className="max-h-screen overflow-hidden w-full flex flex-col">
      <div className="flex flex-col w-full">
        <div className='flex flex-col gap-2'>
          <div className='flex ml-2 items-center justify-between mt-4'>
            <div className='flex items-center justify-between gap-4'>
              <div className={`h-fit text-sm py-1 px-4 rounded-md transition hover:opacity-90 gap-2 bg-secondary text-primary relative flex items-center`}>
                <p>Live</p>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className={`relative inline-flex rounded-full h-2 w-2 bg-red-500`}/>
                </span>
              </div>
              
              <Select onValueChange={(value) => setCurrentCategory(value)} value={currentCategory}>
                <SelectTrigger  className="w-fit gap-2">
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

            <SearchInput searchValue={searchValue} setSearchValue={setSearchValue} />
          </div>
          {playlist.length > 0 ?
            <Suspense fallback={<div className='w-full h-screen' />}>
              <LivePlaylistScroll playlist={playlist} fetchMore={fetchMore} hasMore={hasMore} firstChannel={firstChannel} />
            </Suspense> : (
              search && <p className='ml-6 text-sm text-muted-foreground'>No results found</p>
            )
          }
        </div>
      </div>
    </div>
  )
}
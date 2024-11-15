import { Search, X } from 'lucide-react'
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
import { Input } from '@/components/dashboard/input';
import { useLivePlaylist } from '@/states/usePlaylistData';
import { LiveProps } from 'electron/core/models/LiveModels';

const LivePlaylistScroll = lazy(() => import('./components/LivePlaylistScroll'))

const elementsPerPage = 50

export function LiveDashboard() {
  const liveData = useLivePlaylist((state => state.data))

  const [playlist, setPlaylist] = useState<LiveProps[]>([]);
  const [currentCategory, setCurrentCategory] = useState('all')
  const [hasMore, setHasMore] = useState(true)
  // const [tab, setTab] = useState('vod')

  let data: { categories: any[], playlist: any[] } = liveData;

  const [searchText, setSearchValue] = useState('')
  const [search] = useDebounce(searchText, 400)

  const filtered = useMemo(() => {
    if (data) {
      if (currentCategory === 'all') return search.length > 0 ? data!.playlist.filter((p: { name: string; }) => p.name.toLowerCase().includes(search.toLowerCase())) : data!.playlist
      return data!.playlist.filter((p: { category_id: string; name: string; }) => p.category_id === currentCategory && p.name.toLowerCase().includes(search.toLowerCase()))
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
    if (liveData) {
      setPlaylist([])
      setHasMore(true)
      paginate(1)
    }
  }, [search, currentCategory, liveData])

  return (
    <div className="max-h-screen overflow-hidden w-full flex flex-col">
      <div className="flex flex-col w-full">
        <div className='ml-20 flex flex-col gap-2'>
          <div className='flex items-center justify-between mt-4'>
            <div className='flex items-center justify-between gap-4'>
              <div className={`h-fit border text-sm py-0.5 px-4 rounded-full transition hover:opacity-90 gap-2 bg-secondary text-primary relative flex items-center`}>
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

            <div className="flex gap-2 items-center">
              <Input className="w-36 text-sm bg-secondary rounded-full h-fit" placeholder='search' onChange={(e) => setSearchValue(e.target.value)} value={searchText} />
              {searchText ?
                <X onClick={() => setSearchValue('')} size={20} className="text-muted-foreground cursor-pointer mr-4 opacity-60" /> :
                <Search size={20} className="mr-4 text-muted-foreground opacity-60" />
              }
            </div>
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
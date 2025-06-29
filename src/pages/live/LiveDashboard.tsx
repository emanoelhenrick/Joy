import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger
} from "../../components/dashboard/SelectCategories"
import { Suspense, useEffect, useMemo, useState } from "react";
import { useDebounce } from 'use-debounce';
import { useLivePlaylist } from '@/states/usePlaylistData';
import { useMeasure } from "@uidotdev/usehooks";
import Fuse from "fuse.js"
import PaginationComponent from '@/components/PaginationComponent'
import { useSearchParams } from 'react-router-dom';
import { SearchInput } from '@/components/SearchInput';
import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import LivePlaylistScroll from "./components/LivePlaylistScroll";

export function LiveDashboard() {
  const liveData = useLivePlaylist((state => state.data))

  const [ref, { width }] = useMeasure();
  const itemsPerPage = Math.floor(width! / 150) * 10
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  const [currentCategory, setCurrentCategory] = useState('all')

  const [page, setPage] = useState(1)
  const [searchValue, setSearchValue] = useState(initialSearch)
  const [search] = useDebounce(searchValue, 500)

  const fuse: any = useMemo(() => {
    if (!liveData) return 
    return new Fuse(liveData.playlist as any, {
      keys: ['name'],
      threshold: 0.4,
      minMatchCharLength: 2
    })
  }, [liveData])

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = useMemo(() => {
    setPage(1)
    if (!liveData) return
    const isSearching = search.length > 0
    if (currentCategory === 'all') {
      if (isSearching) return fuse!.search(search).map((i: { item: any; }) => i.item)
      return liveData!.playlist
    }
    if (isSearching) {
      return fuse!.search(search)
        .map((i: { item: any; }) => i.item)
        .filter((p: { category_id: string; }) => p.category_id === currentCategory)
    }
    return liveData!.playlist.filter(p => p.category_id === currentCategory)
  }, [search, currentCategory, liveData])

  const pages = useMemo(() => {
    if (!filtered) return 0
    return Math.ceil(filtered!.length / itemsPerPage)
  }, [width, filtered])

  const playlist = useMemo(() => {
    return paginate(page, itemsPerPage)
  }, [search, currentCategory, page, liveData, width, filtered])

  function paginate(page: number, elements: number) {
    if (!filtered) return []
    const startIndex = (page - 1) * elements
    const endIndex = (page * elements) > filtered.length ? (filtered.length) : (page * elements)
    const paginated = filtered.length === 1 ? filtered : filtered.slice(startIndex, endIndex)
    return paginated
  }

  useEffect(() => {
    if (initialSearch || (searchValue === '')) return
    setSearchValue('')
  }, [currentCategory])

  useEffect(() => {
    handleScrollToTop()
  }, [page])


  return (
    <div className="h-fit w-full">
      <div className='flex flex-col gap-2 mt-3'>

        <section ref={ref} className='flex items-center justify-center w-full py-1 mt-4 mb-3'>
          <div className="flex">
            <SearchInput setSearchValue={setSearchValue} searchValue={searchValue} />
          </div>
        </section>

        {playlist.length > 0 ?
          <Suspense fallback={<div className='w-full h-screen' />}>
            <section className="bg-primary-foreground space-y-6 rounded-2xl p-6 mr-4">

              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">

                  <Select onValueChange={(value) => setCurrentCategory(value)} value={currentCategory}>
                    <SelectTrigger className="w-fit gap-2 font-medium">
                      <Button variant="ghost" size="icon" aria-label="Filters">
                        <ListFilter size={16} strokeWidth={2} aria-hidden="true" />
                      </Button>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={'all'}>All</SelectItem>
                        {liveData.categories && liveData.categories.map(c => <SelectItem value={c.category_id} key={c.category_id}>{c.category_name}</SelectItem>)}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <span className="text-sm text-muted-foreground">{liveData.categories.find(v => v.category_id == currentCategory)?.category_name}</span>
              </div>

              <LivePlaylistScroll playlist={playlist} />
            </section>
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
import { Search, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/dashboard/SelectCategories"
import { lazy, LegacyRef, Suspense, useEffect, useMemo, useState } from "react";
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce';
import { useParams } from "react-router-dom";
import electronApi from '@/config/electronApi';
import { VodProps } from 'electron/core/models/VodModels';
import { useMeasure } from '@react-hookz/web';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { MenuTab } from '@/components/menutab/MenuTab';
import { Input } from '@/components/dashboard/input';

const PlaylistScroll = lazy(() => import('./components/PlaylistScroll'))

export function VodDashboard() {
  let { playlistName } = useParams();
  const { data, isFetched } = useQuery({ queryKey: ['vodPlaylist'], queryFn: () => electronApi.getLocalVodPlaylist(playlistName!), staleTime: Infinity })

  const [playlist, setPlaylist] = useState<VodProps[]>([]);
  const [currentCategory, setCurrentCategory] = useState('all')
  const [enoughItems, setEnoughItems] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [measure, ref] = useMeasure()
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(0)

  const [searchText, setSearchValue] = useState('')
  const [search] = useDebounce(searchText, 400)

  const filtered = useMemo(() => {
    setPage(1)
    if (data) {
      if (currentCategory === 'all') return search.length > 0 ? data!.playlist!.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) : data!.playlist
      return data!.playlist!.filter(p => p.category_id === currentCategory && p.name.toLowerCase().includes(search.toLowerCase()))
    }
    
  }, [search, isFetched, currentCategory])

  const categories = useMemo(() => {
    if (isFetched) return data!.categories
  }, [isFetched])

  function paginate(page: number, elements: number) {
    if (!filtered) return []

    const startIndex = (page - 1) * elements
    const endIndex = (page * elements) > filtered.length ? (filtered.length) : (page * elements)

    if (endIndex === filtered.length) setHasMore(false)

    const paginated = filtered.length === 1 ? filtered : filtered.slice(startIndex, endIndex)
    if (playlist.length > 0) return setPlaylist(paginated)
    return setPlaylist(paginated)
  }

  function nextPage() {
    setPage(prev => prev + 1)
  }

  function previousPage() {
    if (page > 1) setPage(prev => prev - 1)
  }

  useEffect(() => {
    if (isFetched) {
      const itemsPerPage = 70

      setPages(Math.ceil(filtered!.length / itemsPerPage))
      setEnoughItems(filtered!.length < itemsPerPage)
      setPlaylist([])
      setHasMore(true)
      paginate(page, itemsPerPage)
    }
  }, [search, currentCategory, isFetched, measure, page])

  const firstPage = page < 2 ? page : page - 1
  const midPage = page > 1 ? page : 2

  return (
    <div ref={ref as unknown as LegacyRef<HTMLDivElement>} className="h-fit w-full flex flex-col">
      <div className="flex flex-col w-full">
        <div className='ml-16 flex flex-col gap-4'>
          <div className='flex items-center justify-between ml-6 mt-4'>
            <div className='flex gap-4'>
              <MenuTab playlistName={playlistName!} />
              <Select onValueChange={(value) => setCurrentCategory(value)} value={currentCategory}>
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
            </div>

            <div className="flex gap-4 items-center">
              <Input className="w-48 text-sm h-fit" onChange={(e) => setSearchValue(e.target.value)} value={searchText} />
              {searchText ?
                <X onClick={() => setSearchValue('')} size={20} className="cursor-pointer mr-4 opacity-60" /> :
                <Search size={20} className="mr-4 opacity-60" />
              }
            </div>
          </div>
          {playlist.length > 0 &&
              <Suspense fallback={<p className="text-muted-foreground">loading...</p>}>
                <PlaylistScroll playlist={playlist} />
              </Suspense>
            }
        </div>
      </div>
      <div className='flex justify-center'>
      {!enoughItems && (
          <Pagination className='mr-6 mt-4 pb-6 absolute w-fit'>
            <PaginationContent>
              <PaginationItem className={`${page < 2 && 'hidden'}`}>
                <div onClick={previousPage} className='text-muted-foreground hover:text-primary transition'><IoIosArrowBack size={16} /></div>
              </PaginationItem>
              <PaginationItem className={`${page > 2 ? '' : 'hidden'}`}>
                <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
              </PaginationItem>
              <PaginationEllipsis className={`${page == pages ? '' : 'hidden'} ${pages < 3 && 'hidden'}`} />
              <PaginationItem>
                <PaginationLink onClick={() => setPage(firstPage)} isActive={page == firstPage}>{firstPage}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => setPage(midPage)} isActive={page == midPage}>{midPage}</PaginationLink>
              </PaginationItem>
              <PaginationEllipsis className={`${((page == pages - 1) || (page == pages)) && 'hidden'}`} />
              <PaginationItem className={`${page == pages && 'hidden'} ${pages < 3 && 'hidden'}`}>
                <PaginationLink onClick={() => setPage(pages)}>{pages}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <div onClick={nextPage} className={`text-muted-foreground hover:text-primary transition ${!hasMore && 'invisible'}`}><IoIosArrowForward size={16} /></div>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  )
}
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/SelectCategories"
import { Input } from "@/components/ui/input";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce';
import { useParams } from "react-router-dom";
import { MenuBar } from "../../components/menubar/MenuBar";
import { Heart, Search } from "lucide-react";
import { LiveProps } from "electron/core/models/LiveModels";
import electronApi from "@/config/electronApi";
import { useUserData } from "@/states/useUserData";

const elementsPerPage = 40

const PlaylistScroll = lazy(() => import('./components/PlaylistScroll'))

export function LiveDashboard() {
  let { playlistName } = useParams();

  const { data, isFetched } = useQuery({ queryKey: ['livePlaylist'], queryFn: () => electronApi.getLocalLivePlaylist(playlistName!), staleTime: Infinity })

  const [showFavorites, setShowFavorites] = useState<boolean>(false)
  const [playlist, setPlaylist] = useState<LiveProps[]>([]);
  const [currentCategory, setCurrentCategory] = useState('all')
  const [hasMore, setHasMore] = useState(true)

  const [searchText, setSearchValue] = useState('')
  const [search] = useDebounce(searchText, 400)

  const { userData } = useUserData()

  const filtered = useMemo(() => {
    if (isFetched) {
      if (currentCategory === 'all') {
        return search.length > 0 ? data!.playlist!.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) : data!.playlist
      } else {
        return data!.playlist!.filter(p => p.category_id === currentCategory && p.name.toLowerCase().includes(search.toLowerCase()))
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

    const filtered2 = showFavorites
      ? filtered.filter((p) => {
        for (const channel of userData.live!) {
          if (channel.favorite && channel.id == p.stream_id) return p 
        }
      }) : filtered

    const startIndex = (page - 1) * elementsPerPage
    const endIndex = (page * elementsPerPage) > filtered2.length ? filtered2.length : (page * elementsPerPage)

    if (endIndex === filtered2.length) setHasMore(false)

    const paginated = filtered2.slice(startIndex, endIndex)
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
  }, [search, currentCategory, isFetched, showFavorites])

  return (
    <div className="h-screen flex">
      <div className="flex flex-col w-full py-9 gap-4 ml-20">
        <div className="flex justify-between items-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Live</h1>
          <div className="flex gap-4 items-center">
            <Input className="w-72 text-xl h-fit" onChange={(e) => setSearchValue(e.target.value)} value={searchText} />
            <Search className="mr-4 opacity-60" />
          </div>
        </div>

        <div className='flex items-center'>
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
          {showFavorites ? (
            <Heart onClick={() => setShowFavorites(false)} size={20} fill="red" strokeWidth={0} className={`cursor-pointer ${showFavorites ? 'visible' : 'invisible' }`}  />
          ) : (
            <Heart onClick={() => setShowFavorites(true)} size={20} className={`cursor-pointer opacity-40 group-hover:opacity-100 transition hover:scale-110`}  />
          )} 

        </div>
        {playlist.length > 0 &&
          <Suspense fallback={<p>loading...</p>}>
            <PlaylistScroll playlist={playlist} fetchMore={fetchMore} hasMore={hasMore} />
          </Suspense>
        }
      </div>
    </div>
  )
}
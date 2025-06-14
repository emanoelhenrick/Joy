"use client";

import { ArrowUpRight, CircleFadingPlus, FileInput, FolderPlus, Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useSeriesPlaylist, useVodPlaylist } from "@/states/usePlaylistData";
import { useCallback, useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import { useDebounce } from 'use-debounce';
import { VodProps } from "electron/core/models/VodModels";
import { SeriesProps } from "electron/core/models/SeriesModels";
import { Cover } from "@/components/Cover";
import { parseNumber } from "@/utils/parseNumber";
import { FaStar } from "react-icons/fa";

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const vodData = useVodPlaylist((state => state.data))
  const seriesData = useSeriesPlaylist((state => state.data))
  const [searchValue, setSearchValue] = useState('')
  const [search] = useDebounce(searchValue, 400)

  const playlist = useMemo(() => {
    if (!vodData || !seriesData) return []
    return [...vodData.playlist, ...seriesData.playlist]
  }, [seriesData, vodData])

  const fuse: any = useMemo(() => {
    if (!playlist) return 
    return new Fuse(playlist as any, {
      keys: ['name'],
      threshold: 0.4,
      minMatchCharLength: 2
    })
  }, [playlist])

  const filtered = useMemo(() => {
    if (!playlist) return
    const isSearching = search.length > 0
    if (isSearching) return fuse!.search(search).map((i: { item: any; }) => i.item)
    return playlist
  }, [search, playlist])

  const playlistSearch = useMemo(() => {
      return paginate(1, 20)
    }, [filtered])
  
  function paginate(page: number, elements: number) {
    if (!filtered) return []
    const startIndex = (page - 1) * elements
    const endIndex = (page * elements) > filtered.length ? (filtered.length) : (page * elements)
    const paginated = filtered.length === 1 ? filtered : filtered.slice(startIndex, endIndex)
    return paginated
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const renderItem = useCallback((item: any) => {
    const isVod =  item.stream_id ? true : false
    // const selectFunction = isVod ? () => setSelectedMovie(item) : () => setSelectedSeries(item)
    const itemKey = isVod ? item.stream_id + '-' + item.num : item.series_id + '-' + item.num
    const coverSrc = isVod ? item.stream_icon : item.cover
    const title = item.name
    const rating = parseNumber(item.rating).toFixed(1)
    console.log(item);
    

    return (
      <CommandItem key={itemKey} className="items-start">
        <div className="w-16 overflow-hidden rounded-xl">
          <Cover src={coverSrc} title={title} />
        </div>

        <div className="space-y-1">
          <h1 className="text-base font-semibold line-clamp-3">{title}</h1>
          <div className="flex gap-4">
            <h1 className="text-xs font-semibold text-muted-foreground">{isVod ? 'MOVIE' : 'TV SHOW'}</h1>
            <div className="flex gap-1 items-center">
              <FaStar className="opacity-50 size-2.5 2xl:size-3" />
              <h1 className="text-muted-foreground text-xs font-medium leading-tight">{rating}</h1>
            </div>
          </div>
        </div>
      </CommandItem>
    )
  }, [playlist])

  return (
    <>
      <div onClick={() => setOpen(true)} className='bg-secondary/80 hover:scale-95 transition cursor-pointer px-5 py-0 rounded-2xl flex gap-3 items-center w-fit'>
        <span className='text-sm text-primary/80'>Search...</span>
        <kbd className="-me-1 ms-12 inline-flex h-5 max-h-full items-center rounded border border-border bg-primary/30 px-1 font-[inherit] text-[0.625rem] font-medium text-primary">
          ⌘K
        </kbd>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          value={searchValue}
          placeholder="Search..."
          onValueChange={(e) => setSearchValue(e)}

        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Searching in all media...">
            {playlistSearch.map((item: any) => renderItem(item))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
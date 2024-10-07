import { VodProps } from "@/core/models/VodModels";
import InfiniteScroll from "react-infinite-scroller";
import { Cover } from "../../Cover";

export default function PlaylistScroll({ playlist, fetchMore, hasMore }: { playlist: VodProps[], fetchMore: () => void, hasMore: boolean }) {

  return (
    <div className="w-full whitespace-nowrap rounded-md h-fit">
      <InfiniteScroll
        pageStart={0}
        loadMore={fetchMore}
        hasMore={hasMore}
        loader={<div key={0}>Loading ...</div>}
      >
        <div className="w-full whitespace-nowrap rounded-md h-fit">
          <div className="flex flex-wrap gap-6">
            {playlist.map((movie) => (
              <div className="flex flex-col gap-3 w-[154px] h-fit cursor-pointer" key={movie.stream_id}>
                <Cover src={movie.stream_icon} />
                <h3 className="text-wrap text-sm font-bold">{movie.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
}
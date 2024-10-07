import { LiveProps } from "@/core/models/LiveModels";
import InfiniteScroll from "react-infinite-scroller";
import { Cover } from "../../Cover";

export default function PlaylistScroll({ playlist, fetchMore, hasMore }: { playlist: LiveProps[], fetchMore: () => void, hasMore: boolean }) {

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
            {playlist.map((channel) => (
              <div className="flex flex-col gap-3 w-[154px] h-fit cursor-pointer" key={channel.stream_id}>
                <Cover src={channel.stream_icon} />
                <h3 className="text-wrap text-sm font-bold">{channel.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  )
}
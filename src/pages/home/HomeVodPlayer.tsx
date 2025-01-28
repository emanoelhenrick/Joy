import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { VodPlayer } from "../dashboard/components/vod/VodPlayer";
import { Cross2Icon } from "@radix-ui/react-icons";
import { usePlaylistUrl } from "@/states/usePlaylistUrl";

export function HomeVodPlayer() {
  const [searchParams] = useSearchParams()
  const params = useParams()
  const navigate = useNavigate()
  const urls = usePlaylistUrl(state => state.urls)

  const streamId = searchParams.get('streamId')
  const container_extension = searchParams.get('container_extension')
  const url = `${urls.getVodStreamUrl}${streamId}.${container_extension}`

  return (
    <section className="w-full max-h-svh overflow-hidden items-center justify-center z-10">
      <div onClick={() => navigate(`/dashboard/home/${params.playlistName}`)} className=" z-30 cursor-pointer fixed right-14 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <Cross2Icon className="size-8 p-1 rounded-md bg-background/30 backdrop-blur-lg" />
      </div>
      <VodPlayer
        title="movie"
        url={url}
        currentTimeStated={0}
        data={{ id: streamId }} 
      />
    </section>
  )
}
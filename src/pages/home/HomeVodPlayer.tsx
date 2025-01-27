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
    <section className="w-full max-h-svh overflow-hidden items-center justify-center z-30">
      <div onClick={() => navigate(`/dashboard/home/${params.playlistName}`)} className=" z-10 cursor-pointer absolute right-14 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <Cross2Icon className="h-8 w-8" />
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
import { useLocation, useNavigate } from "react-router-dom"

export function MenuTab({ playlistName }: { playlistName: string }) {
  const navigate = useNavigate()
  const location = useLocation()

  function changeTab(tab: string) {
    navigate(`/dashboard/${tab}/${playlistName}`)
  }

  return (
    <div className="flex justify-center gap-4 items-center w-fit">
        <p
          onClick={() => changeTab('vod')}
          className={`h-fit border text-sm py-1 px-6 rounded-full cursor-pointer transition hover:opacity-90 gap-2 ${location.pathname.includes('vod') ? 'bg-foreground text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
          >
          Movies
        </p>
        <p
          onClick={() => changeTab('series')}
          className={`h-fit border text-sm py-1 px-6 rounded-full cursor-pointer transition hover:opacity-90 gap-2 ${location.pathname.includes('series') ? 'bg-foreground text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
          >
          Series
        </p>
        <p
          onClick={() => changeTab('live')}
          className={`h-fit border text-sm py-1 px-6 rounded-full cursor-pointer transition hover:opacity-90 gap-2 ${location.pathname.includes('live') ? 'bg-foreground text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
          >
          Live
        </p>
    </div>
  )
}
import { useLocation, useNavigate } from "react-router-dom"

export function MenuTab({ playlistName }: { playlistName: string }) {
  const navigate = useNavigate()
  const location = useLocation()

  function changeTab(tab: string) {
    navigate(`/dashboard/${tab}/${playlistName}`)
  }

  return (
    <div className="flex justify-center gap-12 items-center pt-6 pb-2">
        <p
          onClick={() => changeTab('vod')}
          className={`h-fit cursor-pointer transition hover:opacity-90 gap-2 ${location.pathname.includes('vod') ? 'opacity-90' : 'opacity-30'}`}
          >
          Movies
        </p>
        <p
          onClick={() => changeTab('series')}
          className={`h-fit cursor-pointer transition hover:opacity-90 gap-2 ${location.pathname.includes('series') ? 'opacity-90' : 'opacity-30'}`}
          >
          Series
        </p>
        <p
          onClick={() => changeTab('live')}
          className={`h-fit cursor-pointer transition hover:opacity-90 gap-2 ${location.pathname.includes('live') ? 'opacity-90' : 'opacity-30'}`}
          >
          Live
        </p>
    </div>
  )
}
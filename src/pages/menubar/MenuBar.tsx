import { Button } from "@/components/ui/button";
import { Clapperboard, Film, Settings, Tv } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MenuBar({ playlist, tab }: { playlist?: string, tab: string }) {
  const navigate = useNavigate();

  function changeTab(tab: string) {
    navigate(`/${tab}/${playlist}`)
  }

  return (
    <div className="flex flex-col items-center justify-between px-2 py-8 h-full gap-4 border-r fixed">
      <div className="flex flex-col items-center l gap-4">
        <Button variant={tab === 'vod-dashboard' ? 'default' : 'ghost'} onClick={() => changeTab('vod-dashboard')} className="h-fit">
          <Film />
        </Button>
        <Button variant={tab === 'series-dashboard' ? 'default' : 'ghost'} onClick={() => changeTab('series-dashboard')} className="h-fit">
          <Clapperboard />
        </Button>
        <Button variant={tab === 'live-dashboard' ? 'default' : 'ghost'} onClick={() => changeTab('live-dashboard')} className="h-fit">
          <Tv />
        </Button>
      </div>

      <Button variant={tab === 'settings-dashboard' ? 'default' : 'ghost'} onClick={() => changeTab('settings-dashboard')} className="h-fit">
        <Settings />
      </Button>
    </div>
  )
}
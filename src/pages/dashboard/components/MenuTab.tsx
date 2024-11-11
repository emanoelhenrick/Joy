export function MenuTab({ tab, setTab }: { tab: string, setTab: (tab: string) => void }) {

  return (
    <div className="flex justify-center gap-4 items-center w-fit">
        <p
          onClick={() => setTab('vod')}
          className={`h-fit border text-sm py-1 px-6 rounded-full cursor-pointer transition hover:opacity-90 gap-2 ${tab.includes('vod') ? 'bg-foreground text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
          >
          Movies
        </p>
        <p
          onClick={() => setTab('series')}
          className={`h-fit border text-sm py-1 px-6 rounded-full cursor-pointer transition hover:opacity-90 gap-2 ${tab.includes('series') ? 'bg-foreground text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
          >
          Series
        </p>
        <p
          onClick={() => setTab('live')}
          className={`h-fit border text-sm py-1 px-6 rounded-full cursor-pointer transition hover:opacity-90 gap-2 ${tab.includes('live') ? 'bg-foreground text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
          >
          Live
        </p>
    </div>
  )
}
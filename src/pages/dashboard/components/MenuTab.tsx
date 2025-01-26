export function MenuTab({ tab, switchTab }: { tab: string, switchTab: (tab: string) => void }) {

  return (
    <div className="flex justify-center gap-2 items-center w-fit">
        <p
          onClick={() => switchTab('vod')}
          className={`h-fit border text-sm py-0.5 px-3 rounded-md cursor-pointer transition hover:opacity-90 gap-2 ${tab.includes('vod') ? 'bg-foreground text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
          >
          Movies
        </p>
        <p
          onClick={() => switchTab('series')}
          className={`h-fit border text-sm py-0.5 px-3 rounded-md cursor-pointer transition hover:opacity-90 gap-2 ${tab.includes('series') ? 'bg-foreground text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
          >
          Series
        </p>
    </div>
  )
}
export function MenuTab({ tab, switchTab }: { tab: string, switchTab: (tab: string) => void }) {

  return (
    <section className="flex gap-0.5 items-center w-fit bg-secondary p-1 rounded-lg">
        <div
          onClick={() => switchTab('vod')}
          className={`text-sm py-1 px-3 rounded-md duration-200 ease-in-out cursor-pointer transition hover:opacity-90 gap-2 ${tab.includes('vod') ? 'bg-background text-primary' : 'bg-secondary text-muted-foreground'}`}
          >
          Movies
        </div>
        <div
          onClick={() => switchTab('series')}
          className={`text-sm py-1 px-3 rounded-md duration-200 ease-in-out cursor-pointer transition hover:opacity-90 gap-2 ${tab.includes('series') ? 'bg-background text-primary' : 'bg-secondary text-muted-foreground'}`}
          >
          Series
        </div>
    </section>
  )
}
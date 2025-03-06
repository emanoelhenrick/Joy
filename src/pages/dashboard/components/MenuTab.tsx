export function MenuTab({ tab, switchTab }: { tab: string, switchTab: (tab: string) => void }) {

  return (
    <section className="flex gap-0.5 items-center">
        <div
          onClick={() => switchTab('vod')}
          className={`text-lg py-1 px-2 flex justify-center rounded-md duration-200 ease-in-out cursor-pointer relative transition hover:opacity-90 gap-2 ${tab.includes('vod') ? 'bg-background text-primary' : 'text-muted-foreground'}`}
          >
          Movies
        </div>
        <div
          onClick={() => switchTab('series')}
          className={`text-lg py-1 px-2 rounded-md duration-200 ease-in-out cursor-pointer transition hover:opacity-90 gap-2 ${tab.includes('series') ? 'bg-background text-primary' : 'text-muted-foreground'}`}
          >
          Series
        </div>
    </section>
  )
}
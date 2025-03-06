import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/MediaInfoDialog"
import electronApi from "@/config/electronApi"
import { useEffect, useState } from "react"
import { SiVlcmediaplayer } from "react-icons/si"
import { useToast } from "@/hooks/use-toast"
import { QueryFilters, useQuery, useQueryClient } from "@tanstack/react-query"
import { ImSpinner8 } from "react-icons/im"

interface VlcDialogProps {
  open: boolean
  closeDialog: () => void
}

export function VlcDialog({ open, closeDialog }: VlcDialogProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [isRunning, setIsRunning] = useState(false)

  const { data } = useQuery({
    queryKey: [`vlcState`],
    queryFn: async () => await electronApi.getVLCState(),
    refetchInterval: 1000,
    retry: false,
    refetchIntervalInBackground: true,
    enabled: open
  })

  useEffect(() => {
    if (data && data.length > 0 && data.time > 0) {
      setIsRunning(true)
    }
  }, [data])

  useEffect(() => {
    window.ipcRenderer.on('vlc-status', (_event, args) => {
      if (args.running) return
      closeDialog()
      if (args.error) {
        toast({
          variant: "destructive",
          title: 'Unable to connect to the server',
          description: 'Please try again later. If the issue persists, consider contacting your playlist support'
        })
      }
    });

    return () => {
      electronApi.removeAllListeners('vlc-status')
      queryClient.removeQueries({ queryKey: ['vlcState'], exact: true } as QueryFilters)
    }
  }, [])

  return (
    <Dialog key='vlc-dialog' open={open}>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen items-center justify-center bg-transparent border-none shadow-none z-50" aria-describedby={undefined}>
        <DialogTitle className="hidden" />
        <div className="flex h-full flex-col justify-center items-center gap-4 relative">
          {!isRunning && <ImSpinner8 className="size-8 animate-spin text-muted-foreground fixed bottom-16" />}
          <SiVlcmediaplayer className={`size-16 transition-colors ${isRunning && 'text-orange-400'}`} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/MediaInfoDialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import { VodPlayer } from "./VodPlayer"
import { useState } from "react"
import { usePlaylistUrl } from "@/states/usePlaylistUrl"

interface VodPlayerDialogProps {
  streamId: string
  name: string
  container_extension: string
  open: boolean
  setIsOpen: (bool: boolean) => void
  currentTime?: number
}

export function VodPlayerDialog({ streamId, name, container_extension, open, setIsOpen, currentTime = 0 }: VodPlayerDialogProps) {
  const urls = usePlaylistUrl(state => state.urls)

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent className="w-fit items-center justify-center" aria-describedby={undefined}>
        <div onClick={() => setIsOpen(false)} className=" z-10 cursor-pointer absolute right-14 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <Cross2Icon className="h-8 w-8" />
        </div>
        <DialogTitle className="hidden">{name}</DialogTitle>
        <div className="w-screen">
          <VodPlayer
            url={`${urls.getVodStreamUrl}/${streamId}.${container_extension}`}
            currentTimeStated={currentTime}
            data={{id: streamId}}
            title={name}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
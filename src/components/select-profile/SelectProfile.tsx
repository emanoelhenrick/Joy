import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Plus } from "lucide-react";

export function SelectProfile({ changeProfile }: { changeProfile: (profile: string) => void }) {
  

  const profiles = [
    'manel',
    'sofia',
    'duda'
  ]

  return (
    <div className="flex gap-6 p-4  ">
      {profiles.map(p => (
        <div onClick={() => changeProfile(p)} className="flex flex-col cursor-pointer hover:opacity-80 transition items-center gap-1">
          <Avatar className="relative w-24 h-24">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="text-muted-foreground text-sm">{p}</p>
        </div>
      ))}
      <div className="w-24 h-24 rounded-full flex border bg-secondary hover:opacity-80 cursor-pointer items-center justify-center">
        <Plus size={42} className="text-muted-foreground transition" />
      </div>
    </div>
  )
}
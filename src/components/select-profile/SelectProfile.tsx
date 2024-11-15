import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Plus } from "lucide-react";

export function SelectProfile({ changeProfile }: { changeProfile: (profile: string) => void }) {
  

  const profiles = [
    'manel',
    'sofia',
    'duda'
  ]

  return (
    <div className="flex gap-4">
      {profiles.map(p => (
        <div onClick={() => changeProfile(p)} className="flex flex-col cursor-pointer hover:opacity-80 transition items-center gap-1">
          <Avatar className="relative rounded-2xl w-24 h-24">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="text-muted-foreground text-sm">{p}</p>
        </div>
      ))}
      <div className="w-16 h-24 flex items-center justify-center">
        <Plus size={42} className="text-muted-foreground hover:text-primary cursor-pointer transition" />
      </div>
    </div>
  )
}
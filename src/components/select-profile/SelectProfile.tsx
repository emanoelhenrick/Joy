import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import electronApi from "@/config/electronApi";
import { useUserData } from "@/states/useUserData";

interface ProfilesProps {
  current: string
  profiles: string[]
  playlistName: string
}

export function SelectProfile({ changeProfile, data, setIsCreating, isCreating }: { changeProfile: (profile: string) => void, data: ProfilesProps, setIsCreating: (value: boolean) => void,
  isCreating: boolean }) {

  const [inputValue, setInputValue] = useState('')
  const isProfilesLimit = data.profiles.length === 5
  const updateUserData = useUserData(state => state.updateUserData)

  async function createNewProfile() {
    await electronApi.createProfile({ playlistName: data.playlistName, profile: inputValue })
    const userData = await electronApi.getUserData({ playlistName: data.playlistName, profile: inputValue })
    updateUserData(userData)
    changeProfile(inputValue)
    setIsCreating(false)
  }

  return (
    <div className="flex gap-6 p-4  ">
      {data.profiles.map(p => (
        <div onClick={() => changeProfile(p)} className="flex flex-col cursor-pointer hover:opacity-80 transition items-center gap-1">
          <Avatar className="relative w-24 h-24">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="text-muted-foreground text-sm">{p}</p>
        </div>
      ))}
      <div onClick={() => setIsCreating(true)} className={`w-24 h-24 ${isProfilesLimit && 'hidden'} rounded-full flex border bg-secondary hover:opacity-80 cursor-pointer items-center justify-center`}>
        <Plus size={42} className="text-muted-foreground transition" />
      </div>
      <AlertDialog open={isCreating}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{`New profile`}</AlertDialogTitle>
          </AlertDialogHeader>

          <Input className="" placeholder='Name' onChange={(e) => setInputValue(e.target.value)} value={inputValue} />

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsCreating(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={createNewProfile}>Create</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
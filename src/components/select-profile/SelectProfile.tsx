import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Avatar } from "../ui/avatar";
import { Plus, Settings, Trash } from "lucide-react";
import { Input } from "../ui/input";
import electronApi from "@/config/electronApi";
import { useUserData } from "@/states/useUserData";
import { PiGearSixFill } from "react-icons/pi";

interface ProfilesProps {
  current: string
  profiles: string[]
  playlistName: string
}

interface Props {
  changeProfile: (profile: string) => void
  data: ProfilesProps
  setIsCreating: (value: boolean) => void
  isCreating: boolean
  setIsEditing: (value: boolean) => void
  isEditing: boolean
  setIsRemoving: (value: boolean) => void
  isRemoving: boolean
  setUpdateRender: (prev: any) => void
}

export function SelectProfile({ changeProfile, data, setIsCreating, isCreating, setIsEditing, isEditing, setIsRemoving, isRemoving, setUpdateRender }: Props) {

  const [inputValue, setInputValue] = useState('')
  const isProfilesLimit = data.profiles.length === 5
  const updateUserData = useUserData(state => state.updateUserData)

  async function createNewProfile() {
    await electronApi.createProfile(inputValue)
    const userData = await electronApi.getUserData(inputValue)
    updateUserData(userData)
    changeProfile(inputValue)
    setIsCreating(false)
  }

  async function editProfile() {
    await electronApi.renameProfile({ profile: data.current, newName: inputValue })
    const userData = await electronApi.getUserData(inputValue)
    updateUserData(userData)
    setUpdateRender((prev: any) => !prev)
    setIsEditing(false)
  }

  async function removeProfile() {
    await electronApi.removeProfile(data.current)
    const prof = data.profiles.find(p => p !== data.current)

    if (!prof) {
      await electronApi.createProfile('Default')
      const userData = await electronApi.getUserData('Default')
      updateUserData(userData)
      changeProfile('Default')
      setIsRemoving(false)
      setIsEditing(false)
      setUpdateRender((prev: any) => !prev)
      return
    }

    const userData = await electronApi.getUserData(prof)
    updateUserData(userData)
    setIsRemoving(false)
    setIsEditing(false)
    setUpdateRender((prev: any) => !prev)
  }

  function getInitials(string: string) {
    if (!string || typeof string !== 'string') return '';
    const words = string.trim().split(/\s+/);
    const initials = words.slice(0, 2).map(word => word.charAt(0).toUpperCase());
    return initials.join('');
  }

  useEffect(() => {
    if (isEditing) setInputValue(data.current)
  }, [isEditing])

  return (
    <div className="flex gap-6 p-4">
      {data.profiles.map(p => (
        <div key={p} onClick={() => data.current === p ? setIsEditing(true) : changeProfile(p)} className={`flex hover:scale-105 relative ${data.current !== p && 'opacity-50'} flex-col cursor-pointer group transition items-center gap-1`}>
          <Avatar className={`relative transition bg-secondary flex items-center justify-center w-24 h-24 `}>
            <p className={`absolute ${data.current !== p && 'group-hover:opacity-100'} text-muted-foreground opacity-100 group-hover:opacity-0 transition text-4xl`}>{getInitials(p)}</p>
            <PiGearSixFill className={`absolute size-8 ${data.current !== p && 'invisible'} opacity-0 group-hover:opacity-100 text-muted-foreground transition`}/>
          </Avatar>
          
          <p className="text-muted-foreground text-center max-w-24 truncate text-sm">
            {p}
          </p>
        </div>
      ))}
      <div onClick={() => setIsCreating(true)} className={`w-24 h-24 ${isProfilesLimit && 'hidden'} rounded-full flex hover:scale-105 border bg-secondary opacity-50 hover:opacity-80 cursor-pointer items-center justify-center`}>
        <Plus size={42} className="text-muted-foreground transition" />
      </div>
      <AlertDialog open={isCreating}>
        <AlertDialogContent className="border-none bg-primary-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>{`New profile`}</AlertDialogTitle>
          </AlertDialogHeader>
          <Input className="border-none bg-secondary" placeholder='Name' onChange={(e) => setInputValue(e.target.value)} value={inputValue} />
          <AlertDialogFooter>
            <AlertDialogCancel className="border-none bg-primary-foreground" onClick={() => setIsCreating(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={createNewProfile}>Create</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isEditing}>
        <AlertDialogContent className="border-none bg-primary-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>{`Edit profile`}</AlertDialogTitle>
          </AlertDialogHeader>
          <Input className="border-none bg-secondary" onChange={(e) => setInputValue(e.target.value)} value={inputValue} />
          <p onClick={() => setIsRemoving(true)} className="text-sm flex gap-1 w-fit text-red-500 hover:opacity-80 transition cursor-pointer items-center">Remove profile</p>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-none bg-primary-foreground" onClick={() => setIsEditing(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={editProfile}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isRemoving}>
        <AlertDialogContent className="border-none bg-primary-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold">{`Are you absolutely sure?`}</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-muted-foreground">This action will remove the entire user data</p>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-none bg-primary-foreground" onClick={() => setIsRemoving(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 text-primary" onClick={removeProfile}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
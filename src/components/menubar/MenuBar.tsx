import electronApi from "@/config/electronApi";
import { useEffect, useRef, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import { SettingsPage } from "@/pages/settings";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useToast } from "@/hooks/use-toast";
import { differenceInHours } from "date-fns";
import { useLivePlaylist, useSeriesPlaylist, useVodPlaylist } from "@/states/usePlaylistData";
import { SelectProfile } from "../select-profile/SelectProfile";
import { useUserData } from "@/states/useUserData";
import { PiHouseFill, PiMagnifyingGlassBold, PiGearSixFill } from "react-icons/pi";
import { BiSolidTv } from "react-icons/bi";
import { useMeasure } from "@uidotdev/usehooks";
import { ImSpinner8 } from "react-icons/im";

interface ProfilesProps {
  current: string
  profiles: string[]
  playlistName: string
}

export function MenuBar() {
  const [playlistName, setPlaylistName] = useState<string>('')
  const [updating, setUpdating] = useState(false)
  const [profileDialog, setProfileDialog] = useState(false)
  const [updatingError, setUpdatingError] = useState(false)
  const [profiles, setProfiles] = useState<ProfilesProps>({ current: '', profiles: [''], playlistName: '' })
  const { urls } = usePlaylistUrl()
  const navigate = useNavigate();
  const location = useLocation()
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [updateRender, setUpdateRender] = useState(false)
  const [menuRef, { width }] = useMeasure();

  const { toast } = useToast()

  const updateVodPlaylistState = useVodPlaylist(state => state.update)
  const updateSeriesPlaylistState = useSeriesPlaylist(state => state.update)
  const updateLivePlaylistState = useLivePlaylist(state => state.update)
  const updateUserData = useUserData(state => state.updateUserData)

  async function updatePlaylist(fromSettings?: boolean) {
    const meta = await electronApi.getMetadata()
    const prof = {
      current: meta.currentPlaylist.profile,
      profiles: meta.playlists.find(p => p.name === meta.currentPlaylist.name)!.profiles,
      playlistName: meta.currentPlaylist.name
    }
    setProfiles(prof)
    setPlaylistName(meta.currentPlaylist.name)

    const playlist = meta.playlists.find(p => p.name === meta.currentPlaylist.name)
    const difference = differenceInHours(Date.now(), new Date(playlist!.updatedAt!))
    if (fromSettings) return await updateCurrentPlaylist()
    if (difference < 12) return
    await updateCurrentPlaylist()
  }

  async function verifyAuth() {
    const authResponse = await electronApi.authenticateUser(urls.getAuthenticateUrl)
    if (authResponse.status) return
    setUpdatingError(true)
    setUpdating(false)
    return toast({
      title: 'The playlist could not be updated',
      description: authResponse.message,
      variant: "destructive"
    })
  }

  async function changeProfile(selectedProfile: string) {
    const userData = await electronApi.getUserData(selectedProfile)
    await electronApi.switchProfile(selectedProfile)
    updateUserData(userData)
    setUpdateRender(prev => !prev)
    toast({ description: `switching to ${selectedProfile}`})
    setProfileDialog(false)
  }

  async function updateCurrentPlaylist() {
    setUpdating(true)

    const response = await electronApi.updateCurrentPlaylist()
    if (!response.isSuccess) {
      setUpdatingError(true)
      setUpdating(false)
      return toast({
        variant: "destructive",
        title: typeof response.data === "string" ? response.data : 'Error'
      })
    }

    const { updatedVod, updatedSeries, updatedLive } = response.data

    updateVodPlaylistState(updatedVod)
    updateSeriesPlaylistState(updatedSeries)
    updateLivePlaylistState(updatedLive)
    
    setUpdating(false)
    toast({ description: 'The playlist was updated'})
  }

  const ref = useRef<any>();

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current
        && !ref.current.contains(event.target)
        && !isCreating
        && !isEditing
        && !isRemoving
      ) setProfileDialog(false)
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [changeProfile]);

  useEffect(() => {
    verifyAuth()
    updatePlaylist()
  }, [updateRender])

  function getInitials(string: string) {
    if (!string || typeof string !== 'string') return '';
    const words = string.trim().split(/\s+/);
    const initials = words.slice(0, 2).map(word => word.charAt(0).toUpperCase());
    return initials.join('');
  }

  return (
      <div>
      <div style={{ width: width ? width : 95 }} className="block" />
    
      <div ref={menuRef} className="flex flex-col gap-3 fixed p-3 bg-background left-0 justify-between items-start h-screen z-50">
        <Fade className="w-full" duration={500} direction="left" triggerOnce>
          <section className="bg-primary-foreground w-full rounded-2xl h-fit p-3 space-y-2">
            <Dialog open={profileDialog} modal>
              <DialogTrigger onClick={() => setProfileDialog(true)} asChild>
                  <div className="flex gap-3 bg-secondary/60 p-3 rounded-xl items-center relative hover:opacity-80 cursor-pointer">
                    <div className="">
                      <Avatar  className="relative rounded-md bg-secondary size-11 cursor-pointer hover:opacity-80 transition flex items-center justify-center">
                        <AvatarImage src="https://github.com/shadcn.png" /> 
                        <AvatarFallback>{getInitials(profiles.current)}</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex flex-col gap-1">
                      <h1 className="font-bold text-muted-foreground leading-none capitalize">{profiles.current}</h1>
                      <div className="flex items-center gap-2">
                        <h1 className="text-muted-foreground text-sm opacity-80 leading-none">
                          {updating ? 'updating...' : updatingError ? 'disconnected' : 'connected'}
                        </h1>

                        <span className="flex h-2 w-2 relative">
                          {updating && <span className="absolute animate-ping inline-flex h-2 w-2 rounded-full bg-blue-500 opacity-75" />}
                          <span className={`inline-flex rounded-full h-full w-full ${updating ? 'bg-sky-400' : updatingError ? 'bg-red-500' : 'bg-green-500'}`}/>
                        </span>
                      </div>
                      
                    </div>
                  </div>
              </DialogTrigger>
              <DialogContent ref={ref} className="w-fit items-center focus:outline-none outline-none border-none bg-primary-foreground" aria-describedby={undefined}>
                <DialogTitle className="text-center text-muted-foreground">Select profile</DialogTitle>
                <SelectProfile
                  changeProfile={changeProfile}
                  data={profiles}
                  isCreating={isCreating}
                  setIsCreating={setIsCreating}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  isRemoving={isRemoving}
                  setIsRemoving={setIsRemoving}
                  setUpdateRender={setUpdateRender}

                />
              </DialogContent>
            </Dialog>

            {/* <span className="text-sm hover:opacity-60 cursor-pointer font-medium p-1 text-muted-foreground opacity-80 mt-1 flex items-center gap-2">
              <RotateCw className="size-4" />
              About 5 minutes...
            </span> */}
          </section>
        </Fade>

        <Fade className="h-full w-full" duration={500} direction="left" delay={100} triggerOnce>
          <section className="flex flex-col justify-between w-full bg-primary-foreground rounded-2xl h-full p-5">
            <div className="space-y-3 pr-8">
              <button onClick={() => navigate(`/dashboard/home/${playlistName}`)} className={`transition h-fit flex items-center hover:opacity-80 p-1 w-full gap-3 ${location.pathname.includes('home') ? 'opacity-100' : 'opacity-50' }`}>
                <PiHouseFill className="size-6" />
                <span className="font-bold">Home</span>
              </button>

              <button
                onClick={() => navigate(`/dashboard/explore`)}
                className={`h-fit transition flex hover:opacity-80 items-center p-1 w-full gap-3 ${location.pathname.includes('explore') ? 'opacity-100' : 'opacity-50' }`}
                >
                <PiMagnifyingGlassBold className="size-6" />
                <span className="font-bold">Search...</span>
              </button>

              <button onClick={() => navigate(`/dashboard/live`)} className={`h-fit transition hover:opacity-80 flex items-center p-1 w-full gap-3 ${location.pathname.includes('live') ? 'opacity-100' : 'opacity-50' }`}>
                <BiSolidTv className='size-6' />
                <span className="font-bold">Live Channels</span>
              </button>
            </div>

            <section className="flex flex-col space-y-3">
              {/* <button disabled onClick={() => navigate(`/dashboard/history`)} className={`h-fit transition hover:opacity-80 flex items-center p-1 w-full gap-3 ${location.pathname.includes('history') ? 'opacity-100' : 'opacity-50' }`}>
                <PiClockFill className='size-6' />
                <span className="font-bold">History</span>
              </button> */}

              <Dialog>
                <DialogTrigger asChild>
                  <button className={`h-fit transition hover:opacity-80 flex items-center p-1 w-full gap-3 ${location.pathname.includes('history') ? 'opacity-100' : 'opacity-50' }`}>
                    <PiGearSixFill className='size-6' />
                    <span className="font-bold">Settings</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="w-1/2 max-w-[700px] items-center p-8 border-none bg-primary-foreground" aria-describedby={undefined}>
                  <DialogTitle className="hidden">Settings</DialogTitle>
                  {playlistName && <SettingsPage currentPlaylist={playlistName} updating={updating} updatePlaylist={updatePlaylist} />}
                </DialogContent>
              </Dialog>
            </section>
          </section>
        </Fade>
      </div>

      {updating && (
        <div className="fixed z-50 right-4 bottom-4 flex p-4 w-56 items-center gap-2 bg-primary-foreground rounded-lg overflow-hidden">
          <ImSpinner8 className="size-4 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground text-sm">Updating playlist...</span>
        </div>
      )}
    </div>
  )
}
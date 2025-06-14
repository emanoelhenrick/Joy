import electronApi from "@/config/electronApi";
import { useEffect, useRef, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import { SettingsPage } from "@/pages/settings";
import { usePlaylistUrl } from "@/states/usePlaylistUrl";
import { useToast } from "@/hooks/use-toast";
import { differenceInHours } from "date-fns";
import { useLivePlaylist, useSeriesPlaylist, useVodPlaylist } from "@/states/usePlaylistData";
import { SelectProfile } from "../select-profile/SelectProfile";
import { useUserData } from "@/states/useUserData";
import { useMeasure } from "@uidotdev/usehooks";
import { ImSpinner8 } from "react-icons/im";
import { HugeiconsIcon } from '@hugeicons/react';
import { Home01Icon, Search01Icon, Tv01Icon, Settings03Icon, PlayIcon, Download04Icon } from '@hugeicons/core-free-icons';

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
    
      <div ref={menuRef} className="flex flex-col py-8 px-8 gap-8 fixed left-0 justify-between items-center h-screen z-50">
        <Fade className="w-full" duration={500} direction="left" triggerOnce>
          <Dialog open={profileDialog} modal>
              <DialogTrigger onClick={() => setProfileDialog(true)} asChild>
                  <div className="flex gap-3 rounded-xl justify-center items-center">
                    <div className="text-background rounded-xl aspect-square">
                      <HugeiconsIcon strokeWidth={1} icon={PlayIcon} className={`-m-2 color-primary fill-white size-14 rotate-90 ${updating && 'animate-pulse fill-blue-400'}`} />
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
        </Fade>

        <Fade className="h-full w-full" duration={500} direction="left" delay={100} triggerOnce>
          <section className="flex flex-col justify-between w-full items-center h-full">
            <div className="space-y-10 flex flex-col justify-center h-full">
              <div onClick={() => navigate(`/dashboard/home/${playlistName}`)} className={`cursor-pointer transition h-fit flex items-center hover:opacity-80 p-1 w-full gap-3 ${location.pathname.includes('home') ? 'opacity-100' : 'opacity-50' }`}>
                <HugeiconsIcon strokeWidth={2} icon={Home01Icon} className="size-6" />
              </div>

              <div onClick={() => navigate(`/dashboard/live`)} className={`h-fit cursor-pointer transition hover:opacity-80 flex items-center p-1 w-full gap-3 ${location.pathname.includes('live') ? 'opacity-100' : 'opacity-50' }`}>
                <HugeiconsIcon strokeWidth={2} icon={Tv01Icon} className="size-6" />
              </div>

              <div
                onClick={() => navigate(`/dashboard/explore`)}
                className={`h-fit cursor-pointer transition flex hover:opacity-80 items-center p-1 w-full gap-3 ${location.pathname.includes('explore') ? 'opacity-100' : 'opacity-50' }`}
                >
                <HugeiconsIcon strokeWidth={2} icon={Search01Icon} className="size-6" />
              </div>
            </div>

            <section className="flex flex-col space-y-8">
              {/* <button disabled onClick={() => navigate(`/dashboard/history`)} className={`h-fit transition hover:opacity-80 flex items-center p-1 w-full gap-3 ${location.pathname.includes('history') ? 'opacity-100' : 'opacity-50' }`}>
                <PiClockCounterClockwiseFill className='size-6' />
                <span className="font-bold">History</span>
              </button> */}

              {/* <div
                onClick={() => navigate(`/dashboard/explore`)}
                className={`h-fit cursor-pointer transition flex hover:opacity-80 items-center p-1 w-full gap-3 ${location.pathname.includes('explore') ? 'opacity-100' : 'opacity-50' }`}
                >
                <HugeiconsIcon strokeWidth={2} icon={Download04Icon} className="size-5" />
              </div> */}

              <Dialog>
                <DialogTrigger asChild>
                  <div className={`h-fit cursor-pointer transition hover:opacity-80 flex items-center p-1 w-full ${location.pathname.includes('history') ? 'opacity-100' : 'opacity-50' }`}>
                    <HugeiconsIcon strokeWidth={2} icon={Settings03Icon} className="size-5" />
                  </div>
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
    </div>
  )
}
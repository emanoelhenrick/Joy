import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useEffect, useState } from "react"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import electronApi from "@/config/electronApi"
import { PlaylistInfo } from "electron/core/models/PlaylistInfo"
import { makeUrls, PlaylistUrls, usePlaylistUrl } from "@/states/usePlaylistUrl"
import { useQueryClient } from "@tanstack/react-query"
import { Fade } from "react-awesome-reveal"
import { useUserData } from "@/states/useUserData"
import { useLivePlaylist, useSeriesPlaylist, useVodPlaylist } from "@/states/usePlaylistData"
 
const formSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  url: z.string().url()
})

interface ProgressProps {
  msg: string
  value: number
}

export function Initial() {
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const { updateUrls } = usePlaylistUrl()

  const [formValue, setFormValue] = useState<PlaylistInfo>()
  const [submitted, setSubmitted] = useState(false)
  const [validated, setValidated] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [progress, setProgress] = useState<ProgressProps>({ msg: 'Loading...', value: 0})
  const { toast } = useToast()

  const resetUserData = useUserData(state => state.reset)
  const updateVodPlaylistState = useVodPlaylist(state => state.update)
  const updateSeriesPlaylistState = useSeriesPlaylist(state => state.update)
  const updateLivePlaylistState = useLivePlaylist(state => state.update)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitted(true)
    const value = { ...values, profiles: [] }
    setFormValue(value)
  }

  async function handleNewPLaylist(urls: PlaylistUrls) {
    setProgress({ msg: 'Downloading VOD playlist...', value: 20})
    const vodData = await electronApi.updateVod({ playlistUrl: urls.getAllVodUrl, categoriesUrl: urls.getAllVodCategoriesUrl, name: formValue!.name })

    setProgress({ msg: 'Downloading Series playlist...', value: 50})
    const seriesData = await electronApi.updateSeries({ playlistUrl: urls.getAllSeriesUrl, categoriesUrl: urls.getAllSeriesCategoriesUrl, name: formValue!.name })

    setProgress({ msg: 'Downloading Live playlist...', value: 80})
    const liveData = await electronApi.updateLive({ playlistUrl: urls.getAllLiveUrl, categoriesUrl: urls.getAllLiveCategoriesUrl, name: formValue!.name })

    setProgress({ msg: 'Updating configs...', value: 90})
    formValue!.updatedAt = Date.now()
    await electronApi.addPlaylistToMeta(formValue!)
    await electronApi.createProfile('Default')
    updateUrls(urls)

    updateVodPlaylistState(vodData)
    updateSeriesPlaylistState(seriesData)
    updateLivePlaylistState(liveData)
    resetUserData()

    setProgress({ msg: 'Finished.', value: 100})
    setIsSuccess(true)
  }

  async function validate() {
    const urls = makeUrls(formValue!)
    try {
      const isValidated = await electronApi.authenticateUser(urls.getAuthenticateUrl)
      if (isValidated) {
        setValidated(true)
        handleNewPLaylist(urls)
        return toast({
          title: 'Playlist added successfully.',
          description: 'Please wait while we are configuring your details, this may take a few seconds'
        })
      }
    } catch (error) {
      setSubmitted(false)
      toast({
        variant: "destructive",
        title: 'Playlist cannot be added.',
        description: 'Check if the data is correct and try again.'
      })
    }
  }

  
  useEffect(() => {
    if (submitted) validate()
  }, [submitted])
  

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    if (isSuccess) {
      queryClient.removeQueries()
      setSubmitted(false)
      document.body.style.overflow = 'auto';
      navigate(`/dashboard/home/${formValue!.name}`)
    }
    
  }, [isSuccess])

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <img className="w-full fixed blur-2xl -z-10" src='https://images.unsplash.com/flagged/photo-1567400358593-9e6382752ea2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />

      <Fade direction="up" duration={500}>
      <div className="flex items-center justify-center bg-background p-8 rounded-lg w-fit border">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Add a playlist</h1>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Playlist name</FormLabel>
                        <FormControl>
                          <Input placeholder="sample" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="sample" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Url</FormLabel>
                        <FormControl>
                          <Input placeholder="http://sample.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {submitted ? <Button disabled><ReloadIcon className="mr-2 h-4 w-4 animate-spin" />Loading playlist</Button> : <Button type="submit" className="w-full">Add</Button>}
                {validated && (
                  <>
                  <Progress className="transition" value={progress?.value} />
                  <Label className="animate-pulse">{progress.msg}</Label>
                  </>
                )}
                
              </div>
            </form>
          </Form>
        </div>
        
      </div>
      <div className="hidden bg-muted lg:block">
        <div className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"/>
      </div>
      </Fade>
    </div>
  )
}

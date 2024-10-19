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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitted(true)
    setFormValue(values)
  }

  async function handleNewPLaylist(urls: PlaylistUrls) {
    setProgress({ msg: 'Downloading VOD playlist...', value: 20})
    await electronApi.updateVod({ playlistUrl: urls.getAllVodUrl, categoriesUrl: urls.getAllVodCategoriesUrl, name: formValue!.name })

    setProgress({ msg: 'Downloading Series playlist...', value: 50})
    await electronApi.updateSeries({ playlistUrl: urls.getAllSeriesUrl, categoriesUrl: urls.getAllSeriesCategoriesUrl, name: formValue!.name })

    setProgress({ msg: 'Downloading Live playlist...', value: 80})
    await electronApi.updateLive({ playlistUrl: urls.getAllLiveUrl, categoriesUrl: urls.getAllLiveCategoriesUrl, name: formValue!.name })

    setProgress({ msg: 'Updating configs...', value: 90})
    await electronApi.addPlaylistToMeta(formValue!)
    updateUrls(urls)

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
    if (isSuccess) {
      queryClient.removeQueries()
      setSubmitted(false)
      navigate(`/dashboard/vod/${formValue!.name}`)
    }
    
  }, [isSuccess])

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] h-screen">
      <div className="flex items-center justify-center py-12 ">
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
    </div>
  )
}

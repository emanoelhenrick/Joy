import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useEffect, useState } from "react"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import electronApi from "@/config/electronApi"
import { PlaylistInfo } from "electron/core/models/PlaylistInfo"
import { makeUrls } from "@/states/usePlaylistUrl"
import { useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DialogContent } from "@/components/menubar/dialog"

const formSchema = z.object({
  name: z.string()
    .min(1)
    .trim()
    .regex(/^[A-Za-z0-9 ]*$/, {
    message: "Special characters are not allowed",
    }),
  username: z.string().min(1),
  password: z.string().min(1),
  url: z.string().url()
})

export function EditPlaylistDialog({ playlistInfo }: { playlistInfo: PlaylistInfo }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient()

  const [formValue, setFormValue] = useState<PlaylistInfo>()
  const [submitted, setSubmitted] = useState(false)
  const [validated, setValidated] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitted(true)
    setFormValue(values as PlaylistInfo)
  }

  async function validate() {
    const urls = makeUrls(formValue!)
    const authResponse = await electronApi.authenticateUser(urls.getAuthenticateUrl)
    if (authResponse.status) {
      if (!formValue) return
      await electronApi.editPlaylistInfo({ playlistName: playlistInfo.name, newPlaylistInfo: formValue })
      setValidated(true)
      return toast({
        title: 'Playlist edited successfully.'
      })
    }
    setSubmitted(false)
    toast({
      variant: "destructive",
      title: 'Playlist cannot be edited.',
      description: authResponse.message
    })
  }
  
  useEffect(() => {
    if (submitted) validate()
  }, [submitted])

  useEffect(() => {
    if (validated) {
      queryClient.removeQueries()
      setSubmitted(false)
      navigate(`/`)
    }
    
  }, [validated])


  return (
    <Dialog open={validated && submitted ? true : undefined}>
      <DialogTrigger asChild>
        <h3 className="scroll-m-20 w-fit text-muted-foreground tracking-tight cursor-pointer hover:text-primary transition">
          Edit playlist
        </h3>
      </DialogTrigger>
      <DialogContent className="w-fit bg-primary-foreground border-none" aria-describedby={undefined}>
        <DialogTitle className="hidden" />
        <div className="flex items-center justify-center rounded-lg w-fit">
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
                    defaultValue={playlistInfo && playlistInfo.name}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel>Playlist name</FormLabel> */}
                        <FormControl>
                          <Input className="border-none" placeholder="Playlist name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    defaultValue={playlistInfo && playlistInfo.username}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className="border-none" placeholder="Username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    defaultValue={playlistInfo && playlistInfo.password}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className="border-none" type="password" placeholder="Password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    defaultValue={playlistInfo && playlistInfo.url}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className="border-none" placeholder="http://sample.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {submitted ? <Button disabled><ReloadIcon className="mr-2 h-4 w-4 animate-spin" />Saving playlist</Button> : <Button type="submit" className="w-full">Save</Button>}
              </div>
            </form>
          </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
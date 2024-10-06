import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { addNewPLaylist } from "@/core/files/addNewPlaylist"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { PlaylistInfo } from "@/core/models/PlaylistInfo"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useNavigate } from "react-router-dom"
 
const formSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  url: z.string().url()
})


export function Initial() {
  const navigate = useNavigate();

  const [formValue, setFormValue] = useState<PlaylistInfo>()
  const [submited, setSubmited] = useState(false)
  const { isLoading, isSuccess } = useQuery({ queryKey: ['new-playlist'], queryFn: () => addNewPLaylist(formValue!), staleTime: Infinity, enabled: submited })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmited(true)
    setFormValue(values)
  }

  useEffect(() => {
    if (isSuccess) {
      navigate(`/home/${formValue!.name}`)
    }
    
  }, [isSuccess])

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Add a playlist</h1>
            {/* <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p> */}
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
                {isLoading ? <Button disabled><ReloadIcon className="mr-2 h-4 w-4 animate-spin" />Loading playlist</Button> : <Button type="submit" className="w-full">Add</Button>}
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

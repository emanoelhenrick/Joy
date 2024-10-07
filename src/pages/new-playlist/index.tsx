import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { addNewPLaylist } from "@/core/files/addNewPlaylist"
import { useEffect, useState } from "react"
import { PlaylistInfo } from "@/core/models/PlaylistInfo"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { authenticateUser } from "@/core/files/authenticateUser"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
 
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

  const [formValue, setFormValue] = useState<PlaylistInfo>()
  const [submited, setSubmited] = useState(false)
  const [validated, setValidated] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [progress, setProgress] = useState<ProgressProps>({ msg: 'Loading...', value: 0})
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmited(true)
    setFormValue(values)
  }

  async function handleNewPLaylist() {
    try {
      const generator = addNewPLaylist(formValue!);
      for await (const value of generator) setProgress(value)
      setIsSuccess(true)

    } catch (error) {
      
    }
    
  }

  async function validate() {
    try {
      const isValidated = await authenticateUser(formValue!)
      if (isValidated) {
        setValidated(true)
        handleNewPLaylist()
        return toast({
          title: 'Playlist added successfully.',
          description: 'Please wait while we are configuring your details, this may take a few seconds'
        })
      }
    } catch (error) {
      setSubmited(false)
      toast({
        variant: "destructive",
        title: 'Playlist cannot be added.',
        description: 'Check if the data is correct and try again.'
      })
    }
  }

  
  useEffect(() => {
    if (submited) validate()
  }, [submited])
  

  useEffect(() => {
    if (isSuccess) {
      setSubmited(false)
      navigate(`/vod-dashboard/${formValue!.name}`)
    }
    
  }, [isSuccess])

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] h-screen">
      <div className="flex items-center justify-center py-12 ">
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
                {submited ? <Button disabled><ReloadIcon className="mr-2 h-4 w-4 animate-spin" />Loading playlist</Button> : <Button type="submit" className="w-full">Add</Button>}
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

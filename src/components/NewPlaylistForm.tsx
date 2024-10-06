import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function NewPlaylistForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Add a new playlist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Playlist name</Label>
            <Input
              id="name"
              type="name"
              placeholder="name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Username</Label>
            <Input
              id="username"
              type="username"
              placeholder="username"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input id="password" type="password" required />
          </div>
          <div className="grid gap-2">
            <Label>Url</Label>
            <Input
              id="url"
              placeholder="http://sample.com:80"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

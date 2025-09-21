import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useUserData } from "@/states/useUserData";
import { CancelIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function ClearDataAlertDialog({ seriesId, refresh }: { seriesId: string, refresh: () => void }) {
  const userSeriesData = useUserData(state => state.userData.series?.find(s => s.id == seriesId))
  const removeSeriesStatus = useUserData(state => state.removeSeriesStatus)

  if (!userSeriesData) return <></>

  return (
    <AlertDialog onOpenChange={refresh}>
      <AlertDialogTrigger className="outline-none ring-none border-none items-center flex opacity-40 hover:opacity-90 transition duration-300 ease-in-out">
        <HugeiconsIcon strokeWidth={2} icon={CancelIcon} className="size-6" />
      </AlertDialogTrigger>
      <AlertDialogContent className="border-none bg-primary-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will erase all related data like where you stopped watching and favorite.
          </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-none shadow-none">Cancel</AlertDialogCancel>
          <AlertDialogAction className="border-none shadow-none" onClick={() => removeSeriesStatus(seriesId)}>Clear</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
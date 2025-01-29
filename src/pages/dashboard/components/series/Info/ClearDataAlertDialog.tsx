import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function ClearDataAlertDialog({ removeSeriesData, refresh }: { removeSeriesData: () => void, refresh: () => void }) {

  return (
    <AlertDialog onOpenChange={refresh}>
      <AlertDialogTrigger>
        <div className="text-primary/60 text-right hover:text-primary cursor-pointer transition mt-2">Clear data</div>
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
          <AlertDialogAction className="border-none shadow-none" onClick={removeSeriesData}>Clear</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
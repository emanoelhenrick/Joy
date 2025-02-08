import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Fade } from "react-awesome-reveal";
import { FaStar } from "react-icons/fa";

interface Props {
  cover: string
}


export function LoadingSkeleton({ cover }: Props) {

  return (
    <div className="w-full h-screen flex flex-col justify-end z-50">
      <section>
        <Fade>
          <img
            className={`w-full h-full object-cover fixed top-0 -z-20`}
            src={cover}
          />
        </Fade>
        <div className="inset-0 w-full h-full z-10 fixed bg-gradient-to-l from-transparent to-background/95" />
        <div className="inset-0 w-full h-full z-10 fixed bg-gradient-to-b from-transparent to-background/60" />
      </section>

      <div className="p-16 z-10 space-y-4">
        <div>
          <div className="max-w-96 h-fit">
            {/* TITLE */}
            <Skeleton />
          </div>

          <div className="flex items-center gap-4 mt-4">
            {/* YEAR */}
            <Skeleton />
          </div>
          
          <div className=" mt-2 flex flex-col gap-4">
            <div>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
            <Skeleton className="" />
            
            <Skeleton className="h-4 w-80" />
          </div>
        </div>         
        
        <div className="mt-2 flex flex-col gap-4 z-10">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Button key='vlc' disabled size={"lg"} className="bg-primary duration-100">Loading...</Button>
              <Button variant={'ghost'} disabled size={"lg"} className="flex gap-2 duration-100 items-center hover:bg-primary/10">
                <FaStar className="size-4" />
                <span className="leading-none text-base">Add to favorites</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
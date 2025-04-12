import { ScrollBarStyled } from "@/components/ScrollBarStyled";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRef } from "react";
import { PiArrowLeft, PiArrowRight } from "react-icons/pi"

export function UpdatedMediaContainer({ title, children }: { title: string, children: any }) {

  const scrollViewportRef = useRef<HTMLDivElement>(null);
    const scrollAmount = 600;
  
    const handleScrollRight = () => {
      if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTo({
          left: scrollViewportRef.current.scrollLeft + scrollAmount,
          behavior: "smooth"
        });
      }
    };
  
    const handleScrollLeft = () => {
      if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTo({
          left: scrollViewportRef.current.scrollLeft - scrollAmount,
          behavior: "smooth"
        });
      }
    };

  return (
    <div className="w-full p-5 rounded-2xl bg-primary-foreground">
      <div className='flex justify-between items-center mb-4'>
        <div className="flex gap-3 items-center">
          <h1 className="uppercase text-lg font-semibold">{title}</h1>
        </div>

        <div className="flex gap-6">
          <PiArrowLeft strokeWidth={8} className="size-5 cursor-pointer text-muted-foreground hover:text-primary transition" onClick={handleScrollLeft} />
          <PiArrowRight strokeWidth={8}  className="size-5 cursor-pointer text-muted-foreground hover:text-primary transition" onClick={handleScrollRight} />
        </div>
      </div>
      <ScrollArea ref={scrollViewportRef} className="w-full">
        <div  className="flex w-max space-x-4 rounded-md">
          {children}
        </div>
        <ScrollBarStyled orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
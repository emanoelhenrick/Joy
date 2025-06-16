import { ScrollBarStyled } from "@/components/ScrollBarStyled";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRef } from "react";
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

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
    <div className="w-full my-8 rounded-2xl space-y-4">
      <div className='flex gap-4 justify-between items-center'>
        <h1 className="text-lg font-medium">{title}</h1>

        <div className="flex gap-2 pr-6 opacity-60">
          <HugeiconsIcon icon={ArrowRight01Icon} className="rotate-180 size-6 cursor-pointer hover:opacity-80 text-primary transition" onClick={handleScrollLeft} />
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-6 cursor-pointer hover:opacity-80 text-primary transition" onClick={handleScrollRight} />
        </div>
      </div>
      <ScrollArea ref={scrollViewportRef} className="w-full">
        <div  className="flex w-max space-x-4 rounded-md">
          {children}
        </div>
        <div className="w-16 right-0 top-0 absolute h-full bg-gradient-to-r from-transparent to-background/95" />
        <ScrollBarStyled orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
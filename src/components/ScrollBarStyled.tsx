import { ScrollBar } from "./ui/scroll-area";

export function ScrollBarStyled({ orientation }: { orientation: 'vertical' | 'horizontal' }) {

  return (
    <div className="group pt-6 absolute bottom-0 w-full">
      <ScrollBar orientation={orientation} className="cursor-pointer opacity-0 group-hover:opacity-100"  />
    </div>
  )
}
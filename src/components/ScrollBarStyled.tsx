import { ScrollBar } from "./ui/scroll-area";

export function ScrollBarStyled({ orientation }: { orientation: 'vertical' | 'horizontal' }) {

  return (
    <ScrollBar orientation={orientation} className="cursor-pointer"  />
  )
}
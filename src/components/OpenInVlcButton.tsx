import { ToggleButton } from "@vidstack/react";
import { SiVlcmediaplayer } from "react-icons/si";

export function OpenInVlcButton({ launchVlc }: { launchVlc: () => void }) {


  return (
    <ToggleButton className="vds-button w-fit" onClick={launchVlc}>
      <div className="flex gap-3 items-center px-3">
        <SiVlcmediaplayer className="size-5" />
        <div className="leading-none">Open in VLC</div>
      </div>
    </ToggleButton>
  )
}
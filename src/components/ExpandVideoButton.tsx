import { ToggleButton } from '@vidstack/react';
import { ArrowCollapseInIcon, ArrowExpandOutIcon } from '@vidstack/react/icons';
import { useEffect, useState } from 'react';

export function ExpandVideoButton() {

  const [expand, setExpand] = useState(false)

  useEffect(() => {
    const player = document.querySelector('video')
    if (expand) {
      player!.style.objectFit = 'cover'
    } else {
      player!.style.objectFit = 'contain'
    }
  }, [expand])

  return (
    <ToggleButton className="vds-button" aria-label="expand">
      <ArrowExpandOutIcon onClick={() => setExpand(true)} className="not-pressed-icon vds-icon" />
      <ArrowCollapseInIcon onClick={() => setExpand(false)} className="pressed-icon vds-icon" />
    </ToggleButton>
  )
}
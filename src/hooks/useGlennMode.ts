'use client'

import { useEffect, useState } from 'react'

/* True while the Glenn gallery experience owns the page (homepage).
   The homepage sets `body.glenn-mode`; this hook subscribes to it so
   ambient providers (aurora background, cursor glow, music, flashes)
   can stand down instead of burning GPU behind the gallery. */
export function useIsGlennMode() {
  const [isGlenn, setIsGlenn] = useState(false)

  useEffect(() => {
    const check = () => setIsGlenn(document.body.classList.contains('glenn-mode'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  return isGlenn
}

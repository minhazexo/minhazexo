'use client'

import { useState } from 'react'
import { glennBlip, isGlennSoundOn, setGlennSoundOn } from '@/lib/glenn-sound'

/* Original minimal sound toggle, bottom-right. */
export function GlennSoundToggle() {
  const [on, setOn] = useState(() => isGlennSoundOn())

  const toggle = () => {
    const next = !on
    setOn(next)
    setGlennSoundOn(next)
    if (next) glennBlip(660, 0.08, 0.04)
  }

  return (
    <button
      type="button"
      className="glenn-sound"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Mute interface sounds' : 'Enable interface sounds'}
      title={on ? 'Sound on' : 'Sound off'}
    >
      {on ? 'ON' : 'OFF'}
    </button>
  )
}

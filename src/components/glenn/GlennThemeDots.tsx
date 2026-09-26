'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { themes } from '@/data/themes'
import { setThemeAutoCycle, isThemeAutoCycleEnabled, subscribeThemeAutoCycle } from '@/hooks/useThemeAutoCycle'
import { glennBlip } from '@/lib/glenn-sound'

/* Gallery-styled accent picker. The 15s show is always on by default; a
   manual pick holds the current theme for that visit (AUTO goes dim),
   and the AUTO pill resumes cycling on demand. */
export function GlennThemeDots() {
  const { theme, setTheme } = useTheme()
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    setAuto(isThemeAutoCycleEnabled())
    return subscribeThemeAutoCycle(setAuto)
  }, [])

  const pick = (value: string) => {
    setThemeAutoCycle(false)
    setTheme(value)
    glennBlip(700, 0.06, 0.03)
  }

  const toggleAuto = () => {
    setThemeAutoCycle(!auto)
    glennBlip(!auto ? 760 : 420, 0.07, 0.035)
  }

  return (
    <div className="glenn-themes" role="group" aria-label="Accent color">
      <span className="glenn-themes-label">Accent</span>
      <button
        type="button"
        className={`glenn-auto${auto ? ' is-active' : ''}`}
        onClick={toggleAuto}
        aria-label={auto ? 'Pause automatic theme cycling' : 'Resume automatic theme cycling'}
        aria-pressed={auto}
        title={auto ? 'Auto-cycle on (click to hold current theme)' : 'Auto-cycle off (click to resume every 15s)'}
      >
        Auto
      </button>
      {themes.map((t) => (
        <button
          key={t.value}
          type="button"
          className={`glenn-theme-dot${theme === t.value ? ' is-active' : ''}`}
          style={{ ['--dot' as string]: t.color }}
          onClick={() => pick(t.value)}
          aria-label={`${t.name} accent`}
          aria-pressed={theme === t.value}
          title={t.name}
        />
      ))}
    </div>
  )
}

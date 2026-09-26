'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { themes } from '@/data/themes'

const CYCLE_INTERVAL = 15000
const STORAGE_KEY = 'theme-auto-cycle'

type ThemeSetter = (theme: string) => void

const darkThemes = themes.filter((t) => t.value !== 'light')

/* Shared switch for the auto-cycle. The gallery accent picker calls
   setThemeAutoCycle(false) so a manual choice truly stops the 15s
   interval — writing localStorage alone never reached the live timer. */
let cycleOverride: boolean | null = null
const cycleListeners = new Set<(on: boolean) => void>()

export function setThemeAutoCycle(on: boolean) {
  cycleOverride = on
  try {
    localStorage.setItem(STORAGE_KEY, String(on))
  } catch {
    /* ignore */
  }
  cycleListeners.forEach((l) => l(on))
}

/* Live read of the switch (override → stored → default on). */
export function isThemeAutoCycleEnabled(): boolean {
  if (cycleOverride !== null) return cycleOverride
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'false'
  } catch {
    return true
  }
}

/* Subscribe to switch flips (same-tab picks, other tabs, resume pill). */
export function subscribeThemeAutoCycle(listener: (on: boolean) => void): () => void {
  cycleListeners.add(listener)
  return () => {
    cycleListeners.delete(listener)
  }
}

export function useThemeAutoCycle(setTheme: ThemeSetter) {
  const [isCycling, setIsCycling] = useState(true)
  const indexRef = useRef(0)
  const mountedRef = useRef(false)
  const wasCyclingRef = useRef(true)

  useEffect(() => {
    /* Always-on default: every visit starts cycling, clearing any stale
       'false' left by a previous session's manual pick. A dot pick still
       holds the current theme for that session (pill goes dim); the AUTO
       pill (or the next visit) resumes the show. */
    setThemeAutoCycle(true)

    /* next-themes owns the actual switch via the `data-theme` attribute —
       read that (not classList) so we never desync or fight it. */
    const current = document.documentElement.getAttribute('data-theme')
    if (current) {
      const idx = darkThemes.findIndex((t) => t.value === current)
      if (idx >= 0) indexRef.current = idx
    }

    const onExternalChange = (on: boolean) => setIsCycling(on)
    const unsubscribe = subscribeThemeAutoCycle(onExternalChange)
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setIsCycling(e.newValue !== 'false')
    }
    window.addEventListener('storage', onStorage)
    return () => {
      unsubscribe()
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  useEffect(() => {
    /* Persist on change only — never on mount. The initial state (true)
       must not clobber a stored 'false' before the init effect above has
       a chance to apply it (fatal under StrictMode double-effects). */
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }
    try {
      localStorage.setItem(STORAGE_KEY, String(isCycling))
    } catch {
      /* ignore */
    }
  }, [isCycling])

  useEffect(() => {
    if (!isCycling) {
      wasCyclingRef.current = false
      return
    }
    if (!wasCyclingRef.current) {
      /* Just resumed (Auto pill): continue FROM the visible theme so the
         next tick always moves somewhere new instead of re-landing on the
         manually picked theme and looking stuck for another 15s. */
      wasCyclingRef.current = true
      const current = document.documentElement.getAttribute('data-theme')
      if (current) {
        const idx = darkThemes.findIndex((t) => t.value === current)
        if (idx >= 0) indexRef.current = idx
      }
    }

    const id = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % darkThemes.length
      const next = darkThemes[indexRef.current].value
      /* Single owner: next-themes applies `data-theme` + persists it.
         (Previously this also poked classList + a second storage key,
         which desynced the theme after reload.) */
      setTheme(next)
    }, CYCLE_INTERVAL)

    return () => clearInterval(id)
  }, [isCycling, setTheme])

  const toggle = useCallback(() => setIsCycling((prev) => !prev), [])

  return { isCycling, toggle }
}

'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'aurora-mode'
const EVENT_NAME = 'aurora-mode-change'

function getInitialMode(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) return stored !== 'light'
  } catch {}
  const attr = document.documentElement.getAttribute('data-mode')
  return attr !== 'light'
}

function applyMode(isDark: boolean) {
  const mode = isDark ? 'dark' : 'light'
  document.documentElement.setAttribute('data-mode', mode)
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {}
}

type Listener = (isDark: boolean) => void
const listeners = new Set<Listener>()

function broadcast(isDark: boolean) {
  listeners.forEach((fn) => fn(isDark))
}

export function useDarkMode() {
  const [isDark, setIsDarkState] = useState(true)

  useEffect(() => {
    setIsDarkState(getInitialMode())
  }, [])

  useEffect(() => {
    const listener: Listener = (val) => setIsDarkState(val)
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  }, [])

  const toggle = useCallback(() => {
    setIsDarkState((prev) => {
      const next = !prev
      applyMode(next)
      broadcast(next)
      return next
    })
  }, [])

  return { isDark, toggle }
}

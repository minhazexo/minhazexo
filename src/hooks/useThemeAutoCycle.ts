'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { themes } from '@/data/themes'

const CYCLE_INTERVAL = 15000
const STORAGE_KEY = 'theme-auto-cycle'

type ThemeSetter = (theme: string) => void

const themeValues = themes.map((t) => t.value)
const darkThemes = themes.filter((t) => t.value !== 'light')

function applyTheme(themeValue: string) {
  const html = document.documentElement
  themeValues.forEach((t) => html.classList.remove(t))
  html.classList.add(themeValue)
  try { localStorage.setItem('theme', themeValue) } catch {}
}

export function useThemeAutoCycle(setTheme: ThemeSetter) {
  const [isCycling, setIsCycling] = useState(true)
  const indexRef = useRef(0)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'false') {
      setIsCycling(false)
    } else if (saved === 'true') {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setIsCycling(true)
      }
    }

    const current = themes.find((t) => document.documentElement.classList.contains(t.value))
    if (current) {
      if (current.value === 'light') {
        indexRef.current = 0
      } else {
        const idx = darkThemes.findIndex((t) => t.value === current.value)
        if (idx >= 0) indexRef.current = idx
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isCycling))
  }, [isCycling])

  useEffect(() => {
    if (!isCycling) return

    const id = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % darkThemes.length
      const next = darkThemes[indexRef.current].value
      applyTheme(next)
      setTheme(next)
    }, CYCLE_INTERVAL)

    return () => clearInterval(id)
  }, [isCycling, setTheme])

  const toggle = useCallback(() => setIsCycling((prev) => !prev), [])

  return { isCycling, toggle }
}

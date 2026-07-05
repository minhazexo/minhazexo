'use client'

import { useTheme } from 'next-themes'
import { useThemeAutoCycle } from '@/hooks/useThemeAutoCycle'

export function ThemeAutoCycle() {
  const { setTheme } = useTheme()
  useThemeAutoCycle(setTheme)
  return null
}

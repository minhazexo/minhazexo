'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from '@/types'
import { themes } from '@/data/themes'

const themeValues = themes.map((t) => t.value)

export function ThemeProvider({ 
  children, 
  attribute = 'class',
  defaultTheme = 'dark',
  enableSystem = false
}: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      themes={themeValues}
    >
      {children}
    </NextThemesProvider>
  )
}

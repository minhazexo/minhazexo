'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
}

export function ThemeProvider({
  children,
  attribute = 'data-theme',
  defaultTheme = 'blue',
  enableSystem = false,
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      storageKey="aurora-theme"
    >
      {children}
    </NextThemesProvider>
  )
}

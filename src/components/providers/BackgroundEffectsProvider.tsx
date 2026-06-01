'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/utils'

interface BackgroundEffectContextType {
  backgroundEffect: string
  setBackgroundEffect: (effect: string) => void
  secondaryEffect: string
  setSecondaryEffect: (effect: string) => void
}

const BackgroundEffectContext = createContext<BackgroundEffectContextType | undefined>(undefined)

export function BackgroundEffectsProvider({ children }: { children: ReactNode }) {
  const [backgroundEffect, setBackgroundEffectState] = useState('particles')
  const [secondaryEffect, setSecondaryEffectState] = useState('none')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = getLocalStorageItem('background-effect')
    const savedSecondary = getLocalStorageItem('secondary-effect')
    if (saved) setBackgroundEffectState(saved)
    if (savedSecondary) setSecondaryEffectState(savedSecondary)
  }, [])

  const setBackgroundEffect = (effect: string) => {
    setBackgroundEffectState(effect)
    if (mounted) {
      setLocalStorageItem('background-effect', effect)
    }
  }

  const setSecondaryEffect = (effect: string) => {
    setSecondaryEffectState(effect)
    if (mounted) {
      setLocalStorageItem('secondary-effect', effect)
    }
  }

  return (
    <BackgroundEffectContext.Provider value={{ 
      backgroundEffect, 
      setBackgroundEffect,
      secondaryEffect,
      setSecondaryEffect 
    }}>
      {children}
    </BackgroundEffectContext.Provider>
  )
}

export function useBackgroundEffect() {
  const context = useContext(BackgroundEffectContext)
  if (context === undefined) {
    throw new Error('useBackgroundEffect must be used within a BackgroundEffectsProvider')
  }
  return context
}
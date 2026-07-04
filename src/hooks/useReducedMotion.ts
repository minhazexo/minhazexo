'use client'

import { useState, useEffect } from 'react'

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}

export function useLowPerfDevice(): boolean {
  const [isLowPerf, setIsLowPerf] = useState(false)

  useEffect(() => {
    const check = () => {
      const isMobile = window.innerWidth < 768
      const hasLowMemory = 'deviceMemory' in navigator && (navigator as any).deviceMemory < 4
      const hasLowCores = 'hardwareConcurrency' in navigator && navigator.hardwareConcurrency < 4
      setIsLowPerf(isMobile || hasLowMemory || hasLowCores)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isLowPerf
}

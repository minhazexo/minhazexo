'use client'

import { useState, useEffect } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function getBlurRadius(): number {
  if (typeof window === 'undefined') return 100
  return window.innerWidth < 640 ? 50 : window.innerWidth < 1024 ? 70 : 100
}

export function GlowLayer() {
  const prefersReduced = useReducedMotion()
  const [blur, setBlur] = useState(100)

  useEffect(() => {
    const update = () => setBlur(getBlurRadius())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: 'min(1000px, 100vw)',
        height: 'min(1000px, 100vw)',
        maxWidth: '100vw',
        maxHeight: '100vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle at center, rgba(var(--theme-rgb), 0.30) 0%, rgba(var(--theme-rgb), 0.18) 20%, rgba(var(--theme-rgb), 0.08) 45%, transparent 70%)',
        filter: `blur(${blur}px)`,
        opacity: 0.8,
        animation: prefersReduced ? 'none' : 'glow-pulse 12s ease-in-out infinite',
        willChange: 'transform, opacity',
      }}
      aria-hidden="true"
    />
  )
}

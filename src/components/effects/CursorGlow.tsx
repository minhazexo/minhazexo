'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { themes } from '@/data/themes'
import { useIsGlennMode } from '@/hooks/useGlennMode'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const { theme } = useTheme()
  const isGlenn = useIsGlennMode()
  const prefersReduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = themes.find(t => t.value === theme)
  const glowColor = currentTheme?.color || '#00E5FF'

  const animate = useCallback(() => {
    const target = mouseRef.current
    const current = currentRef.current

    current.x += (target.x - current.x) * 0.06
    current.y += (target.y - current.y) * 0.06

    if (glowRef.current) {
      glowRef.current.style.transform = `translate(${current.x - 110}px, ${current.y - 110}px)`
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    /* Gallery has its own cursor follower (hover preview) — running a
       second rAF loop behind it is pure waste. */
    if (isGlenn || prefersReduced) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [animate, isGlenn, prefersReduced])

  /* Never paint behind the gallery, and never sit at z -1 (invisible
     behind the page background). Not mounted on the server either: the
     glow color derives from the client theme, so SSR would hydrate with
     a mismatched gradient. */
  if (isGlenn || !mounted) return null

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none"
      style={{
        width: '220px',
        height: '220px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${glowColor}14 0%, ${glowColor}08 30%, transparent 70%)`,
        mixBlendMode: 'screen',
        filter: 'blur(40px)',
        transform: 'translate(-9999px, -9999px)',
        willChange: 'transform',
        zIndex: 3,
        transition: 'background 0.5s ease',
      }}
      aria-hidden="true"
    />
  )
}

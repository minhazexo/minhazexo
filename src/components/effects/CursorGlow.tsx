'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { themes } from '@/data/themes'

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const { theme } = useTheme()

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
  }, [animate])

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
        zIndex: -1,
        transition: 'background 0.5s ease',
      }}
      aria-hidden="true"
    />
  )
}

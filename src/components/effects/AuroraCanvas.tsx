'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const THEME_PALETTES: Record<string, { hue1: number; hue2: number; hue3: number }> = {
  blue: { hue1: 190, hue2: 210, hue3: 260 },
  green: { hue1: 150, hue2: 170, hue3: 130 },
  orange: { hue1: 25, hue2: 15, hue3: 40 },
  pink: { hue1: 320, hue2: 340, hue3: 310 },
  purple: { hue1: 270, hue2: 240, hue3: 300 },
  cyan: { hue1: 180, hue2: 200, hue3: 160 },
  amber: { hue1: 45, hue2: 35, hue3: 20 },
  silver: { hue1: 210, hue2: 220, hue3: 200 },
}

export function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    x: 0, y: 0, vx: 0.3, vy: 0.15,
    hue1: 185, hue2: 220, hue3: 260,
  })
  const frameRef = useRef<number>(0)
  const { theme } = useTheme()
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight
    canvas.width = w
    canvas.height = h

    const state = stateRef.current

    const speedFactor = reducedMotion ? 0.2 : 1
    const movementFactor = reducedMotion ? 0.2 : 1

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      state.x += state.vx * speedFactor
      state.y += state.vy * speedFactor
      if (state.x > 100 || state.x < -100) state.vx *= -1
      if (state.y > 60 || state.y < -60) state.vy *= -1

      state.hue1 += 0.04 * speedFactor
      state.hue2 += 0.03 * speedFactor
      state.hue3 += 0.05 * speedFactor

      for (let i = 0; i < 5; i++) {
        const t = Date.now() * 0.00025 * speedFactor + i * 1.5
        const baseX = w / 2 + Math.sin(t * 0.6) * w * 0.32 * movementFactor + state.x * movementFactor
        const baseY = h * 0.35 + Math.sin(t * 0.4 + i) * h * 0.12 * movementFactor + state.y * movementFactor
        const radiusX = w * (0.28 + Math.sin(t * 0.35 + i * 0.5) * 0.12 * movementFactor)
        const radiusY = h * (0.04 + Math.sin(t * 0.5 + i * 0.3) * 0.025 * movementFactor)

        const hues = [state.hue1, state.hue2, state.hue3]
        const hue = (hues[i % 3] + i * 35 + Math.sin(t * 0.2) * 15) % 360
        const hueTo = (hues[(i + 1) % 3] + i * 25 + Math.cos(t * 0.25) * 12) % 360

        const gradient = ctx.createRadialGradient(
          baseX, baseY, 0,
          baseX, baseY, Math.max(radiusX, radiusY) * 1.6
        )

        const opacity = 0.08 + (i * 0.02)
        gradient.addColorStop(0, `hsla(${hue}, 75%, 55%, ${opacity})`)
        gradient.addColorStop(0.3, `hsla(${hueTo}, 65%, 50%, ${opacity * 0.5})`)
        gradient.addColorStop(0.6, `hsla(${(hue + hueTo) / 2}, 55%, 45%, ${opacity * 0.2})`)
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.ellipse(baseX, baseY, radiusX, radiusY, Math.sin(t * 0.25 + i) * 0.25, 0, Math.PI * 2)
        ctx.fill()
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    const handleResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
    }

    window.addEventListener('resize', handleResize)
    draw()

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [theme, reducedMotion])

  useEffect(() => {
    const palette = THEME_PALETTES[theme ?? 'blue'] || THEME_PALETTES.blue
    stateRef.current.hue1 = palette.hue1
    stateRef.current.hue2 = palette.hue2
    stateRef.current.hue3 = palette.hue3
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  )
}

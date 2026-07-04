'use client'

import React, { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

const THEME_COLORS: Record<string, string> = {
  blue: '#2ED0FF',
  green: '#00FF99',
  orange: '#FF8A00',
  purple: '#A855F7',
  cyan: '#2ED0FF',
  pink: '#FF4FCB',
  amber: '#FFC300',
  silver: '#C5C5C5',
}

function hexToRgba(hex: string, a = 1) {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  baseA: number
  phase: number
}

export default function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const color = THEME_COLORS[theme ?? 'blue'] ?? '#2ED0FF'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0
    let particles: Particle[] = []

    function resize() {
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      canvas!.width = Math.round(canvas!.clientWidth * dpr)
      canvas!.height = Math.round(canvas!.clientHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initParticles()
    }

    function initParticles() {
      const area = canvas!.clientWidth * canvas!.clientHeight
      const count = Math.min(180, Math.max(40, Math.round(area / 9000)))
      particles = new Array(count).fill(0).map(() => ({
        x: Math.random() * canvas!.clientWidth,
        y: Math.random() * canvas!.clientHeight,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        r: Math.random() * 1.6 + 0.3,
        baseA: Math.random() * 0.7 + 0.15,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    function step() {
      raf = requestAnimationFrame(step)
      ctx.clearRect(0, 0, canvas!.width, canvas!.height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.phase += 0.02
        const alpha = Math.abs(Math.sin(p.phase)) * p.baseA

        // wrap
        if (p.x < -10) p.x = canvas!.width + 10
        if (p.x > canvas!.width + 10) p.x = -10
        if (p.y < -10) p.y = canvas!.height + 10
        if (p.y > canvas!.height + 10) p.y = -10

        ctx.beginPath()
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6)
        g.addColorStop(0, hexToRgba(color, alpha * 0.9))
        g.addColorStop(0.6, hexToRgba(color, alpha * 0.25))
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fillRect(p.x - p.r * 6, p.y - p.r * 6, p.r * 12, p.r * 12)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(step)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [theme, color])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -4, width: '100%', height: '100%' }}
      aria-hidden
    />
  )
}
'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { hexToRgb } from '@/lib/utils'
import { themes } from '@/data/themes'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  baseOpacity: number
  fadeSpeed: number
}

export function FloatingParticles({ count }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const { theme } = useTheme()
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const speedFactor = reducedMotion ? 0.2 : 1
    const calculated = reducedMotion
      ? Math.min(Math.floor((canvas.width * canvas.height) / 120000), 30)
      : Math.min(Math.floor((canvas.width * canvas.height) / 15000), 150)
    const particleCount = count ?? Math.max(calculated, 80)

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.2 * speedFactor,
      speedY: (Math.random() - 0.5) * 0.2 * speedFactor,
      opacity: Math.random() * 0.15,
      baseOpacity: Math.random() * 0.15,
      fadeSpeed: 0.002 + Math.random() * 0.005,
    }))

    let mouseX = -9999
    let mouseY = -9999
    const handleMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const currentTheme = themes.find(t => t.value === theme) || themes[0]
    const rgb = hexToRgb(currentTheme.color)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const particles = particlesRef.current

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 200 && !reducedMotion) {
          const force = (200 - dist) / 200 * 0.02
          p.x -= dx * force
          p.y -= dy * force
        }

        p.x += p.speedX
        p.y += p.speedY

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        p.opacity = p.baseOpacity + Math.sin(Date.now() * p.fadeSpeed + i) * 0.05

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        if (rgb) {
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.max(0, p.opacity)})`
        } else {
          ctx.fillStyle = `rgba(148, 163, 184, ${Math.max(0, p.opacity)})`
        }
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [reducedMotion, theme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { getCssVarRgba } from '@/lib/utils'

interface WaveFlowFieldProps {
  speed?: number
  density?: number
}

export default function WaveFlowField({ speed = 1, density = 50 }: WaveFlowFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resizeCanvas()

    const isMobile = window.innerWidth < 768
    let time = 0
    const waves: Array<{
      amplitude: number
      frequency: number
      phase: number
      speed: number
      y: number
      color: string
      strokeColor: string
    }> = []

    const waveCount = isMobile ? 2 : 3
    const fillColors = [
      getCssVarRgba('--primary', 0.1, '#00D4FF'),
      getCssVarRgba('--secondary', 0.08, '#FF00FF'),
      getCssVarRgba('--accent', 0.06, '#00FF88'),
      getCssVarRgba('--accent-violet', 0.08, '#8B5CF6'),
      getCssVarRgba('--accent-amber', 0.05, '#FFB800'),
    ]

    for (let i = 0; i < waveCount; i++) {
      const fillColor = fillColors[i % fillColors.length]
      const strokeColor = fillColor.replace(/[\d.]+\)$/, '0.3)')
      waves.push({
        amplitude: (isMobile ? 18 : 30) + Math.random() * (isMobile ? 30 : 50),
        frequency: 0.01 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
        speed: (0.5 + Math.random() * 0.5) * speed,
        y: canvas.height * (0.3 + (i / waveCount) * 0.5),
        color: fillColor,
        strokeColor,
      })
    }

    const draw = () => {
      time += 0.02 * speed
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      waves.forEach((wave) => {
        ctx.beginPath()
        ctx.moveTo(0, wave.y)

        for (let x = 0; x < canvas.width; x++) {
          const y = wave.y + Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude
          ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()

        ctx.fillStyle = wave.color
        ctx.fill()

        ctx.beginPath()
        for (let x = 0; x < canvas.width; x++) {
          const y = wave.y + Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.strokeStyle = wave.strokeColor
        ctx.lineWidth = isMobile ? 1.5 : 2
        ctx.stroke()
      })

      animationRef.current = requestAnimationFrame(draw)
    }

    const handleVisibility = () => {
      if (document.hidden) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = undefined
        }
      } else if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(draw)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    draw()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      document.removeEventListener('visibilitychange', handleVisibility)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [speed, density])

  return (
    <motion.div
      className="absolute inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #0A0A1A 0%, #0A0A0F 100%)' }}
      />
    </motion.div>
  )
}
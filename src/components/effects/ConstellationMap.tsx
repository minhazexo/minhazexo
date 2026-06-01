'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Star {
  x: number
  y: number
  size: number
  brightness: number
  connections: number[]
}

interface ConstellationMapProps {
  starCount?: number
  connectionDistance?: number
  speed?: number
}

export default function ConstellationMap({ 
  starCount = 40, 
  connectionDistance = 100,
  speed = 1 
}: ConstellationMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()

    starsRef.current = Array.from({ length: starCount }, () => {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      return {
        x,
        y,
        size: Math.random() * 2 + 1,
        brightness: Math.random() * 0.5 + 0.5,
        connections: []
      }
    })

    starsRef.current.forEach((star, i) => {
      starsRef.current.forEach((other, j) => {
        if (i !== j) {
          const dx = star.x - other.x
          const dy = star.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < connectionDistance) {
            star.connections.push(j)
          }
        }
      })
    })

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true }
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    let time = 0

    const animate = () => {
      time += 0.01 * speed
      ctx.fillStyle = 'rgba(10, 10, 26, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      starsRef.current.forEach((star, i) => {
        const pulse = 0.5 + 0.5 * Math.sin(time * 2 + i * 0.1)
        
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * pulse, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139, 92, 246, ${star.brightness * pulse})`
        ctx.fill()

        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - star.x
          const dy = mouseRef.current.y - star.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx.beginPath()
            ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(0, 212, 255, ${0.5 * (1 - dist / 150)})`
            ctx.fill()

            star.connections.forEach((connIndex) => {
              const other = starsRef.current[connIndex]
              const connectionPulse = 0.3 + 0.2 * Math.sin(time * 3 + i * 0.1)
              ctx.beginPath()
              ctx.moveTo(star.x, star.y)
              ctx.lineTo(other.x, other.y)
              ctx.strokeStyle = `rgba(0, 212, 255, ${connectionPulse * (1 - dist / 150)})`
              ctx.lineWidth = 1
              ctx.stroke()
            })
          }
        } else {
          star.connections.forEach((connIndex) => {
            const other = starsRef.current[connIndex]
            const connectionPulse = 0.1 + 0.1 * Math.sin(time * 2 + i * 0.05)
            ctx.beginPath()
            ctx.moveTo(star.x, star.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${connectionPulse})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          })
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [starCount, connectionDistance, speed])

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
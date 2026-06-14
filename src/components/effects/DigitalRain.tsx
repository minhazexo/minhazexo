'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { getCssVar } from '@/lib/utils'

interface DigitalRainProps {
  speed?: number
  density?: number
  color?: string
}

export default function DigitalRain({ 
  speed = 1, 
  density = 20,
  color 
}: DigitalRainProps) {
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
    const columnWidth = isMobile ? Math.max(15, 40 - density) : Math.max(10, 40 - density)
    const columns = Math.floor(canvas.width / columnWidth)
    const columnHeight = new Array(columns).fill(0)
    
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]()/\\=;:+-*&|!?%$#@'
    const charArray = chars.split('')
    
    const themePrimary = getCssVar('--primary', '#00D4FF')
    const themeSecondary = getCssVar('--accent', '#00FF88')
    const primaryColor = color || themePrimary
    const secondaryColor = color ? `${color}aa` : themeSecondary

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 26, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < columnHeight.length; i++) {
        if (Math.random() < 0.02 * speed || columnHeight[i] === 0) {
          const char = charArray[Math.floor(Math.random() * charArray.length)]
          const x = i * columnWidth + columnWidth / 2
          const y = columnHeight[i] * columnWidth

          const gradient = ctx.createLinearGradient(x, y - columnWidth * 5, x, y)
          gradient.addColorStop(0, secondaryColor)
          gradient.addColorStop(1, primaryColor)

          ctx.fillStyle = gradient
          ctx.font = `${isMobile ? 14 : 16}px "JetBrains Mono", monospace`
          ctx.fillText(char, x, y)

          columnHeight[i]++
          
          if (y > canvas.height && Math.random() > 0.975) {
            columnHeight[i] = 0
          }
        }

        if (columnHeight[i] > 0 && Math.random() > 0.95) {
          const fadeY = (columnHeight[i] - Math.floor(Math.random() * 10)) * columnWidth
          const x = i * columnWidth + columnWidth / 2
          const fadeOpacity = Math.max(0, 1 - (columnHeight[i] * columnWidth - fadeY) / 200)
          ctx.fillStyle = `rgba(0, 255, 136, ${fadeOpacity * 0.3})`
          ctx.font = `${isMobile ? 12 : 14}px "JetBrains Mono", monospace`
          ctx.fillText(charArray[Math.floor(Math.random() * charArray.length)], x, fadeY)
        }
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    let interval: ReturnType<typeof setInterval> | undefined

    const handleVisibility = () => {
      if (document.hidden) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = undefined
        }
        if (interval !== undefined) {
          clearInterval(interval)
          interval = undefined
        }
      } else {
        if (!interval) {
          interval = setInterval(() => {
            for (let i = 0; i < columnHeight.length; i++) {
              if (Math.random() < 0.01 * speed) {
                columnHeight[i] = 0
              }
            }
          }, 100)
        }
        if (!animationRef.current) {
          animationRef.current = requestAnimationFrame(draw)
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    interval = setInterval(() => {
      for (let i = 0; i < columnHeight.length; i++) {
        if (Math.random() < 0.01 * speed) {
          columnHeight[i] = 0
        }
      }
    }, 100)
    draw()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      document.removeEventListener('visibilitychange', handleVisibility)
      if (interval !== undefined) clearInterval(interval)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [speed, density, color])

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
        style={{ background: 'linear-gradient(180deg, #0A0A1A 0%, #050510 100%)' }}
      />
    </motion.div>
  )
}
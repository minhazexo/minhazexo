'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cinematicEase } from '@/hooks/useCinematicReveal'

interface TypingEffectProps {
  lines: string[]
  speed?: number
  className?: string
}

export function TypingEffect({ lines, speed = 55, className = '' }: TypingEffectProps) {
  const [displayText, setDisplayText] = useState('')
  const [cursorDone, setCursorDone] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      setDisplayText(lines[lines.length - 1] || '')
      setCursorDone(true)
      return
    }

    if (lines.length === 0) return

    let lineIndex = 0
    let charIndex = 0
    let isErasing = false
    let timer: ReturnType<typeof setTimeout>

    const tick = () => {
      const currentLine = lines[lineIndex]
      const isLastLine = lineIndex === lines.length - 1

      if (!isErasing) {
        if (charIndex < currentLine.length) {
          charIndex++
          setDisplayText(currentLine.slice(0, charIndex))
          timer = setTimeout(tick, speed)
        } else {
          if (isLastLine) {
            setCursorDone(true)
            return
          }
          isErasing = true
          timer = setTimeout(tick, 2000)
        }
      } else {
        if (charIndex > 0) {
          charIndex--
          setDisplayText(currentLine.slice(0, charIndex))
          timer = setTimeout(tick, speed * 0.6)
        } else {
          lineIndex++
          isErasing = false
          timer = setTimeout(tick, speed * 0.5)
        }
      }
    }

    timer = setTimeout(tick, 500)

    return () => clearTimeout(timer)
  }, [lines, speed, reducedMotion])

  return (
    <div className={className}>
      <p
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Typing effect: ${displayText}`}
      >
        {displayText}
        <motion.span
          className="inline-block w-0.5 h-6 bg-[var(--primary)] ml-1 align-text-bottom"
          aria-hidden="true"
          animate={cursorDone ? { opacity: 0 } : { opacity: [1, 0, 1] }}
          transition={
            cursorDone
              ? { duration: 0.4, ease: cinematicEase }
              : { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
          }
        />
      </p>
    </div>
  )
}

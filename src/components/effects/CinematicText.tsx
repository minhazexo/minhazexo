'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cinematicEase } from '@/hooks/useCinematicReveal'

interface CinematicTextProps {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  className?: string
  delay?: number
  staggerAmount?: number
  type?: 'characters' | 'words' | 'lines'
}

/**
 * Staggered character/word reveal animation - cinematic text entrance
 * Each character/word animates in sequentially with a elegant stagger
 */
export function CinematicText({
  children,
  as: Tag = 'h1',
  className = '',
  delay = 0,
  staggerAmount = 0.04,
  type = 'characters',
}: CinematicTextProps) {
  // Split text based on type
  const items = type === 'words' 
    ? children.split(' ')
    : type === 'characters'
      ? children.split('')
      : children.split('\n')

  // For characters, we wrap each in a span
  if (type === 'characters') {
    return (
      <Tag className={className} aria-label={children}>
        {items.map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, y: 40, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
              duration: 0.6,
              ease: cinematicEase,
              delay: delay + i * staggerAmount,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </Tag>
    )
  }

  // For words or lines
  return (
    <Tag className={className} aria-label={children}>
      {items.map((item, i) => (
        <motion.span
          key={i}
          className={`inline-block ${type === 'words' ? 'mr-[0.25em]' : 'block'}`}
          initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.7,
            ease: cinematicEase,
            delay: delay + i * (type === 'words' ? 0.08 : 0.12),
          }}
        >
          {item}
        </motion.span>
      ))}
    </Tag>
  )
}

/**
 * Slide-up text reveal with a gradient mask sweep effect
 */
export function RevealText({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}) {
  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  }

  const dir = directionMap[direction]

  return (
    <div className="overflow-hidden">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: dir.y, x: dir.x }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{
          duration: 0.8,
          ease: cinematicEase,
          delay,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
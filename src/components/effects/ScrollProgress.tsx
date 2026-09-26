'use client'

import { useState } from 'react'
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const prefersReduced = useReducedMotion()
  const [pct, setPct] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setPct(Math.round(v * 100)))
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const gradientBackground = `linear-gradient(90deg, var(--primary) 0%, var(--primary-secondary) 25%, var(--primary-accent) 50%, var(--primary-secondary) 75%, var(--primary) 100%)`

  /* z 60: above content, below the entry gate (100) and the project
     modal (100) so bars never draw over dialogs. */
  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
        style={{
          scaleX,
          background: gradientBackground,
          willChange: 'transform',
        }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      >
        {!prefersReduced && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              willChange: 'transform',
            }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </motion.div>

      <motion.div
        className="fixed top-[3px] left-0 right-0 h-[8px] z-[59] origin-left opacity-40 pointer-events-none"
        style={{
          scaleX,
          background: gradientBackground,
          filter: 'blur(6px)',
          willChange: 'transform',
        }}
      />

      <motion.div
        className="fixed top-[1px] left-0 right-0 h-[1px] z-[60] origin-left pointer-events-none"
        style={{
          scaleX,
          background: 'white',
          opacity: 0.6,
          willChange: 'opacity',
        }}
      />
    </>
  )
}

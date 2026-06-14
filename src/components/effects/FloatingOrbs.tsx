'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { getCssVarRgba } from '@/lib/utils'

interface FloatingOrbsProps {
  count?: number
  speed?: number
}

export default function FloatingOrbs({ count = 5, speed = 1 }: FloatingOrbsProps) {
  const [themeColors] = useState<string[]>(() => [
    getCssVarRgba('--primary', 0.15, '#00D4FF'),
    getCssVarRgba('--secondary', 0.12, '#FF00FF'),
    getCssVarRgba('--accent', 0.1, '#00FF88'),
    getCssVarRgba('--accent-violet', 0.1, '#8B5CF6'),
    getCssVarRgba('--accent-amber', 0.08, '#FFB800'),
  ])

  const orbs = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      size: Math.floor(Math.random() * 200) + 100,
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
      duration: Math.floor(Math.random() * 10) + 15,
      delay: Math.random() * -15,
      color: themeColors[i % themeColors.length],
    })),
  [count, themeColors])

  return (
    <motion.div
      className="floating-orbs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="orb"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            background: orb.color,
            animationDuration: `${orb.duration / speed}s`,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}
    </motion.div>
  )
}
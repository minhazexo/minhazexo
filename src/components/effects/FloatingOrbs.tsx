'use client'

import { motion } from 'framer-motion'

interface FloatingOrbsProps {
  count?: number
  speed?: number
}

export default function FloatingOrbs({ count = 5, speed = 1 }: FloatingOrbsProps) {
  const orbs = Array.from({ length: count }, (_, i) => ({
    size: Math.floor(Math.random() * 200) + 100,
    top: `${Math.random() * 80 + 10}%`,
    left: `${Math.random() * 80 + 10}%`,
    duration: Math.floor(Math.random() * 10) + 15,
    delay: Math.random() * -15,
    color: ['rgba(0, 212, 255, 0.15)', 'rgba(255, 0, 170, 0.12)', 'rgba(0, 255, 136, 0.1)', 'rgba(139, 92, 246, 0.1)', 'rgba(255, 184, 0, 0.08)'][i % 5],
  }))

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
'use client'

import { motion } from 'framer-motion'

interface RetroGridProps {
  speed?: number
  color?: string
  gridSize?: number
}

export default function RetroGrid({ speed = 1, color, gridSize = 40 }: RetroGridProps) {
  const primaryColor = color || 'var(--primary, #00D4FF)'
  const secondaryColor = color ? `${color}80` : 'rgba(255, 0, 170, 0.5)'

  return (
    <motion.div
      className="absolute inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div 
        className="retro-grid"
        style={{
          '--grid-speed': `${3 / speed}s`,
          '--grid-size': `${gridSize}px`,
          '--grid-color': primaryColor,
          '--grid-color-secondary': secondaryColor,
        } as React.CSSProperties}
      />
      <div className="retro-grid-glow" />
      <div className="retro-horizon-glow" />
    </motion.div>
  )
}
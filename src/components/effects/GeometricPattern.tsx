'use client'

import { motion } from 'framer-motion'

interface GeometricPatternProps {
  opacity?: number
  scale?: number
}

export default function GeometricPattern({ opacity = 0.03, scale = 1 }: GeometricPatternProps) {
  return (
    <motion.div
      className="geometric-pattern"
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 1.5 }}
      style={{
        transform: `scale(${scale})`,
      }}
    />
  )
}
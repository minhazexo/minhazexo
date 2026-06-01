'use client'

import { motion } from 'framer-motion'

interface AuroraBorealisProps {
  speed?: number
  intensity?: number
}

export default function AuroraBorealis({ speed = 1, intensity = 1 }: AuroraBorealisProps) {
  const duration = 8 / speed

  return (
    <motion.div
      className="aurora-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div 
        className="aurora-wave aurora-wave-1"
        style={{
          animationDuration: `${duration}s`,
          opacity: 0.7 * intensity,
        }}
      />
      <div 
        className="aurora-wave aurora-wave-2"
        style={{
          animationDuration: `${duration * 1.25}s`,
          animationDelay: '-2s',
          opacity: 0.6 * intensity,
        }}
      />
      <div 
        className="aurora-wave aurora-wave-3"
        style={{
          animationDuration: `${duration * 1.5}s`,
          animationDelay: '-4s',
          opacity: 0.5 * intensity,
        }}
      />
      <div className="aurora-stars" />
    </motion.div>
  )
}
'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
}

/**
 * Simple card wrapper with entrance animation only (no tilt effect)
 */
export function TiltCard({
  children,
  className = '',
}: TiltCardProps) {
  return (
    <motion.div
      className={`tilt-container ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="tilt-card relative">
        {children}
      </div>
    </motion.div>
  )
}

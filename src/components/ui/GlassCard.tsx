'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  as?: 'div' | 'section' | 'article'
  style?: React.CSSProperties
}

export function GlassCard({
  children,
  className = '',
  hover = false,
  as: Component = 'div',
  style,
}: GlassCardProps) {
  return (
    <motion.div
      className={className}
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(var(--glass-blur))',
        WebkitBackdropFilter: 'blur(var(--glass-blur))',
        border: 'var(--glass-border)',
        borderRadius: 'var(--radius-glass)',
        boxShadow: 'var(--glass-shadow)',
        transition: 'background var(--duration-normal) ease, border-color var(--duration-normal) ease',
        ...style,
      }}
      whileHover={hover ? {
        background: 'var(--glass-hover-bg)',
        borderColor: 'var(--primary)',
        y: -8,
        boxShadow: '0 0 30px var(--glow-color), var(--glass-shadow)',
      } : undefined}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

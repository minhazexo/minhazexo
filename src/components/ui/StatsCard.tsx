'use client'

import { motion } from 'framer-motion'
import type { StatItem } from '@/types'

interface StatsCardProps {
  stat: StatItem
  index: number
  isInView: boolean
}

export function StatsCard({ stat, index, isInView }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: 'easeOut' }}
    >
      <div
        style={{
          height: 160,
          padding: 28,
          borderRadius: 24,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          transition: 'transform 280ms ease, box-shadow 280ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
          e.currentTarget.style.boxShadow = '0 0 18px var(--glow-color)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            marginBottom: 4,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {stat.value}
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
          {stat.label}
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          {stat.description}
        </div>
      </div>
    </motion.div>
  )
}

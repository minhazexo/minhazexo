'use client'

import { motion } from 'framer-motion'
import type { Feature } from '@/types'

interface FeatureCardProps {
  feature: Feature
  index: number
  isInView: boolean
}

export function FeatureCard({ feature, index, isInView }: FeatureCardProps) {
  const Icon = feature.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.65, delay: index * 0.06, ease: 'easeOut' }}
      style={{ height: '100%' }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          minHeight: 260,
          padding: 32,
          borderRadius: 28,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
          transition: 'transform 320ms ease, border-color 300ms ease, background 300ms ease, box-shadow 320ms ease',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.transform = 'translateY(-8px)'
          el.style.borderColor = 'var(--primary)'
          el.style.background = 'rgba(255,255,255,0.08)'
          el.style.boxShadow = '0 0 30px var(--glow-color), 0 30px 80px rgba(0,0,0,0.45)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.transform = 'translateY(0)'
          el.style.borderColor = 'rgba(255,255,255,0.08)'
          el.style.background = 'rgba(255,255,255,0.04)'
          el.style.boxShadow = 'none'
        }}
      >
        {/* Card background glow */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'var(--aurora-1)',
            filter: 'blur(120px)',
            opacity: 0.08,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />

        {/* Icon container */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 20,
            transition: 'transform 300ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotate(4deg) scale(1.08)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotate(0deg) scale(1)' }}
        >
          <Icon style={{ width: 28, height: 28, color: 'var(--primary)' }} />
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text)',
            lineHeight: 1.3,
            maxWidth: '90%',
            marginBottom: 12,
          }}
        >
          {feature.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: 'var(--text-secondary)',
            maxWidth: '95%',
          }}
        >
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}

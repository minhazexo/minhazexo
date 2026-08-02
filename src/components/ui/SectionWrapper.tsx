'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export const cinematicEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface SectionWrapperProps {
  children: React.ReactNode
  id?: string
  className?: string
  label?: string
  title?: string
  subtitle?: string
  /** Top padding: 0-4 (maps to var(--space-*) values 0=none, 1=4px...19=256px) or a CSS value */
  pt?: number | string
  /** Bottom padding: 0-4 (maps to var(--space-*) values 0=none, 1=4px...19=256px) or a CSS value */
  pb?: number | string
}

export function SectionWrapper({
  children,
  id,
  className = '',
  label,
  title,
  subtitle,
  pt,
  pb,
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const spaceMap = ['0', '4px', '8px', '12px', '16px', '20px', '24px', '32px', '40px', '48px',
    '56px', '64px', '72px', '80px', '96px', '120px', '144px', '160px', '192px', '256px']

  const resolveSpace = (val: number | string | undefined): string => {
    if (val === undefined) return 'var(--space-6)' // default 24px
    if (typeof val === 'number') return spaceMap[val] || `${val}px`
    return val
  }

  return (
    <section
      ref={ref}
      id={id}
      className={className}
      style={{
        paddingTop: resolveSpace(pt),
        paddingBottom: resolveSpace(pb),
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle ambient gradient */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
        <div style={{
          position: 'absolute', top: '-20%', left: '10%', width: 500, height: 500,
          borderRadius: '50%', opacity: 0.02,
          background: 'radial-gradient(circle, var(--primary), transparent 70%)',
          filter: 'blur(100px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '10%', width: 500, height: 500,
          borderRadius: '50%', opacity: 0.02,
          background: 'radial-gradient(circle, var(--primary-secondary), transparent 70%)',
          filter: 'blur(100px)',
        }} />
      </div>

      <div style={{ maxWidth: 'var(--content-width)', margin: '0 auto', padding: '0 var(--space-6)', position: 'relative', zIndex: 1 }}>
        {(label || title) && (
          <div style={{ marginBottom: 'var(--space-11)', textAlign: 'center' }}>
            {label && (
              <motion.div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <span style={{ width: 24, height: 1, backgroundColor: 'var(--primary)', opacity: 0.4 }} />
                <span style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--primary)' }}>
                  {label}
                </span>
                <span style={{ width: 24, height: 1, backgroundColor: 'var(--primary)', opacity: 0.4 }} />
              </motion.div>
            )}
            {title && (
              <motion.h2
                style={{
                  fontSize: 'clamp(28px, 4vw, 48px)',
                  fontWeight: 700,
                  letterSpacing: '-0.015em',
                  lineHeight: 1.15,
                  color: 'var(--text)',
                  marginBottom: subtitle ? 'var(--space-3)' : 0,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
              >
                {title}
              </motion.h2>
            )}
            {subtitle && (
              <motion.p
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  maxWidth: 560,
                  margin: '0 auto',
                  color: 'var(--text-secondary)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}
        {children}
      </div>

    </section>
  )
}

'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { features } from '@/data/features'
import { FeatureCard } from '@/components/ui/FeatureCard'

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      ref={ref}
      id="features"
      className="features-section"
      style={{
        position: 'relative',
        paddingTop: 140,
        paddingBottom: 140,
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--space-6)', width: '100%' }}>
        {/* Section label */}
        <motion.div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <span style={{ width: 24, height: 1, backgroundColor: 'var(--primary)', opacity: 0.4 }} />
          <span style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--primary)' }}>
            Why Work With Me
          </span>
          <span style={{ width: 24, height: 1, backgroundColor: 'var(--primary)', opacity: 0.4 }} />
        </motion.div>

        {/* Section heading */}
        <motion.h2
          style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 700,
            letterSpacing: '-0.015em',
            lineHeight: 1.15,
            color: 'var(--text)',
            textAlign: 'center',
            maxWidth: 640,
            margin: '0 auto var(--space-10)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
        >
          Built with{' '}
          <span
            style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            precision
          </span>{' '}
          and care
        </motion.h2>

        {/* Feature grid - 4 columns desktop, 2 tablet, 1 mobile */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 32,
          }}
          className="features-grid"
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} isInView={isInView} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .features-section { padding-top: 100px !important; padding-bottom: 100px !important; }
        }
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .features-section { padding-top: 72px !important; padding-bottom: 72px !important; }
        }
      `}</style>
    </section>
  )
}

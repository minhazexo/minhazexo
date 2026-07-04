'use client'

import { motion } from 'framer-motion'

function Shimmer() {
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
        willChange: 'transform',
      }}
      animate={{ x: ['-100%', '100%'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
    />
  )
}

function SkeletonBlock({ className, style: customStyle }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--glass-bg)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        ...customStyle,
      }}
      aria-hidden="true"
    >
      <Shimmer />
    </div>
  )
}

export function SectionSkeleton() {
  return (
    <div className="section-skeleton" style={{ padding: '80px 0', position: 'relative', overflow: 'hidden' }} aria-hidden="true">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <SkeletonBlock style={{ display: 'inline-block', height: 24, width: 128, borderRadius: 999, marginBottom: 16 }} />
          <SkeletonBlock style={{ height: 40, width: 256, margin: '0 auto 8px', borderRadius: 12 }} />
          <SkeletonBlock style={{ height: 20, width: 384, margin: '0 auto', maxWidth: '100%', borderRadius: 8 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
          {[1, 2].map((i) => (
            <SkeletonBlock key={i} style={{ height: 288, borderRadius: 20 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }} aria-hidden="true">
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', width: '100%', textAlign: 'center' }}>
          <SkeletonBlock style={{ display: 'inline-block', height: 24, width: 192, borderRadius: 999, marginBottom: 24 }} />
          <SkeletonBlock style={{ height: 64, width: 384, margin: '0 auto 16px', maxWidth: '100%', borderRadius: 12 }} />
          <SkeletonBlock style={{ height: 24, width: 288, margin: '0 auto 24px', borderRadius: 8 }} />
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <SkeletonBlock style={{ height: 48, width: 144, borderRadius: 999 }} />
            <SkeletonBlock style={{ height: 48, width: 112, borderRadius: 999 }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="form-skeleton" style={{ padding: '80px 0', position: 'relative', overflow: 'hidden' }} aria-hidden="true">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <SkeletonBlock style={{ display: 'inline-block', height: 24, width: 144, borderRadius: 999, marginBottom: 16 }} />
          <SkeletonBlock style={{ height: 40, width: 192, margin: '0 auto 8px', borderRadius: 12 }} />
          <SkeletonBlock style={{ height: 20, width: 320, margin: '0 auto', maxWidth: '100%', borderRadius: 8 }} />
        </div>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <SkeletonBlock style={{ height: 384, borderRadius: 20 }} />
        </div>
      </div>
    </div>
  )
}

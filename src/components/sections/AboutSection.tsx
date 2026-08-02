'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Download, CheckCircle } from 'lucide-react'
import { aboutInfoItems, aboutStats } from '@/data/about'
import { StatsCard } from '@/components/ui/StatsCard'

export function AboutSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      id="about"
      style={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--space-6)', position: 'relative', zIndex: 1 }}>
        {/* Section label */}
        <motion.div
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <span style={{ width: 24, height: 1, backgroundColor: 'var(--primary)', opacity: 0.4 }} />
          <span style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--primary)' }}>
            About
          </span>
        </motion.div>

        {/* Two-column layout: 48/52 split */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '48fr 52fr',
            gap: 80,
            alignItems: 'start',
          }}
          className="about-grid"
        >
          {/* Left Column */}
          <div>
            <motion.h2
              style={{
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontWeight: 700,
                letterSpacing: '-0.015em',
                lineHeight: 1.15,
                color: 'var(--text)',
                marginBottom: 'var(--space-5)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
            >
              Building the{' '}
              <span
                style={{
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                future
              </span>
              , one project at a time
            </motion.h2>

            <motion.p
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                maxWidth: 620,
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-8)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            >
              I&apos;m a full-stack developer with 3+ years of experience crafting premium
              digital experiences. I specialize in React, Next.js, and Node.js, turning
              complex requirements into elegant, performant applications that users love.
            </motion.p>

            {/* Stats grid - 4 columns */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 24,
                marginBottom: 'var(--space-8)',
              }}
              className="about-stats-grid"
            >
              {aboutStats.map((stat, index) => (
                <StatsCard key={stat.label} stat={stat} index={index} isInView={isInView} />
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              className="about-cta"
              style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
            >
              <motion.a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  height: 48,
                  padding: '14px 24px',
                  borderRadius: '999px',
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#fff',
                  background: 'var(--gradient-primary)',
                  border: 'var(--glass-border)',
                  boxShadow: '0 0 20px var(--glow-color)',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
                whileHover={{ y: -2, scale: 1.02, boxShadow: '0 0 30px var(--glow-color)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25 }}
              >
                <Download style={{ width: 18, height: 18 }} />
                Download Resume
              </motion.a>

              <motion.a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  height: 48,
                  padding: '14px 24px',
                  borderRadius: '999px',
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: 'var(--glass-border)',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
                whileHover={{ color: 'var(--text)', background: 'var(--glass-hover-bg)', borderColor: 'var(--border-strong)', y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25 }}
              >
                Contact Me
                <ArrowRight style={{ width: 18, height: 18 }} />
              </motion.a>
            </motion.div>
          </div>

          {/* Right Column - Glass Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          >
            <div
              className="about-glass-panel"
              style={{
                padding: 40,
                borderRadius: 32,
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: 'var(--glass-border)',
              }}
            >
              {/* Short Bio */}
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  marginBottom: 28,
                }}
              >
                I transform ideas into polished digital products. With expertise across the
                full stack, I deliver solutions that are as beautiful as they are functional.
                Every line of code is an opportunity to create something extraordinary.
              </p>

              {/* Checklist items */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {aboutInfoItems.map((item, i) => {
                  const ItemIcon = item.icon
                  return (
                    <div key={item.label}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          height: 48,
                          cursor: 'default',
                          transition: 'background 250ms ease',
                          borderRadius: 8,
                          padding: '0 8px',
                          margin: '0 -8px',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--glass-bg)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'var(--glass-bg)',
                            flexShrink: 0,
                          }}
                        >
                          <ItemIcon style={{ width: 16, height: 16, color: 'var(--primary)' }} />
                        </div>
                        <span style={{ fontSize: 14, color: 'var(--text-muted)', minWidth: 80, flexShrink: 0 }}>
                          {item.label}
                        </span>
                        <span style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>
                          {item.value}
                        </span>
                      </div>
                      {i < aboutInfoItems.length - 1 && (
                        <div style={{ height: 1, background: 'var(--divider)', margin: '0 8px' }} />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Current Status Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 24,
                  padding: '8px 16px',
                  borderRadius: '999px',
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: 'var(--glass-border)',
                }}
              >
                <span style={{ position: 'relative', width: 8, height: 8 }}>
                  <motion.span
                    style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: 'var(--primary)', opacity: 0.4 }}
                    animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span style={{ position: 'relative', display: 'block', width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                </span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Available for Freelance
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  )
}

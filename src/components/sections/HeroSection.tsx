'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Github } from 'lucide-react'
import { techTags } from '@/data/hero'

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const headingY = useTransform(scrollYProgress, [0, 1], ['0%', '10px'])
  const descY = useTransform(scrollYProgress, [0, 1], ['0%', '8px'])
  const ctaY = useTransform(scrollYProgress, [0, 1], ['0%', '6px'])
  const auroraY = useTransform(scrollYProgress, [0, 1], ['0%', '40px'])

  const [isDesktop, setIsDesktop] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDesktop) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = (e.clientX - centerX) / rect.width
    const dy = (e.clientY - centerY) / rect.height
    mouseX.set(dx * 16)
    mouseY.set(dy * 16)
  }

  return (
    <section
      ref={containerRef}
      id="hero"
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
        <motion.div
          className="hero-aurora"
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            x: '-50%',
            width: '900px',
            height: '900px',
            borderRadius: '50%',
            background: 'var(--glow-color)',
            filter: 'blur(220px)',
            opacity: 0.18,
            zIndex: 0,
            y: auroraY,
            transition: 'opacity 0.5s ease, background 0.5s ease',
          }}
          aria-hidden="true"
        />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 256,
          pointerEvents: 'none',
          zIndex: 10,
          background: 'linear-gradient(to bottom, transparent 0%, var(--background) 100%)',
        }}
        aria-hidden="true"
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
          paddingTop: 120,
          paddingBottom: 120,
        }}
      >
        <motion.div
          className="hero-content"
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: '0 32px',
            width: '100%',
            x: springX,
            y: springY,
          }}
        >
          <motion.div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              height: 38,
              padding: '12px 18px',
              borderRadius: '999px',
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid var(--border)',
              marginBottom: 'var(--space-9)',
              cursor: 'default',
              transition: 'transform 250ms ease, box-shadow 250ms ease',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px var(--glow-color)' }}
          >
            <span style={{ position: 'relative', width: 8, height: 8 }}>
              <motion.span
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: 'var(--primary)', opacity: 0.4 }}
                animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span style={{ position: 'relative', display: 'block', width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
            </span>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)' }}>
              Available for new projects
            </span>
          </motion.div>

          <motion.h1
            style={{
              fontSize: 'clamp(42px, 6.25vw, 80px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.08,
              color: 'var(--text)',
              maxWidth: 900,
              margin: '0 auto var(--space-5)',
              y: headingY,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            Crafting digital{' '}
            <span
              style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              experiences
            </span>
            <br />
            that matter.
          </motion.h1>

          <motion.p
            style={{
              fontSize: 18,
              lineHeight: 1.8,
              maxWidth: 680,
              margin: '0 auto',
              color: 'var(--text-secondary)',
              fontWeight: 400,
              marginBottom: 40,
              y: descY,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            I build fast, reliable web applications
            that deliver real value for users and businesses.
          </motion.p>

          <motion.div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 16,
              marginBottom: 40,
              y: ctaY,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.a
              href="#projects"
              onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                height: 54,
                padding: '18px 32px',
                borderRadius: '999px',
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--text)',
                background: 'var(--gradient-primary)',
                border: '1px solid var(--border)',
                boxShadow: '0 0 24px var(--glow-color)',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
              whileHover={{ y: -2, scale: 1.02, boxShadow: '0 0 36px var(--glow-color)' }}
              whileFocus={{ y: -2, scale: 1.02, boxShadow: '0 0 36px var(--glow-color)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              View my work
              <ArrowRight style={{ width: 20, height: 20 }} />
            </motion.a>

            <motion.a
              href="https://github.com/minhazexo"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                height: 54,
                padding: '18px 32px',
                borderRadius: '999px',
                fontSize: 16,
                fontWeight: 500,
                color: 'var(--text-secondary)',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
              whileHover={{ color: 'var(--text)', background: 'var(--glass-hover)', borderColor: 'var(--border-strong)', y: -1 }}
              whileFocus={{ color: 'var(--text)', background: 'var(--glass-hover)', borderColor: 'var(--border-strong)', y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <Github style={{ width: 20, height: 20 }} />
              GitHub
            </motion.a>
          </motion.div>

          <motion.div
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            {techTags.map((tag) => (
              <motion.span
                key={tag}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: 34,
                  padding: '10px 16px',
                  borderRadius: '999px',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid var(--border)',
                  cursor: 'default',
                  transition: 'transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease',
                }}
                whileHover={{
                  y: -2,
                  boxShadow: '0 0 12px var(--glow-color)',
                  borderColor: 'var(--border-strong)',
                }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <div className="hero-scroll" style={{
        height: 96,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
        paddingBottom: 'var(--space-7)',
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            <span style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
              SCROLL
            </span>
            <div style={{
              width: 24,
              height: 40,
              borderRadius: '999px',
              border: '1px solid var(--border-strong)',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: 8,
            }}>
              <motion.div
                style={{
                  width: 2,
                  height: 10,
                  borderRadius: '999px',
                  backgroundColor: 'var(--text-muted)',
                }}
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

    </section>
  )
}

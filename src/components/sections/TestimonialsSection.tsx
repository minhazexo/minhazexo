'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { testimonials as fallbackTestimonials } from '@/data/testimonials'
import { SectionWrapper, cinematicEase } from '@/components/ui/SectionWrapper'
import { useApiData } from '@/hooks/useApiData'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const AUTO_INTERVAL_MS = 5000

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  // Hover and focus tracked separately so autoplay stays paused while
  // either is active (avoids a mouseleave/focus race on the controls)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const isPaused = isHovered || isFocused
  // Bumped on manual interaction to reset the auto-advance timer
  const [nonce, setNonce] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: '-80px' })
  const prefersReduced = useReducedMotion()

  const { data: testimonials } = useApiData<any>('/api/testimonials', fallbackTestimonials)

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
    setNonce((n) => n + 1)
  }
  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setNonce((n) => n + 1)
  }
  // Auto-advance: only when visible, not paused (hover/focus), and motion is allowed
  useEffect(() => {
    if (prefersReduced || !isInView || isPaused || testimonials.length < 2) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, AUTO_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [prefersReduced, isInView, isPaused, nonce, testimonials.length])

  const isAutoPlaying = isInView && !isPaused && !prefersReduced && testimonials.length > 1

  return (
    <SectionWrapper
      id="testimonials"
      label="Kind Words"
      title="Testimonials"
      subtitle="What people say about working with me"
      pt={6}
      pb={6}
    >
      <div
        ref={ref}
        style={{ maxWidth: 680, margin: '0 auto' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <div style={{ display: 'grid', minHeight: 300 }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              className="testimonial-card"
              style={{
                gridArea: '1 / 1',
                padding: 'var(--space-8) var(--space-9)',
                borderRadius: 'var(--radius-glass)',
                border: '1px solid var(--border)',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(var(--glass-blur))',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minWidth: 0,
              }}
              initial={{ opacity: 0, x: 40 }}
              animate={i === current ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {/* Quote */}
              <div style={{ fontSize: 48, lineHeight: 1, color: `${t.color}30`, fontFamily: 'serif', marginBottom: 'var(--space-4)' }}>
                &ldquo;
              </div>

              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                {t.content}
              </p>

              {/* Rating */}
              <div style={{ display: 'flex', gap: 2, marginBottom: 'var(--space-5)' }}>
                {Array.from({ length: 5 }).map((_, ri) => (
                  <Star
                    key={ri}
                    style={{
                      width: 16, height: 16,
                      color: ri < t.rating ? t.color : 'var(--text-muted)',
                      fill: ri < t.rating ? t.color : 'none',
                    }}
                  />
                ))}
              </div>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', minWidth: 0 }}>
                <div
                  style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-full)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 600,
                    background: `${t.color}15`, color: t.color,
                    border: `1px solid ${t.color}30`,
                  }}
                >
                  {t.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.role} at {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Auto-advance progress bar */}
        <div
          aria-hidden="true"
          style={{
            marginTop: 'var(--space-6)',
            height: 3,
            borderRadius: 'var(--radius-full)',
            background: 'var(--border)',
            overflow: 'hidden',
          }}
        >
          <motion.div
            key={`${current}-${nonce}`}
            initial={{ scaleX: 0 }}
            animate={isAutoPlaying ? { scaleX: 1 } : { scaleX: 0 }}
            transition={
              isAutoPlaying
                ? { duration: AUTO_INTERVAL_MS / 1000, ease: 'linear' }
                : { duration: 0.25 }
            }
            style={{
              height: '100%',
              transformOrigin: 'left',
              background: 'var(--gradient-primary)',
              boxShadow: '0 0 8px var(--glow-color)',
            }}
          />
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 'var(--space-5)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button onClick={prev} className="btn-secondary" style={{ width: 40, height: 40, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Previous">
              <ChevronLeft style={{ width: 16, height: 16 }} />
            </button>
            <button onClick={next} className="btn-secondary" style={{ width: 40, height: 40, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Next">
              <ChevronRight style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

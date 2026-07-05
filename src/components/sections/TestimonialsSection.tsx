'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { testimonials } from '@/data/testimonials'
import { SectionWrapper, cinematicEase } from '@/components/ui/SectionWrapper'

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <SectionWrapper
      id="testimonials"
      label="Kind Words"
      title="Testimonials"
      subtitle="What people say about working with me"
      pt={6}
      pb={6}
    >
      <div ref={ref} style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ position: 'relative', minHeight: 300 }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              className="testimonial-card"
              style={{
                position: 'absolute',
                inset: 0,
                padding: 'var(--space-8) var(--space-9)',
                borderRadius: 'var(--radius-glass)',
                border: '1px solid var(--border)',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(var(--glass-blur))',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div
                  style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-full)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 600,
                    background: `${t.color}15`, color: t.color,
                    border: `1px solid ${t.color}30`,
                  }}
                >
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.role} at {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-7)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? 24 : 8,
                  height: 6,
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--duration-normal) ease',
                  backgroundColor: i === current ? 'var(--primary)' : 'var(--border)',
                }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

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
      <style>{`
        @media (max-width: 640px) {
          .testimonial-card { padding: 24px !important; border-radius: 20px !important; }
        }
      `}</style>
    </SectionWrapper>
  )
}

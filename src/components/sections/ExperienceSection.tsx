'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { experiences as fallbackExperiences } from '@/data/experience'
import { SectionWrapper, cinematicEase } from '@/components/ui/SectionWrapper'
import { useApiData } from '@/hooks/useApiData'

export function ExperienceSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const { data: experiences } = useApiData<any>('/api/experience', fallbackExperiences)

  return (
    <SectionWrapper
      id="experience"
      label="Career"
      title="Experience"
      subtitle="My professional journey building digital products"
      pt={6}
      pb={6}
    >
      <div ref={ref} style={{ maxWidth: 680, margin: '0 auto' }}>
        {experiences.map((exp: any, index: number) => (
          <ExperienceCard key={exp.id} experience={exp} index={index} isInView={isInView} />
        ))}
      </div>
      <style>{`
        @media (max-width: 640px) {
          .exp-card { padding: 20px !important; }
          .exp-card-inner { gap: 12px !important; }
        }
      `}</style>
    </SectionWrapper>
  )
}

function ExperienceCard({ experience, index, isInView }: {
  experience: any;
  index: number;
  isInView: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      style={{ display: 'flex', gap: 'var(--space-5)', marginBottom: index < 2 ? 'var(--space-9)' : 0 }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.12, ease: cinematicEase }}
    >
      {/* Timeline dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
        <div
          style={{
            width: 12, height: 12, borderRadius: 'var(--radius-full)',
            marginTop: 6, position: 'relative', zIndex: 1,
            backgroundColor: experience.color,
            boxShadow: `0 0 12px ${experience.color}40`,
          }}
        />
        {index < 2 && (
          <div style={{ width: 1, flex: 1, marginTop: 'var(--space-2)', background: `linear-gradient(to bottom, ${experience.color}30, transparent)` }} />
        )}
      </div>

      {/* Card */}
      <div className="exp-card-inner" style={{ flex: 1, paddingBottom: index < 2 ? 'var(--space-3)' : 0 }}>
        <div
          className="exp-card"
          style={{
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-glass)',
            border: '1px solid var(--border)',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(var(--glass-blur))',
            cursor: 'pointer',
            transition: 'border-color var(--duration-normal) ease',
          }}
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 0 30px var(--glow-color), var(--glass-shadow)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <div>
              <span style={{ fontSize: 12, letterSpacing: '0.05em', color: experience.color }}>{experience.period}</span>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginTop: 2 }}>{experience.role}</h3>
            </div>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{experience.company}</span>
          </div>

          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
            {experience.description}
          </p>

          {/* Animated highlights */}
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginBottom: 'var(--space-4)' }}>
              {experience.highlights.map((h: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', fontSize: 14, color: 'var(--text-secondary)' }}>
                  <span style={{ width: 4, height: 4, borderRadius: 'var(--radius-full)', marginTop: 8, flexShrink: 0, backgroundColor: experience.color }} />
                  {h}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tech */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
            {experience.tech.map((tech: string) => (
              <span key={tech} className="tag">{tech}</span>
            ))}
          </div>

          {/* Expand indicator */}
          <div style={{ marginTop: 'var(--space-3)', fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
            <span>{isExpanded ? 'Show less' : 'Show details'}</span>
            <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} style={{ display: 'inline-block' }}>↓</motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

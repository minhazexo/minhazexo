'use client'

import { useRef, useMemo, memo } from 'react'
import { motion, useInView } from 'framer-motion'
import { Monitor, Server, Terminal } from 'lucide-react'
import { skillCategories as fallbackCategories } from '@/data/skills'
import { SectionWrapper, cinematicEase } from '@/components/ui/SectionWrapper'
import { useApiData } from '@/hooks/useApiData'

const categoryMeta: Record<string, { icon: any; color: string }> = {
  Frontend: { icon: Monitor, color: '#00E5FF' },
  Backend: { icon: Server, color: '#00F593' },
  'Tools & Others': { icon: Terminal, color: '#FF2D95' },
}

export const SkillsSection = memo(function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const { data: dbSkills } = useApiData<any>('/api/skills', [])

  const skillCategories = useMemo(() => {
    if (dbSkills.length === 0) return fallbackCategories

    const grouped: Record<string, { skills: string[] }> = {}
    for (const s of dbSkills) {
      if (!grouped[s.category]) grouped[s.category] = { skills: [] }
      grouped[s.category].skills.push(s.name)
    }

    return Object.entries(grouped).map(([name, { skills }]) => ({
      name,
      icon: categoryMeta[name]?.icon || Monitor,
      color: categoryMeta[name]?.color || '#00E5FF',
      skills,
    }))
  }, [dbSkills])

  return (
    <SectionWrapper
      id="skills"
      label="Expertise"
      title="Skills & Expertise"
      subtitle="Technologies I use to bring ideas to life"
      pt={6}
      pb={6}
    >
      <div className="skills-grid" ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
        {skillCategories.map((category, ci) => (
          <motion.div
            key={category.name}
            style={{
              padding: 'var(--space-7) var(--space-6)',
              borderRadius: 'var(--radius-glass)',
              border: '1px solid var(--border)',
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(var(--glass-blur))',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 + ci * 0.1, ease: cinematicEase }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              <div
                style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: `${category.color}15`,
                }}
              >
                <category.icon className="w-5 h-5" style={{ color: category.color }} />
              </div>
              <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{category.name}</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {category.skills.map((skill, si) => (
                <motion.span
                  key={skill}
                  className="tag"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.2 + ci * 0.1 + si * 0.03, ease: cinematicEase }}
                  style={{ fontSize: 12, padding: '4px 12px' }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <style>{`
        @media (max-width: 640px) {
          .skills-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </SectionWrapper>
  )
})

'use client'

import { useRef, useState, memo } from 'react'
import { motion, useInView } from 'framer-motion'
import { skillCategories, topSkills } from '@/data/skills'
import { SectionHeader } from '@/components/effects/CinematicSection'
import { TiltCard } from '@/components/effects/TiltCard'
import { cinematicEase } from '@/hooks/useCinematicReveal'

function EnergyCell({ level, color, delay }: { level: number; color: string; delay: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const cells = 8
  const filledCells = Math.round((level / 100) * cells)

  return (
    <div className="flex items-center gap-1.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {Array.from({ length: cells }).map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-4 rounded-sm"
          style={{
            background: i < filledCells
              ? color
              : 'rgba(255,255,255,0.05)',
            boxShadow: i < filledCells && isHovered
              ? `0 0 8px ${color}80`
              : 'none',
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={isHovered ? {
            scaleY: [1, 1.3, 1],
            transition: { duration: 0.3, delay: i * 0.05 },
          } : {
            scaleY: 1,
            opacity: 1,
          }}
        />
      ))}
    </div>
  )
}

function ScanningReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
      {/* Scanning line */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent z-20 pointer-events-none"
        initial={{ x: '-100%' }}
        whileInView={{ x: '200%' }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: delay + 0.2, ease: 'easeInOut' }}
      />
    </div>
  )
}

export const SkillsSection = memo(function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="py-24 relative overflow-hidden"
      aria-label="Skills and Expertise"
    >
      {/* Background Decoration - enhanced ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full"
          style={{ filter: 'blur(120px)', opacity: 0.08 }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full"
          style={{ filter: 'blur(120px)', opacity: 0.08 }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <SectionHeader
          label="// arsenal"
          title="SKILLS & EXPERTISE"
          subtitle="Technologies I use to bring ideas to life"
          isInView={isInView}
        />

        {/* Skills Grid with Energy Cells */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 will-change-transform">
          {skillCategories.map((category, categoryIndex) => (
            <ScanningReveal key={category.name} delay={0.2 + categoryIndex * 0.15}>
              <motion.div
                className="rounded-2xl p-8 border border-indigo-500/10 h-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(15,15,35,0.9), rgba(30,10,60,0.4))',
                }}
                whileHover={{ y: -8, borderColor: `${category.color}40` }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <TiltCard>
                  {/* Icon */}
                  <motion.div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                    style={{
                      background: `${category.color}20`,
                      boxShadow: `0 0 30px ${category.color}40`,
                    }}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <category.icon className="w-8 h-8" style={{ color: category.color }} />
                  </motion.div>

                  {/* Title */}
                  <h3
                    className="text-2xl font-mono font-bold mb-6 tracking-tight"
                    style={{ color: category.color }}
                  >
                    {`> ${category.name.toUpperCase()}`}
                  </h3>

                  {/* Skills List with Energy Cells */}
                  <div className="space-y-4" role="list" aria-label={`${category.name} skills`}>
                    {category.skills.map((skill, skillIndex) => {
                      const topSkill = topSkills.find(s => s.name.toLowerCase() === skill.toLowerCase().replace(' ', '').replace('.js', 'js').replace('.', ''))
                      const level = topSkill?.level || 85
                      const color = topSkill?.color || category.color
                      
                      return (
                        <motion.div
                          key={skill}
                          className="flex items-center justify-between group"
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.3 + categoryIndex * 0.1 + skillIndex * 0.05, ease: cinematicEase }}
                          role="listitem"
                        >
                          <div className="flex items-center gap-3">
                            <motion.div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: category.color }}
                              whileHover={{ scale: 1.5, boxShadow: `0 0 10px ${category.color}` }}
                              aria-hidden="true"
                            />
                            <span className="text-gray-300 group-hover:text-white transition-colors duration-300 font-mono text-sm tracking-wide">
                              {skill}
                            </span>
                          </div>
                          <EnergyCell level={level} color={color} delay={skillIndex * 0.1} />
                        </motion.div>
                      )
                    })}
                  </div>
                </TiltCard>
              </motion.div>
            </ScanningReveal>
          ))}
        </div>
      </div>
    </section>
  )
})

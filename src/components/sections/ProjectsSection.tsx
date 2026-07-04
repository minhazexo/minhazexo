'use client'

import { useState, useRef, useCallback, memo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ExternalLink, Code2, Eye, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { projects, categories } from '@/data/projects'
import { SectionWrapper, cinematicEase } from '@/components/ui/SectionWrapper'
import ProjectDetailModal from '@/components/effects/ProjectDetailModal'

const ProjectCard = memo(function ProjectCard({ project, index, isInView, onClick }: {
  project: typeof projects[0];
  index: number;
  isInView: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: cinematicEase }}
    >
      <div
        style={{
          borderRadius: 'var(--radius-glass)',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(var(--glass-blur))',
          height: '100%',
          cursor: 'pointer',
          transition: 'border-color var(--duration-normal) ease, transform var(--duration-normal) ease',
        }}
        onClick={onClick}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 0 30px var(--glow-color), var(--glass-shadow)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
          <Image
            src={project.image}
            alt={`${project.title} project screenshot`}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
            className="object-cover"
            style={{ transition: 'transform 0.5s ease' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--background) 0%, transparent 60%)' }} />

          {/* Category badge */}
          <div style={{ position: 'absolute', top: 'var(--space-4)', left: 'var(--space-4)' }}>
            <span className="badge">{project.category}</span>
          </div>

          {/* Hover overlay */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0, transition: 'opacity 0.3s ease',
          }}
            className="project-hover-overlay"
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-full)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
              border: '1px solid var(--border)', color: 'var(--text)', fontSize: 12,
            }}>
              <Eye style={{ width: 14, height: 14 }} />
              View Project
              <ChevronRight style={{ width: 12, height: 12 }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 'var(--space-5) var(--space-6)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-2)' }}>{project.title}</h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>{project.description}</p>

          {/* Tech */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-4)' }}>
            {project.tech.slice(0, 4).map((tech) => (
              <span key={tech} className="tag">{tech}</span>
            ))}
            {project.tech.length > 4 && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)', padding: '2px 8px' }}>+{project.tech.length - 4}</span>
            )}
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 'var(--space-5)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--divider)' }}>
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 13, color: 'var(--text-muted)' }}
              onClick={(e) => e.stopPropagation()}>
              <Code2 style={{ width: 14, height: 14 }} /> Source
            </a>
            {project.demo !== '#' && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 13, color: 'var(--text-muted)' }}
                onClick={(e) => e.stopPropagation()}>
                <ExternalLink style={{ width: 14, height: 14 }} /> Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
})

export const ProjectsSection = memo(function ProjectsSection() {
  const [filter, setFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const filteredProjects = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <>
      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <SectionWrapper
        id="projects"
        label="Work"
        title="Projects"
        subtitle="A showcase of my best work, built with passion and precision"
        pt={6}
        pb={6}
      >
        <div ref={ref}>
        {/* Filter */}
        <motion.div
          style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-10)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, ease: cinematicEase }}
        >
          {categories.map((cat, idx) => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-full)',
                fontSize: 13,
                border: filter === cat ? '1px solid var(--border-strong)' : '1px solid var(--border)',
                background: filter === cat ? 'var(--glass-bg)' : 'transparent',
                color: filter === cat ? 'var(--text)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all var(--duration-normal) ease',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + idx * 0.04 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)' }} layout>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} isInView={isInView} onClick={() => setSelectedProject(project)} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View more */}
        <motion.div
          style={{ textAlign: 'center', marginTop: 'var(--space-13)' }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, ease: cinematicEase }}
        >
          <a
            href="https://github.com/minhazexo"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ display: 'inline-flex', fontSize: 14 }}
          >
            View all on GitHub <ChevronRight style={{ width: 14, height: 14 }} />
          </a>
        </motion.div>
      </div>
    </SectionWrapper>
    </>
  )
})

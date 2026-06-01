'use client'

import { useState, useRef, useCallback, memo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, Code2, Eye, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { projects, categories } from '@/data/projects'
import { TiltCard } from '@/components/effects/TiltCard'
import { SectionHeader } from '@/components/effects/CinematicSection'
import { cinematicEase } from '@/hooks/useCinematicReveal'

const ProjectDetailModal = dynamic(() => import('@/components/effects/ProjectDetailModal'), { 
  ssr: false,
  loading: () => null
})

function MissionFilter({ categories, filter, onFilterChange, isInView }: {
  categories: string[];
  filter: string;
  onFilterChange: (cat: string) => void;
  isInView: boolean;
}) {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-2 mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2, ease: cinematicEase }}
    >
      {categories.map((category, idx) => (
        <motion.button
          key={category}
          onClick={() => onFilterChange(category)}
          className="relative group"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 + idx * 0.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`relative px-5 py-2.5 rounded-lg font-mono text-sm tracking-wider transition-all duration-300 ${
            filter === category
              ? 'text-white border border-indigo-500/50'
              : 'text-indigo-400/60 border border-indigo-500/10'
          }`}
          style={{
            background: filter === category
              ? 'linear-gradient(135deg, rgba(79,70,229,0.3), rgba(129,140,248,0.1))'
              : 'transparent',
            boxShadow: filter === category ? '0 0 20px rgba(99,102,241,0.2), inset 0 0 20px rgba(99,102,241,0.05)' : 'none',
          }}>
            {/* Mission bracket decoration */}
            <span className="text-indigo-500/50 mr-2">{'['}</span>
            {category}
            <span className="text-indigo-500/50 ml-2">{']'}</span>
            
            {/* Active indicator line */}
            {filter === category && (
              <motion.div
                className="absolute -bottom-0.5 left-2 right-2 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500"
                layoutId="activeFilterLine"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </div>
        </motion.button>
      ))}
    </motion.div>
  )
}

export const ProjectsSection = memo(function ProjectsSection() {
  const [filter, setFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter((p) => p.category === filter)

  const handleProjectClick = useCallback((project: typeof projects[0]) => {
    setSelectedProject(project)
    setModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-24 relative overflow-hidden"
      aria-label="Projects"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, #6366f1 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <SectionHeader
          label="// missions"
          title="PROJECTS"
          subtitle="A showcase of my best work, built with passion and precision"
          isInView={isInView}
        />

        {/* Mission-Style Filter UI */}
        <MissionFilter
          categories={categories}
          filter={filter}
          onFilterChange={setFilter}
          isInView={isInView}
        />

        {/* Projects Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 will-change-transform"
          layout
          role="tabpanel"
          id="projects-tabpanel"
          aria-label={`Showing ${filter} projects`}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: cinematicEase }}
                role="article"
                aria-label={`Project: ${project.title}`}
              >
                <TiltCard>
                  <div
                    className="relative overflow-hidden rounded-2xl border border-indigo-500/10 group h-full cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, rgba(15,15,35,0.9), rgba(30,10,60,0.4))',
                    }}
                    onClick={() => handleProjectClick(project)}
                  >
                    {/* Animated border glow on hover */}
                    <div className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
                      style={{
                        boxShadow: 'inset 0 0 30px rgba(99, 102, 241, 0.15), 0 0 60px rgba(99, 102, 241, 0.05)',
                      }}
                      aria-hidden="true"
                    />
                    
                    {/* Project Image */}
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={`${project.title} project screenshot`}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f23] via-[#0f0f23]/50 to-transparent" aria-hidden="true" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-sm tracking-wider">
                          {'[ '}{project.category}{' ]'}
                        </span>
                      </div>

                      {/* Quick action overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-sm">
                          <Eye className="w-4 h-4 text-indigo-300" />
                          <span className="text-indigo-200 text-sm font-mono">VIEW_MISSION</span>
                          <ChevronRight className="w-4 h-4 text-indigo-400" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-orbitron font-bold text-white">
                          {project.title}
                        </h3>
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                          <ChevronRight className="w-4 h-4 text-indigo-400" />
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2 font-mono leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded text-xs font-mono bg-indigo-500/5 text-indigo-400/70 border border-indigo-500/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex gap-4 pt-3 border-t border-indigo-500/10">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-500 text-xs font-mono"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`View ${project.title} source code on GitHub`}
                        >
                          <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
                          source_code
                        </a>
                        {project.demo !== '#' && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-500 text-xs font-mono"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`View ${project.title} live demo`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                            live_demo
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Scan line overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(99,102,241,0.5) 2px, rgba(99,102,241,0.5) 4px)',
                    }} />
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View More */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, ease: cinematicEase }}
        >
          <motion.a
            href="https://github.com/minhazexo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-indigo-500/20 text-indigo-300 font-mono text-sm group"
            whileTap={{ scale: 0.98 }}
            aria-label="View more projects on GitHub (opens in new tab)"
          >
            <span className="text-indigo-500/50">$</span>
            view_more_on_github
            <span className="w-2 h-4 bg-indigo-400 animate-pulse" />
          </motion.a>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </section>
  )
})

'use client';

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Github } from 'lucide-react'
import type { Project } from '@/types'

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const modalContent = (
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-3xl bg-gradient-to-b from-indigo-950/90 to-black/90 border border-indigo-500/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.15)]"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative top line */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 border border-indigo-500/20 text-indigo-400 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Image */}
              <div className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-6 border border-indigo-500/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Category badge */}
                <div className="absolute top-3 left-3 px-3 py-1 text-xs font-mono text-indigo-300 bg-indigo-950/80 border border-indigo-500/30 rounded-full">
                  {project.category}
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 font-mono tracking-tight">
                {project.title}
              </h2>

              {/* Description */}
              <p className="text-indigo-200/80 leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Tech stack */}
              <div className="mb-6">
                <h3 className="text-sm font-mono text-indigo-400 mb-3">TECHNOLOGY STACK</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-indigo-300 border border-indigo-500/30 rounded-lg transition-colors"
                >
                  <Github size={16} />
                  Source Code
                </a>
                {project.demo !== '#' && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg transition-all"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>

            {/* Scan line effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(99,102,241,0.5) 2px, rgba(99,102,241,0.5) 4px)',
            }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Use portal to render at document body level, avoiding parent CSS stacking context issues
  if (!mounted) return null
  return createPortal(modalContent, document.body)
}
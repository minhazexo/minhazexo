'use client';

import { useEffect, useState, useCallback, useRef } from 'react'
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
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key !== 'Tab' || !modalRef.current) return
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    const prevFocus = document.activeElement as HTMLElement
    const timer = setTimeout(() => {
      modalRef.current?.querySelector<HTMLElement>('button')?.focus()
    }, 100)
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      prevFocus?.focus()
    }
  }, [isOpen, handleKeyDown])

  const modalContent = (
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Project details: ${project.title}`}
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
            ref={modalRef}
            style={{
              position: 'relative', width: '100%', maxWidth: 768,
              margin: '0 8px', maxHeight: '90vh', overflowY: 'auto',
              borderRadius: 20,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              boxShadow: '0 0 50px var(--glow-color)',
            }}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative top line */}
            <div style={{ height: 4, background: 'var(--gradient-primary)' }} />

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: 12, right: 12, zIndex: 10,
                width: 36, height: 36, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--glass-bg)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
              aria-label="Close project details"
            >
              <X size={18} />
            </button>

            {/* Content */}
            <div style={{ padding: '24px 32px' }}>
              {/* Image */}
              <div style={{
                position: 'relative', height: 256, borderRadius: 16,
                overflow: 'hidden', marginBottom: 24,
                border: '1px solid var(--border)',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--background) 0%, transparent 60%)' }} />
                
                {/* Category badge */}
                <div style={{
                  position: 'absolute', top: 12, left: 12,
                  padding: '4px 12px', fontSize: 12,
                  borderRadius: 999, color: 'var(--primary)',
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {project.category}
                </div>
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: 28, fontWeight: 700, color: 'var(--text)',
                marginBottom: 12, letterSpacing: '-0.01em',
              }}>
                {project.title}
              </h2>

              {/* Description */}
              <p style={{
                fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)',
                marginBottom: 24,
              }}>
                {project.description}
              </p>

              {/* Tech stack */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '0.05em' }}>
                  TECHNOLOGY STACK
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {project.tech.map((tech) => (
                    <span key={tech} className="tag">{tech}</span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, padding: '10px 20px' }}
                >
                  <Github size={16} />
                  Source Code
                </a>
                {project.demo !== '#' && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, padding: '10px 20px' }}
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Use portal to render at document body level, avoiding parent CSS stacking context issues
  if (!mounted) return null
  return createPortal(modalContent, document.body)
}
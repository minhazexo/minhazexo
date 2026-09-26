'use client'

import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { glennBlip } from '@/lib/glenn-sound'

export interface IndexProject {
  id: number | string
  title: string
  category?: string
  image?: string
  description?: string
}

interface ProjectIndexProps {
  projects: IndexProject[]
  onSelect: (project: IndexProject) => void
}

const EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1]

/* Original massive index list with cursor-following preview.
   Rows are buttons (accessible); preview is a fixed DOM card,
   not WebGL — same feel, own implementation. */
export function ProjectIndex({ projects, onSelect }: ProjectIndexProps) {
  const [active, setActive] = useState<IndexProject | null>(null)
  const [visible, setVisible] = useState(false)
  const pos = useRef({ x: 0, y: 0 })
  const raf = useRef(0)
  const previewRef = useRef<HTMLDivElement>(null)
  const [imgOk, setImgOk] = useState(true)

  const movePreview = useCallback((x: number, y: number) => {
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      pos.current = { x, y }
      const el = previewRef.current
      if (el) {
        const offsetX = 190
        const offsetY = -10
        el.style.transform = `translate(${x + offsetX}px, ${y + offsetY}px) translate(-50%, -50%) scale(1)`
      }
    })
  }, [])

  const handleEnter = (p: IndexProject) => (e: React.MouseEvent) => {
    setActive(p)
    setImgOk(true)
    setVisible(true)
    movePreview(e.clientX, e.clientY)
    glennBlip(520, 0.05, 0.025)
  }

  const handleMove = () => (e: React.MouseEvent) => {
    movePreview(e.clientX, e.clientY)
  }

  const handleLeave = () => {
    setVisible(false)
    setActive(null)
  }

  return (
    <div className="glenn-index-wrap" id="projects">
      <ul className="glenn-index" aria-label="Project index">
        {projects.map((p, i) => (
          <motion.li
            key={String(p.id)}
            className="glenn-row"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.9, delay: Math.min(i * 0.04, 0.4), ease: EXPO }}
          >
            <button
              type="button"
              className="glenn-row-link"
              onClick={() => {
                glennBlip(700, 0.07, 0.035)
                onSelect(p)
              }}
              onMouseEnter={handleEnter(p)}
              onMouseMove={handleMove()}
              onMouseLeave={handleLeave}
              onFocus={handleEnter(p) as unknown as React.FocusEventHandler}
              onBlur={handleLeave}
              aria-label={`Open project ${p.title}`}
            >
              <span className="glenn-row-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="glenn-row-text">{p.title}</span>
              {p.category && <span className="glenn-row-cat">{p.category}</span>}
            </button>
          </motion.li>
        ))}
      </ul>

      {/* floating preview */}
      <div ref={previewRef} className={`glenn-preview${visible && active ? ' is-visible' : ''}`} aria-hidden="true">
        {active?.image && imgOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={active.image} alt="" onError={() => setImgOk(false)} />
        ) : (
          <div className="glenn-preview-fallback">{active?.title ?? ''}</div>
        )}
      </div>
    </div>
  )
}

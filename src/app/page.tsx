'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Navigation } from '@/components/layout/Navigation'
import { GlennBackdrop } from '@/components/glenn/GlennBackdrop'
import { GlennGate } from '@/components/glenn/GlennGate'
import { GlennMeta } from '@/components/glenn/GlennMeta'
import { ProjectIndex, type IndexProject } from '@/components/glenn/ProjectIndex'
import { GlennSoundToggle } from '@/components/glenn/GlennSoundToggle'
import { GlennBackToTop } from '@/components/glenn/GlennBackToTop'
import { GlennAbout, GlennSkills, GlennExperience, GlennTestimonials, GlennContact, GlennFooter } from '@/components/glenn/GlennSections'
import ProjectDetailModal from '@/components/effects/ProjectDetailModal'
import { projects as fallbackProjects } from '@/data/projects'
import { testimonials as fallbackTestimonials } from '@/data/testimonials'
import { skillCategories } from '@/data/skills'
import { experiences } from '@/data/experience'
import { useApiData } from '@/hooks/useApiData'
import type { Project, Testimonial } from '@/types'

const ABOUT_PARAGRAPHS = [
  'I am MD Mehrab Hossain, a full-stack web developer based in Dhaka, Bangladesh.',
  'I build fast, reliable web applications with React, Next.js and Node.js — from boutique storefronts to academic portals and cinematic WebGL experiments.',
  'Currently available for freelance work. I care about performance, accessibility and interfaces that feel alive.',
]

export default function Home() {
  const [gateDone, setGateDone] = useState(false)
  const [gateGone, setGateGone] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [selected, setSelected] = useState<Project | null>(null)

  const { data: projects } = useApiData<Project>('/api/projects', fallbackProjects)
  const { data: testimonials } = useApiData<Testimonial>('/api/testimonials', fallbackTestimonials)
  const visible = projects.filter((p) => p.isVisible !== false)

  /* Preload critical data + images while the gate counts up. */
  useEffect(() => {
    document.body.classList.add('glenn-mode')
    let cancelled = false
    let done = 0
    const total = 3

    const step = () => {
      if (cancelled) return
      done += 1
      setLoadProgress(Math.round((done / total) * 100))
      if (done >= total) setTimeout(() => { if (!cancelled) setIsReady(true) }, 250)
    }

    // 1) projects JSON is already fetching via useApiData — count it shortly after mount
    const t1 = setTimeout(step, 500)

    // 2) hero/first images
    const critical = visible.slice(0, 4).map((p) => p.image).filter(Boolean).slice(0, 4)
    if (critical.length === 0) {
      setTimeout(step, 700)
    } else {
      let remaining = critical.length
      critical.forEach((src) => {
        const im = new Image()
        let finished = false
        const finish = () => {
          if (finished) return
          finished = true
          remaining -= 1
          if (remaining <= 0) step()
        }
        im.onload = finish
        im.onerror = finish
        im.src = src
        setTimeout(finish, 2500)
      })
    }

    // 3) fonts
    try {
      document.fonts?.ready.then(() => step()).catch(() => step())
    } catch {
      step()
    }
    const fallback = setTimeout(() => {
      if (!cancelled) {
        setLoadProgress(100)
        setIsReady(true)
      }
    }, 4500)

    return () => {
      cancelled = true
      clearTimeout(t1)
      clearTimeout(fallback)
      document.body.classList.remove('glenn-mode')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEnter = useCallback(() => {
    setGateDone(true)
  }, [])

  const handleSelect = useCallback(
    (item: IndexProject) => {
      const full = visible.find((p) => String(p.id) === String(item.id)) ?? null
      setSelected(full)
    },
    [visible],
  )

  const indexProjects: IndexProject[] = visible.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    image: p.image,
    description: p.description,
  }))

  const skillGroups = skillCategories.map((c) => ({ title: c.name, items: c.skills.slice(0, 8) }))
  const roles = experiences.map((e) => ({ role: e.role, company: e.company, period: e.period }))

  return (
    <div className="glenn-root">
      {/* The gallery mounts the instant Enter is clicked so the shutter
         reveal parts over live content — rows animate in as the doors open.
         The gate unmounts once its exit choreography reports done. */}
      <AnimatePresence>
        {!gateGone && (
          <GlennGate progress={loadProgress} ready={isReady} onEnter={handleEnter} onExited={() => setGateGone(true)} />
        )}
      </AnimatePresence>

      {gateDone && (
        <>
          <GlennBackdrop />
          <Navigation />
          <GlennMeta />

          {/* Layout already renders <main id="main-content"> — keep this a plain
              wrapper so landmarks don't nest. */}
          <div style={{ position: 'relative' }}>
            <ProjectIndex projects={indexProjects} onSelect={handleSelect} />

            <p className="glenn-hint">Scroll — Index / About / Skills / Experience / Words / Contact</p>

            <GlennAbout paragraphs={ABOUT_PARAGRAPHS} />
            <GlennSkills groups={skillGroups} />
            <GlennExperience roles={roles} />
            <GlennTestimonials items={testimonials} />
            <GlennContact />
          </div>

          <GlennFooter />
          <GlennBackToTop />
          <GlennSoundToggle />
          <ProjectDetailModal project={selected} isOpen={!!selected} onClose={() => setSelected(null)} />
        </>
      )}
    </div>
  )
}

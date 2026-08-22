'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { Navigation } from '@/components/layout/Navigation'
import { HeroSection } from '@/components/sections/HeroSection'

const FeaturesSection = lazy(() => import('@/components/sections/FeaturesSection').then(mod => ({ default: mod.FeaturesSection })))
const AboutSection = lazy(() => import('@/components/sections/AboutSection').then(mod => ({ default: mod.AboutSection })))
const ProjectsSection = lazy(() => import('@/components/sections/ProjectsSection').then(mod => ({ default: mod.ProjectsSection })))
const SkillsSection = lazy(() => import('@/components/sections/SkillsSection').then(mod => ({ default: mod.SkillsSection })))
const ExperienceSection = lazy(() => import('@/components/sections/ExperienceSection').then(mod => ({ default: mod.ExperienceSection })))
const TestimonialsSection = lazy(() => import('@/components/sections/TestimonialsSection').then(mod => ({ default: mod.TestimonialsSection })))
const ContactSection = lazy(() => import('@/components/sections/ContactSection').then(mod => ({ default: mod.ContactSection })))
const Footer = lazy(() => import('@/components/layout/Footer').then(mod => ({ default: mod.Footer })))

/* Every heavy chunk below is warmed up DURING the loading screen so that
   when the screen exits, all sections are already fetched + parsed and
   mount instantly — no pop-in, no skeleton flash, no jank. */
const HEAVY_MODULES = [
  () => import('@/components/sections/FeaturesSection'),
  () => import('@/components/sections/AboutSection'),
  () => import('@/components/sections/ProjectsSection'),
  () => import('@/components/sections/SkillsSection'),
  () => import('@/components/sections/ExperienceSection'),
  () => import('@/components/sections/TestimonialsSection'),
  () => import('@/components/sections/ContactSection'),
  () => import('@/components/layout/Footer'),
]

/* Section spacing per spec (Part 06):
   Hero → Features:    120px
   Features → About:   144px
   About → Projects:   144px (+ SectionDivider)
   Projects → Skills:  120px
   Skills → Experience: 120px
   Experience → Contact: 144px
   Contact → Footer:   160px
   Footer Bottom:       48px
   Each section below uses pt=0, pb=0 via internal padding.
   Spacer divs between sections handle the exact gap. */

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  useEffect(() => {
    let cancelled = false

    // Freeze the heavy animated background while we load (see globals.css).
    document.body.classList.add('site-is-loading')

    const heavyCount = HEAVY_MODULES.length
    // +1 hero image +1 projects JSON +1 critical project images batch = critical path for smooth first paint
    const total = heavyCount + 3
    let completed = 0
    let heroDone = false
    let projectsJsonDone = false
    let projectImagesDone = false

    const onStepDone = () => {
      if (cancelled) return
      completed += 1
      const base = Math.round((completed / total) * 90)
      setLoadProgress((prev) => Math.max(prev, Math.min(base, 90)))
      if (completed >= total) {
        setLoadProgress(100)
        setTimeout(() => { if (!cancelled) setIsReady(true) }, 300)
      }
    }

    // Hard fallback: never block loader more than 5s (slow network / failed assets)
    const fallbackTimer = setTimeout(() => {
      if (cancelled) return
      if (!heroDone) { heroDone = true; onStepDone() }
      if (!projectsJsonDone) { projectsJsonDone = true; onStepDone() }
      if (!projectImagesDone) { projectImagesDone = true; onStepDone() }
      if (completed < total) {
        setLoadProgress(100)
        setIsReady(true)
      }
    }, 5000)

    // Preload every heavy section while the loading screen is visible.
    HEAVY_MODULES.forEach((load) => load().then(onStepDone, onStepDone))

    // 1) Preload hero portrait
    const markHeroDone = () => {
      if (heroDone) return
      heroDone = true
      onStepDone()
    }
    const heroImg = new Image()
    heroImg.onload = markHeroDone
    heroImg.onerror = markHeroDone
    heroImg.src = '/webp/Minhaz1.webp'
    if (typeof heroImg.decode === 'function') {
      heroImg.decode().then(markHeroDone, markHeroDone)
    }
    // safety: if hero already cached, decode may have fired synchronously
    setTimeout(() => { if (!heroDone) markHeroDone() }, 2500)

    // 2) Fetch projects JSON during loading screen (critical data)
    //    Then preload only the first N visible project images (above-the-fold) — not all.
    const preloadProjectImages = (urls: string[]) => {
      if (projectImagesDone) return
      if (urls.length === 0) {
        projectImagesDone = true
        onStepDone()
        return
      }
      let remaining = urls.length
      const markOne = () => {
        remaining -= 1
        if (remaining <= 0 && !projectImagesDone) {
          projectImagesDone = true
          onStepDone()
        }
      }
      urls.forEach((src) => {
        const im = new Image()
        let done = false
        const finish = () => { if (done) return; done = true; markOne() }
        im.onload = finish
        im.onerror = finish
        im.src = src
        if (typeof im.decode === 'function') im.decode().then(finish, finish)
        // per-image timeout 3s
        setTimeout(finish, 3000)
      })
    }

    const markProjectsJsonDone = () => {
      if (projectsJsonDone) return
      projectsJsonDone = true
      onStepDone()
    }

    fetch('/api/projects')
      .then((r) => (r.ok ? r.json() : []))
      .then((data: any[]) => {
        if (cancelled) return
        markProjectsJsonDone()
        try {
          const visible = Array.isArray(data) ? data.filter((p: any) => p.isVisible !== false) : []
          const critical = visible.slice(0, 4).map((p: any) => p.image).filter(Boolean)
          // Also hint browser via link preload for first image (helps LCP)
          critical.slice(0, 1).forEach((href: string) => {
            try {
              const link = document.createElement('link')
              link.rel = 'preload'
              link.as = 'image'
              link.href = href
              document.head.appendChild(link)
            } catch {}
          })
          preloadProjectImages(critical)
        } catch {
          if (!projectImagesDone) { projectImagesDone = true; onStepDone() }
        }
      })
      .catch(() => {
        if (cancelled) return
        markProjectsJsonDone()
        if (!projectImagesDone) { projectImagesDone = true; onStepDone() }
      })

    // If projects API is slow, ensure loader still progresses after 3.5s
    setTimeout(() => {
      if (!projectsJsonDone) markProjectsJsonDone()
      if (!projectImagesDone) {
        // if json never arrived, at least count the batch step
        projectImagesDone = true
        onStepDone()
      }
    }, 3500)

    return () => {
      cancelled = true
      clearTimeout(fallbackTimer)
      document.body.classList.remove('site-is-loading')
    }
  }, [])

  const handleLoadingComplete = () => {
    document.body.classList.remove('site-is-loading')
    setIsLoading(false)
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen
            key="loading"
            onComplete={handleLoadingComplete}
            isReady={isReady}
            progress={loadProgress}
          />
        )}
      </AnimatePresence>

      {!isLoading && (
        <>
          <Navigation />
          <HeroSection />

          {/* Hero → Features: 120px / 80px mobile */}
          <div className="section-spacing-lg" style={{ height: 120 }} />

          <Suspense fallback={<div style={{ height: 400 }} />}>
            <FeaturesSection />
          </Suspense>

          {/* Features → About: 144px / 96px mobile */}
          <div className="section-spacing-lg" style={{ height: 144 }} />

          <Suspense fallback={<div style={{ height: '100vh' }} />}>
            <AboutSection />
          </Suspense>

          {/* About → Projects: 144px + SectionDivider / 88px mobile */}
          <div className="section-spacing-md" style={{ height: 72 }} />
          <SectionDivider />
          <div className="section-spacing-md" style={{ height: 71 }} />

          <Suspense fallback={<div style={{ height: '100vh' }} />}>
            <ProjectsSection />
          </Suspense>

          {/* Projects → Skills: 120px / 80px mobile */}
          <div className="section-spacing-lg" style={{ height: 120 }} />

          <Suspense fallback={<div style={{ height: '100vh' }} />}>
            <SkillsSection />
          </Suspense>

          {/* Skills → Experience: 120px / 80px mobile */}
          <div className="section-spacing-lg" style={{ height: 120 }} />

          <Suspense fallback={<div style={{ height: '100vh' }} />}>
            <ExperienceSection />
          </Suspense>

          {/* Experience → Testimonials: 120px / 80px mobile */}
          <div className="section-spacing-lg" style={{ height: 120 }} />

          <Suspense fallback={<div style={{ height: '100vh' }} />}>
            <TestimonialsSection />
          </Suspense>

          {/* Testimonials → Contact: 144px / 96px mobile */}
          <div className="section-spacing-lg" style={{ height: 144 }} />

          <Suspense fallback={<div style={{ height: '100vh' }} />}>
            <ContactSection />
          </Suspense>

          {/* Contact → Footer: 160px / 96px mobile */}
          <div className="section-spacing-lg" style={{ height: 160 }} />

          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </>
      )}
    </div>
  )
}

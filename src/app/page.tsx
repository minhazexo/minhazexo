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
    let loaded = false
    const timer = setTimeout(() => {
      if (!loaded) { setIsReady(true); setLoadProgress(100) }
    }, 2500)

    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 90) { clearInterval(interval); return 90 }
        return prev + 10
      })
    }, 200)

    const img = new Image()
    img.onload = () => {
      loaded = true
      clearTimeout(timer); clearInterval(interval)
      setLoadProgress(100)
      setTimeout(() => setIsReady(true), 300)
    }
    img.src = '/webp/for chess.webp'

    return () => { clearTimeout(timer); clearInterval(interval) }
  }, [])

  const handleLoadingComplete = () => setIsLoading(false)

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

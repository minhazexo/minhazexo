'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { Navigation } from '@/components/layout/Navigation'
import { HeroSection } from '@/components/sections/HeroSection'
import { preloadImages } from '@/data/assets'
import dynamic from 'next/dynamic'

const BackgroundEffectRenderer = dynamic(() => import('@/components/effects/BackgroundEffectRenderer').then(mod => ({ default: mod.BackgroundEffectRenderer })), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-dark-bg" aria-hidden="true" />
})

// Lazy loaded components for performance optimization
const AboutSection = lazy(() => import('@/components/sections/AboutSection').then(mod => ({ default: mod.AboutSection })))
const ProjectsSection = lazy(() => import('@/components/sections/ProjectsSection').then(mod => ({ default: mod.ProjectsSection })))
const SkillsSection = lazy(() => import('@/components/sections/SkillsSection').then(mod => ({ default: mod.SkillsSection })))
const ContactSection = lazy(() => import('@/components/sections/ContactSection').then(mod => ({ default: mod.ContactSection })))
const Footer = lazy(() => import('@/components/layout/Footer').then(mod => ({ default: mod.Footer })))
const BackToTop = lazy(() => import('@/components/layout/BackToTop').then(mod => ({ default: mod.BackToTop })))
const BackgroundMusic = lazy(() => import('@/components/effects/BackgroundMusic').then(mod => ({ default: mod.BackgroundMusic })))

// Fallback component for lazy-loaded sections
function SectionFallback() {
  return <div className="py-24" aria-hidden="true" />
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  useEffect(() => {
    let loadedCount = 0
    const totalImages = preloadImages.length

    preloadImages.forEach((src) => {
      const img = new Image()
      img.onload = () => {
        loadedCount++
        setLoadProgress(Math.round((loadedCount / totalImages) * 100))
        if (loadedCount === totalImages) {
          setIsReady(true)
        }
      }
      img.onerror = () => {
        loadedCount++
        setLoadProgress(Math.round((loadedCount / totalImages) * 100))
        if (loadedCount === totalImages) {
          setIsReady(true)
        }
      }
      img.src = src
    })

    // Fallback if images take too long
    const timeout = setTimeout(() => {
      setIsReady(true)
      setLoadProgress(100)
    }, 5000)

    return () => clearTimeout(timeout)
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  return (
    <div className="relative min-h-screen bg-dark-bg overflow-x-hidden">
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
          <Suspense fallback={null}>
            <BackgroundEffectRenderer />
          </Suspense>
          <Navigation />
          <div role="region" aria-label="Hero">
            <HeroSection />
          </div>
          <Suspense fallback={<SectionFallback />}>
            <AboutSection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <ProjectsSection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <SkillsSection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <ContactSection />
          </Suspense>
          <Suspense fallback={<div className="h-32 border-t border-white/5" aria-hidden="true" />}>
            <Footer />
          </Suspense>
          <Suspense fallback={null}>
            <BackToTop />
          </Suspense>
          <Suspense fallback={null}>
            <BackgroundMusic />
          </Suspense>
        </>
      )}
    </div>
  )
}

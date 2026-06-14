'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { Navigation } from '@/components/layout/Navigation'
import { HeroSection } from '@/components/sections/HeroSection'
import { imageAssets, preloadImages } from '@/data/assets'
import { SectionErrorBoundary } from '@/components/providers/ErrorBoundary'
import { ParallaxSection } from '@/components/effects/ParallaxSection'
import dynamic from 'next/dynamic'

const BackgroundEffectRenderer = dynamic(() => import('@/components/effects/BackgroundEffectRenderer').then(mod => ({ default: mod.BackgroundEffectRenderer })), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[var(--bg-primary)]" aria-hidden="true" />
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
    const criticalImages: string[] = [
      imageAssets.heroBg,
      imageAssets.profile,
      imageAssets.aboutProfile,
    ]
    let loadedCount = 0
    const totalImages = criticalImages.length

    criticalImages.forEach((src) => {
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

    // Defer non-critical images with requestIdleCallback
    const remainingImages = preloadImages.filter(
      (img) => !criticalImages.includes(img)
    )
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        remainingImages.forEach((src) => {
          const img = new Image()
          img.src = src
        })
      }, { timeout: 3000 })
    } else {
      setTimeout(() => {
        remainingImages.forEach((src) => {
          const img = new Image()
          img.src = src
        })
      }, 3000)
    }

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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Navigation />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            role="region"
            aria-label="Hero"
            id="hero-section"
          >
            <HeroSection />
          </motion.div>
          <ParallaxSection id="about-section" delay={0.15}>
            <SectionErrorBoundary>
              <Suspense fallback={<SectionFallback />}>
                <AboutSection />
              </Suspense>
            </SectionErrorBoundary>
          </ParallaxSection>
          <ParallaxSection id="projects-section" delay={0.3} offset={40}>
            <SectionErrorBoundary>
              <Suspense fallback={<SectionFallback />}>
                <ProjectsSection />
              </Suspense>
            </SectionErrorBoundary>
          </ParallaxSection>
          <ParallaxSection id="skills-section" delay={0.45}>
            <SectionErrorBoundary>
              <Suspense fallback={<SectionFallback />}>
                <SkillsSection />
              </Suspense>
            </SectionErrorBoundary>
          </ParallaxSection>
          <ParallaxSection id="contact-section" delay={0.6} offset={20}>
            <SectionErrorBoundary>
              <Suspense fallback={<SectionFallback />}>
                <ContactSection />
              </Suspense>
            </SectionErrorBoundary>
          </ParallaxSection>
          <ParallaxSection id="footer-section" delay={0.75} offset={15}>
            <SectionErrorBoundary>
              <Suspense fallback={<div className="h-32 border-t border-white/5" aria-hidden="true" />}>
                <Footer />
              </Suspense>
            </SectionErrorBoundary>
          </ParallaxSection>
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

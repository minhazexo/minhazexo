'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Rocket, Github, Code2, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { stats, fullText } from '@/data/hero'
import { imageAssets } from '@/data/assets'
import { CinematicText, RevealText } from '@/components/effects/CinematicText'
import { cinematicEase } from '@/hooks/useCinematicReveal'

export function HeroSection() {
  const [displayText, setDisplayText] = useState('')
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const containerRef = useRef<HTMLElement>(null)

  // Memoize stats to prevent unnecessary re-renders
  const memoizedStats = useMemo(() => stats, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
    layoutEffect: false,
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])
  const blurAmount = useTransform(scrollYProgress, [0, 0.5], ['blur(0px)', 'blur(4px)'])

  // Enhanced typing effect with cinematic feel
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
        setIsTypingComplete(true)
      }
    }, 40) // Slightly faster for smoother feel
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      ref={containerRef}
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Static hero backdrop while the shared background effect renders behind the page */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" aria-hidden="true" />

      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-[1]"
        style={{ y: backgroundY }}
      >
        <Image
          src={imageAssets.heroBg}
          alt="Abstract cosmic hero background representing digital universe"
          fill
          sizes="100vw"
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-bg/50 to-dark-bg" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20"
        style={{ y: textY, opacity, scale, filter: blurAmount }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            {/* Available Badge */}
            <RevealText delay={0.1}>
              <div className="inline-block px-4 py-2 rounded-full glass mb-6">
                <span className="text-cyan-400 text-sm font-medium flex items-center gap-2">
                  <motion.span
                    className="w-2 h-2 rounded-full bg-green-400"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Available for hire
                </span>
              </div>
            </RevealText>

            {/* Name - cinematic staggered character reveal */}
            <div className="mb-4 overflow-hidden">
              <CinematicText
                as="h1"
                className="text-5xl md:text-6xl lg:text-7xl font-orbitron font-bold gradient-text inline-block"
                delay={0.3}
                staggerAmount={0.03}
                type="characters"
              >
                MD MEHRAB
              </CinematicText>
              <br />
              <CinematicText
                as="span"
                className="text-5xl md:text-6xl lg:text-7xl font-orbitron font-bold text-white"
                delay={0.6}
                staggerAmount={0.04}
                type="characters"
              >
                HOSSAIN
              </CinematicText>
            </div>

            {/* Roles - cinematic staggered words */}
            <RevealText delay={0.8} className="mb-6">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <motion.span
                  className="text-lg md:text-xl text-cyan-400 font-medium inline-block"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: cinematicEase, delay: 0.9 }}
                >
                  Web Developer
                </motion.span>
                <span className="text-gray-500 hidden sm:inline">|</span>
                <motion.span
                  className="text-lg md:text-xl text-magenta-400 font-medium inline-block"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: cinematicEase, delay: 1.0 }}
                >
                  Code Architect
                </motion.span>
                <span className="text-gray-500 hidden sm:inline">|</span>
                <motion.span
                  className="text-lg md:text-xl text-green-400 font-medium inline-block"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: cinematicEase, delay: 1.1 }}
                >
                  Digital Dreamweaver
                </motion.span>
              </div>
            </RevealText>

            {/* Tagline with Typing Effect */}
            <div
              className="h-8 mb-8"
            >
              <p
                className="text-lg md:text-xl text-gray-300 font-light"
                aria-live="polite"
                aria-atomic="true"
                aria-label={`Typing effect: ${displayText}`}
              >
                {displayText}
                {!isTypingComplete && (
                  <span className="inline-block w-0.5 h-6 bg-cyan-400 ml-1 animate-pulse" aria-hidden="true" />
                )}
              </p>
            </div>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap gap-3 sm:gap-6 md:gap-8 mb-8 will-change-transform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {memoizedStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center flex-1 min-w-[80px] sm:flex-initial"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="text-xl sm:text-2xl md:text-3xl font-orbitron font-bold gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.a
                href="#projects"
                className="group px-6 md:px-8 py-3 md:py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium flex items-center gap-2 shadow-neon"
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                View Projects
              </motion.a>
              <motion.a
                href="https://github.com/minhazexo"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 md:px-8 py-3 md:py-4 rounded-full glass text-white font-medium flex items-center gap-2 hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-5 h-5" />
                GitHub
              </motion.a>
            </motion.div>
          </div>

          {/* Right Content - Profile Image */}
          <motion.div
            className="order-1 lg:order-2 relative hidden md:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
              {/* Outer Glowing Ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, #00D4FF, #FF00FF, #00FF88, #00D4FF)',
                  padding: '3px',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              >
                <div className="w-full h-full rounded-full bg-dark-bg" />
              </motion.div>

              {/* Middle Ring */}
              <motion.div
                className="absolute inset-4 rounded-full border-2 border-cyan-400/30"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />

              {/* Profile Image Container */}
              <motion.div
                className="absolute inset-8 rounded-full overflow-hidden glass-strong"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={imageAssets.profile}
                  alt="Profile photo of MD Mehrab Hossain, Web Developer"
                  fill
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover"
                  priority
                />
              </motion.div>

              {/* Floating Orbs */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 rounded-full"
                  style={{
                    background: i === 0 ? '#00D4FF' : i === 1 ? '#FF00FF' : '#00FF88',
                    boxShadow: `0 0 20px ${i === 0 ? '#00D4FF' : i === 1 ? '#FF00FF' : '#00FF88'}`,
                  }}
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 8 + i * 4,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  // Position orbits at different radii
                  initial={{
                    left: '50%',
                    top: '50%',
                    marginLeft: -8,
                    marginTop: -8,
                  }}
                >
                  <motion.div
                    style={{
                      position: 'absolute',
                      left: 160 + i * 20,
                      top: 0,
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-gray-500 text-xs tracking-widest">SCROLL</span>
          <div className="w-6 h-10 rounded-full border-2 border-cyan-400/50 flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-3 rounded-full bg-cyan-400"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

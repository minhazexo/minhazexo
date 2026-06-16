'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Rocket, Github } from 'lucide-react'
import Image from 'next/image'
import { stats, taglines } from '@/data/hero'
import { imageAssets } from '@/data/assets'
import { CinematicText, RevealText } from '@/components/effects/CinematicText'
import { TypingEffect } from '@/components/effects/TypingEffect'
import { cinematicEase } from '@/hooks/useCinematicReveal'

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const blurOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1])

  return (
    <section
      ref={containerRef}
      id="hero"
      className="min-h-screen flex flex-col relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[var(--bg-void)] via-[var(--bg-primary)] to-[var(--bg-void)]" aria-hidden="true" />

      <motion.div className="absolute inset-0 z-[1]" style={{ y: backgroundY }}>
        <Image
          src={imageAssets.heroBg}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-primary)]/40 via-60% to-[var(--bg-primary)]" />
      </motion.div>

      <motion.div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ opacity: blurOpacity }}
      >
        <div className="w-full h-full backdrop-blur-sm" />
      </motion.div>

      <div className="h-20 flex-shrink-0 relative z-10" />

      <div className="flex-1 flex items-center justify-center relative z-10">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl lg:max-w-2xl">
              <RevealText delay={0.1}>
                <div className="inline-block px-5 py-2.5 rounded-full glass border-accent-subtle bg-accent-subtle mb-8">
                  <span className="text-[var(--primary)] text-sm font-medium flex items-center gap-2">
                    <motion.span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--accent)' }}
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    Available for hire
                  </span>
                </div>
              </RevealText>

              <div className="mb-4 overflow-hidden">
                <CinematicText
                  as="h1"
                  className="text-[clamp(1.75rem,5vw,4rem)] lg:text-[clamp(2.5rem,4vw,4.5rem)] font-orbitron font-bold gradient-text inline-block tracking-tight"
                  delay={0.3}
                  staggerAmount={0.03}
                  type="characters"
                >
                  MD MEHRAB
                </CinematicText>
                <br />
                <CinematicText
                  as="span"
                  className="text-[clamp(1.75rem,5vw,4rem)] lg:text-[clamp(2.5rem,4vw,4.5rem)] font-orbitron font-bold text-white tracking-tight"
                  delay={0.6}
                  staggerAmount={0.04}
                  type="characters"
                >
                  HOSSAIN
                </CinematicText>
              </div>

              <RevealText delay={0.8} className="mb-4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="text-lg md:text-xl text-[var(--primary)] font-semibold">
                    Web Developer
                  </span>
                  <span className="text-gray-500 hidden sm:inline">|</span>
                  <span className="text-base md:text-lg text-gray-400 font-light">
                    Code Architect
                  </span>
                  <span className="text-gray-500 hidden sm:inline">|</span>
                  <span className="text-base md:text-lg text-gray-400 font-light">
                    React Specialist
                  </span>
                </div>
              </RevealText>

              <TypingEffect
                lines={taglines}
                speed={55}
                className="h-8 mb-10"
              />

              <motion.div
                className="flex gap-4 sm:gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="relative px-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="text-xl sm:text-2xl md:text-3xl font-orbitron font-bold gradient-text">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-300 mt-0.5">{stat.label}</div>
                    {index < stats.length - 1 && (
                      <div className="hidden sm:block absolute right-0 top-1/4 h-1/2 w-px bg-white/10" />
                    )}
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="flex flex-wrap items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.a
                  href="#projects"
                  className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white font-semibold flex items-center gap-2 shadow-neon"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 50px var(--shadow-neon)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Rocket className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  View Projects
                </motion.a>
                <motion.a
                  href="https://github.com/minhazexo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full border border-white/10 text-gray-300 font-medium flex items-center gap-2 hover:text-white hover:border-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </motion.a>
              </motion.div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <motion.div
                className="relative w-72 h-72 xl:w-96 xl:h-96"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: cinematicEase }}
              >
                <div
                  className="absolute -inset-4 rounded-2xl opacity-20 blur-3xl"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary), var(--accent))',
                  }}
                  aria-hidden="true"
                />

                <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] p-[2px] shadow-2xl">
                  <div className="w-full h-full rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <motion.div
                      className="relative w-full h-full"
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.4, ease: cinematicEase }}
                    >
                      <Image
                        src={imageAssets.chessImage}
                        alt="Chess piece representing strategic thinking"
                        fill
                        sizes="(max-width: 1280px) 288px, 384px"
                        className="object-cover"
                        priority
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="h-20 flex items-end justify-center relative z-10 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: cinematicEase }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-gray-500 text-xs tracking-widest">SCROLL</span>
            <div className="w-6 h-10 rounded-full border-2 border-accent-subtle flex justify-center pt-2">
              <motion.div
                className="w-1.5 h-3 rounded-full"
                style={{ backgroundColor: 'var(--primary)' }}
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: cinematicEase }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

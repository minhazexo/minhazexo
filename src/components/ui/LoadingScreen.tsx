'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { LoadingScreenProps } from '@/types'

/**
 * Cinematic Loading Screen - Animated galaxy spinner with system messages
 * Tracks real progress: fonts loaded, images loaded, minimum display time
 */
export function LoadingScreen({ onComplete, progress: externalProgress, isReady }: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0)
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)
  const [showSkip, setShowSkip] = useState(false)
  const hasCompleted = useRef(false)

  // Show skip button: immediately for returning users, after 2s for first-timers
  useEffect(() => {
    const isReturning = localStorage.getItem('visited-before') === 'true'
    const delay = isReturning ? 500 : 2000
    const timer = setTimeout(() => setShowSkip(true), delay)
    return () => clearTimeout(timer)
  }, [])

  // Mark as visited on mount
  useEffect(() => {
    localStorage.setItem('visited-before', 'true')
  }, [])

  // Wait for web fonts to load
  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true)
    })
  }, [])

  // Enforce minimum display time (1.5s) for dramatic effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Smoothly animate progress toward the real external progress
  useEffect(() => {
    if (displayProgress >= externalProgress) return

    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        const target = Math.max(externalProgress, fontsLoaded ? 40 : 20)
        if (prev >= target) {
          clearInterval(interval)
          return target
        }
        // Accelerate toward target
        const diff = target - prev
        const increment = Math.max(1, Math.ceil(diff / 8))
        return Math.min(prev + increment, target)
      })
    }, 40)

    return () => clearInterval(interval)
  }, [externalProgress, fontsLoaded, displayProgress])

  // Check if everything is ready and complete loading
  useEffect(() => {
    if (hasCompleted.current) return
    if (!isReady || !fontsLoaded || !minTimeElapsed) return
    if (displayProgress < 100) return

    hasCompleted.current = true
    setTimeout(onComplete, 600)
  }, [isReady, fontsLoaded, minTimeElapsed, displayProgress, onComplete])

  // Status messages tied to real progress + font status
  const getStatusMessage = () => {
    if (!fontsLoaded) return 'Loading fonts...'
    if (externalProgress < 30) return 'Initializing core modules...'
    if (externalProgress < 60) return 'Loading assets...'
    if (externalProgress < 85) return 'Compiling shaders...'
    if (!minTimeElapsed) return 'Calibrating display...'
    return 'Ready for launch...'
  }

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0A0A0F 0%, #0A0A1A 50%, #0F0F1A 100%)' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      role="progressbar"
      aria-valuenow={displayProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page is loading"
    >
      {/* Ambient glow background */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          aria-hidden="true"
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 0, 170, 0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          aria-hidden="true"
        />
      </div>

      {/* Galaxy Spinner */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-6 sm:mb-8">
        {/* Outer glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: '0 0 60px rgba(0, 212, 255, 0.4), 0 0 100px rgba(0, 212, 255, 0.2)',
          }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          aria-hidden="true"
        />

        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: '2px solid transparent',
            background: 'conic-gradient(from 0deg, #00D4FF, #FF00FF, #00FF88, #00D4FF)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'exclude',
            maskComposite: 'exclude',
            padding: '3px',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />

        {/* Middle Ring */}
        <motion.div
          className="absolute inset-3 rounded-full"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />

        {/* Inner Ring */}
        <motion.div
          className="absolute inset-6 rounded-full"
          style={{ border: '1px solid rgba(255,255,255,0.05)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />

        {/* Core */}
        <motion.div
          className="absolute inset-10 rounded-full flex items-center justify-center"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <motion.span
            className="font-bold text-white"
            style={{ fontSize: 24 }}
            key={displayProgress}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {displayProgress}
          </motion.span>
        </motion.div>

        {/* Orbiting dots */}
        {[0, 120, 240].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: 8, height: 8, borderRadius: '50%',
              top: '50%',
              left: '50%',
              marginTop: -4,
              marginLeft: -4,
              backgroundColor: 'var(--primary)',
              boxShadow: '0 0 10px var(--primary)',
            }}
            animate={{
              rotate: 360,
              x: Math.sin((angle * Math.PI) / 180) * 70,
              y: -Math.cos((angle * Math.PI) / 180) * 70,
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: 'linear',
            }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-48 sm:w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-4 sm:mb-6" aria-hidden="true">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #00D4FF, #FF00FF, #00FF88)',
            boxShadow: '0 0 10px var(--primary)',
          }}
          animate={{ width: `${displayProgress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

        {/* Status Text */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p
          style={{ color: 'var(--primary)', fontSize: 13, letterSpacing: '0.3em', marginBottom: 12, fontFamily: 'var(--font-mono)' }}
          aria-live="polite"
          aria-atomic="true"
        >
          {getStatusMessage()}
        </p>

        {/* Animated dots */}
        <div className="flex justify-center gap-1.5" aria-hidden="true">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{ width: 6, height: 6, backgroundColor: 'var(--primary)' }}
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Skip button for returning users */}
        {showSkip && (
          <motion.button
            onClick={() => { hasCompleted.current = true; onComplete() }}
            className="mt-6 text-gray-500 text-xs font-mono underline hover:text-gray-300 transition-colors cursor-pointer bg-transparent border-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            aria-label="Skip loading animation"
          >
            Skip to content
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  )
}
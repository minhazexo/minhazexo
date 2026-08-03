'use client'

import { useState, useEffect, useRef, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LoadingScreenProps } from '@/types'
import { useReducedMotion, useLowPerfDevice } from '@/hooks/useReducedMotion'

/* ------------------------------------------------------------------ *
 * Debugging note (flicker fix):
 *  `displayProgress` updates every ~40ms. Previously this re-rendered
 *  the WHOLE screen (80 stars + 3 blurred aurora + float shapes + all
 *  orbit rings) each tick, which repaints/recomposites hundreds of
 *  elements on mobile GPUs -> visible flicker.
 *
 *  Fix: every visual layer that does NOT depend on numeric progress is
 *  extracted into a React.memo'd child. Only the ring, the core number
 *  and the progress bar re-render on progress ticks.
 * ------------------------------------------------------------------ */

function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    baseOpacity: Math.random() * 0.5 + 0.4,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 3,
  }))
}

const floatShapes = [
  { id: 0, size: 80, x: 10, y: 18, radius: '50%', rotate: 0 },
  { id: 1, size: 60, x: 82, y: 10, radius: '25%', rotate: 30 },
  { id: 2, size: 70, x: 15, y: 78, radius: '50%', rotate: 0 },
  { id: 3, size: 50, x: 83, y: 82, radius: '0%', rotate: 45 },
]

const auroraLayers = [
  { w: '60%', h: '40%', t: '8%', l: '15%', color: 'var(--aurora-1)', dur: 12 },
  { w: '50%', h: '35%', t: '55%', l: '45%', color: 'var(--aurora-2)', dur: 16 },
  { w: '45%', h: '30%', t: '30%', l: '28%', color: 'var(--aurora-3)', dur: 20 },
]

const ORBIT_RADIUS = 64
const INNER_ORBIT_RADIUS = 38

type StarFieldProps = { stars: { id: number; x: number; y: number; size: number; baseOpacity: number; duration: number; delay: number }[] }
type AuroraBackdropProps = { blur: number; show: boolean }
type FloatShapesProps = { useBackdrop: boolean }

/* Keep the decorative motion.layers stable & memoized so progress ticks
   never re-render them (the mobile flicker is caused by re-rendering
   dozens of blurred animated nodes every frame). */

const StarField = memo(function StarField({ stars }: StarFieldProps) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [star.baseOpacity * 0.2, star.baseOpacity, star.baseOpacity * 0.2] }}
          transition={{ duration: star.duration, repeat: Infinity, delay: star.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
})

const AuroraBackdrop = memo(function AuroraBackdrop({ blur, show }: AuroraBackdropProps) {
  if (!show) return null
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {auroraLayers.map((layer, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: layer.w,
            height: layer.h,
            top: layer.t,
            left: layer.l,
            background: `radial-gradient(ellipse, ${layer.color} 0%, transparent 70%)`,
            filter: `blur(${blur}px)`,
          }}
          animate={{
            x: ['-6%', '6%', '-3%', '4%', '-6%'],
            y: ['0%', '-4%', '3%', '-2%', '0%'],
            scale: [1, 1.06, 0.97, 1.04, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: layer.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
})

type DecorationsProps = { show: boolean }

const FloatShapes = memo(function FloatShapes({ useBackdrop }: FloatShapesProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {floatShapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
            borderRadius: shape.radius,
            border: '1px solid var(--border)',
            background: 'var(--glass)',
            ...(useBackdrop ? { backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' } : {}),
            transform: `rotate(${shape.rotate}deg)`,
          }}
          animate={{
            x: [0, 28, -18, 12, 0],
            y: [0, -18, 14, -12, 0],
            rotate: [shape.rotate, shape.rotate + 25, shape.rotate - 15, shape.rotate + 10, shape.rotate],
            opacity: [0.2, 0.45, 0.25, 0.4, 0.2],
          }}
          transition={{ duration: 18 + shape.id * 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
})

/* Static rings & orbit particle fields — fully independent of progress. */
const SpinnerDecorations = memo(function SpinnerDecorations({ show }: DecorationsProps) {
  if (!show) return null
  return (
    <>
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: '0 0 80px var(--glow-color), 0 0 150px var(--glow-color)' }}
        animate={{ opacity: [0.3, 0.65, 0.3], scale: [1, 1.06, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      {/* Rotating gradient ring */}
      <motion.div
        className="absolute inset-[3px] rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, var(--primary), var(--primary-secondary), var(--primary-accent), var(--primary))',
          WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px))',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px))',
          opacity: 0.4,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      />

      {/* Middle ring */}
      <motion.div
        className="absolute inset-[18px] rounded-full"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      />

      {/* Outer orbit particles */}
      {[0, 120, 240].map((angle, i) => (
        <motion.div
          key={`o${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: '50%',
            left: '50%',
            marginTop: -4,
            marginLeft: -4,
            background: 'var(--primary)',
            boxShadow: '0 0 12px var(--primary)',
          }}
          animate={{
            rotate: 360,
            x: Math.sin((angle * Math.PI) / 180) * ORBIT_RADIUS,
            y: -Math.cos((angle * Math.PI) / 180) * ORBIT_RADIUS,
          }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />
      ))}

      {/* Inner orbit particles */}
      {[60, 180, 300].map((angle, i) => (
        <motion.div
          key={`i${i}`}
          className="absolute w-[5px] h-[5px] rounded-full"
          style={{
            top: '50%',
            left: '50%',
            marginTop: -2.5,
            marginLeft: -2.5,
            background: 'var(--primary-accent)',
            boxShadow: '0 0 8px var(--primary-accent)',
          }}
          animate={{
            rotate: -360,
            x: Math.sin((angle * Math.PI) / 180) * INNER_ORBIT_RADIUS,
            y: -Math.cos((angle * Math.PI) / 180) * INNER_ORBIT_RADIUS,
          }}
          transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />
      ))}
    </>
  )
})

const ScanLines = memo(function ScanLines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.02]"
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        backgroundSize: '100% 4px',
      }}
      aria-hidden="true"
    />
  )
})

export function LoadingScreen({ onComplete, progress: externalProgress, isReady }: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0)
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)
  const [showSkip, setShowSkip] = useState(false)
  const hasCompleted = useRef(false)

  const prefersReduced = useReducedMotion()
  const lowPerf = useLowPerfDevice()

  /* Fewer, lighter decorative layers on mobile / low-end / reduced-motion. */
  const stars = useMemo(
    () => generateStars(lowPerf || prefersReduced ? 24 : 72),
    [lowPerf, prefersReduced],
  )
  const showAurora = !lowPerf && !prefersReduced
  const auroraBlur = lowPerf ? 60 : 80
  const showDecorations = !prefersReduced

  useEffect(() => {
    const isReturning = localStorage.getItem('visited-before') === 'true'
    const timer = setTimeout(() => setShowSkip(true), isReturning ? 500 : 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    try { localStorage.setItem('visited-before', 'true') } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    document.fonts?.ready.then(() => setFontsLoaded(true))
    // Hard timeout so we never depend on the promise resolving.
    const t = setTimeout(() => {
      if (document.fonts?.status === 'loaded') setFontsLoaded(true)
    }, 3000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  /* Progress animation: keep increments a bit chunky on low-perf devices to
     reduce the number of ticks (each tick re-paints the ring + number). */
  const stepMs = lowPerf ? 80 : 40
  useEffect(() => {
    if (displayProgress >= externalProgress) return
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        const target = Math.max(externalProgress, fontsLoaded ? 40 : 20)
        if (prev >= target) { clearInterval(interval); return target }
        const step = lowPerf ? Math.ceil((target - prev) / 5) : Math.max(1, Math.ceil((target - prev) / 8))
        return Math.min(prev + step, target)
      })
    }, stepMs)
    return () => clearInterval(interval)
  }, [externalProgress, fontsLoaded, displayProgress, lowPerf, stepMs])

  useEffect(() => {
    if (hasCompleted.current) return
    if (!isReady || !fontsLoaded || !minTimeElapsed || displayProgress < 100) return
    hasCompleted.current = true
    setTimeout(onComplete, 600)
  }, [isReady, fontsLoaded, minTimeElapsed, displayProgress, onComplete])

  const statusMessage = (() => {
    if (!fontsLoaded) return 'Loading fonts...'
    if (externalProgress < 30) return 'Initializing core modules...'
    if (externalProgress < 60) return 'Loading assets...'
    if (externalProgress < 85) return 'Compiling shaders...'
    if (!minTimeElapsed) return 'Calibrating display...'
    return 'Ready for launch'
  })()

  const progressRingStyle = (p: number) =>
    `conic-gradient(from 270deg, var(--primary) ${p}%, transparent ${p}%)`

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: 'var(--background)' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      role="progressbar"
      aria-valuenow={displayProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page is loading"
    >
      <StarField stars={stars} />
      <AuroraBackdrop blur={auroraBlur} show={showAurora} />
      <FloatShapes useBackdrop={!lowPerf} />
      <ScanLines />
      {showDecorations && <SpinnerDecorations show={true} />}

      {/* Galaxy Spinner */}
      <motion.div
        className="relative w-36 h-36 sm:w-44 sm:h-44 mb-6 sm:mb-7"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Circular progress ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: progressRingStyle(displayProgress),
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
          }}
          aria-hidden="true"
        />

        {/* Core with live % */}
        <motion.div
          className="absolute inset-[38px] rounded-full flex items-center justify-center"
          style={{ background: 'var(--gradient-primary)' }}
          animate={{
            boxShadow: [
              '0 0 20px var(--glow-color)',
              '0 0 50px var(--glow-color)',
              '0 0 20px var(--glow-color)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <motion.span
            className="font-bold text-white"
            style={{ fontSize: 22, fontFamily: 'var(--font-mono)' }}
            key={displayProgress}
            initial={{ scale: 0.8, opacity: 0, y: 5 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {displayProgress}
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Brand wordmark */}
      <motion.p
        className="font-mono text-[11px] sm:text-xs text-center"
        style={{ color: 'var(--text-secondary)', letterSpacing: '0.45em', textTransform: 'uppercase' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        MD Mehrab Hossain
      </motion.p>

      {/* Progress bar */}
      <div
        className="w-56 sm:w-72 h-[2px] rounded-full overflow-hidden mb-5 mt-5"
        style={{ background: 'rgba(255,255,255,0.06)' }}
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${displayProgress}%`,
            background: 'linear-gradient(90deg, var(--primary), var(--primary-accent), var(--primary-secondary))',
            boxShadow: '0 0 12px var(--glow-color)',
            transition: `width ${stepMs}ms ease-out`,
          }}
        />
      </div>

      {/* Status */}
      <div className="text-center" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait">
          <motion.p
            key={statusMessage}
            className="font-mono text-xs sm:text-[13px]"
            style={{ color: 'var(--primary)', letterSpacing: '0.35em' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {statusMessage}
          </motion.p>
        </AnimatePresence>

        <div className="flex justify-center gap-1.5 mt-3" aria-hidden="true">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{ width: 5, height: 5, background: 'var(--primary)' }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>

        {showSkip && (
          <motion.button
            type="button"
            onClick={() => { hasCompleted.current = true; onComplete() }}
            className="mt-6 font-mono text-xs underline cursor-pointer bg-transparent border-none"
            style={{ color: 'var(--text-muted)' }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            aria-label="Skip loading animation"
          >
            Skip to content &rarr;
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
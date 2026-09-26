'use client'

import { useEffect, useRef, useState } from 'react'
import { setGlennSoundOn, glennBlip, glennWhoosh } from '@/lib/glenn-sound'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface GlennGateProps {
  progress: number // 0-100 loading progress
  ready: boolean // assets ready
  onEnter: (withSound: boolean) => void // parent mounts the gallery behind
  onExited: () => void // gate calls this when the reveal finishes
}

/* Original gated-entry screen inspired by the reference flow:
   light "Loading Assets x/100" phase, then dark "Enter" phase, then a
   shutter reveal — the gate parts top/bottom with a theme-accent seam
   while the gallery rows animate in beneath it. All markup/styles our own.
   Reduced motion: plain quick fade, no shutter. */
export function GlennGate({ progress, ready, onEnter, onExited }: GlennGateProps) {
  const [count, setCount] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'enter'>('loading')
  const [leaving, setLeaving] = useState(false)
  const exitTimer = useRef<number | null>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    let raf = 0
    const tick = () => {
      setCount((c) => {
        const target = Math.max(0, Math.min(100, Math.round(progress)))
        if (c >= target) return target
        return c + Math.max(1, Math.ceil((target - c) / 6))
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progress])

  useEffect(() => {
    if (ready && count >= 100) {
      const t = setTimeout(() => setPhase('enter'), 450)
      return () => clearTimeout(t)
    }
  }, [ready, count])

  useEffect(
    () => () => {
      if (exitTimer.current !== null) window.clearTimeout(exitTimer.current)
    },
    []
  )

  if (phase === 'loading') {
    return (
      <div className="glenn-gate" role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={100} aria-label="Loading assets">
        <div className="glenn-gate-top">
          <div>Loading</div>
          <div>Assets</div>
        </div>
        <div className="glenn-gate-bottom">
          <div className="glenn-gate-count">
            <span>{count}</span>
            <span style={{ opacity: 0.5 }}>/100</span>
          </div>
        </div>
      </div>
    )
  }

  const enter = (withSound: boolean) => {
    if (leaving) return
    setGlennSoundOn(withSound)
    if (withSound) {
      glennBlip(660, 0.09, 0.05)
      glennWhoosh()
    }
    setLeaving(true)
    onEnter(withSound)
    // Shutter run-time (CSS) is ~1.05s; reduced motion collapses it.
    exitTimer.current = window.setTimeout(onExited, prefersReduced ? 350 : 1150)
  }

  return (
    <div
      className={`glenn-gate glenn-gate-dark${leaving ? ' is-leaving' : ''}`}
      role="dialog"
      aria-label="Enter portfolio"
      aria-hidden={leaving}
    >
      <div className="glenn-shutter glenn-shutter-top" aria-hidden="true" />
      <div className="glenn-shutter glenn-shutter-bottom" aria-hidden="true" />
      <div className="glenn-seam" aria-hidden="true" />
      <div className="glenn-gate-center">
        <h1 className="glenn-gate-title">
          <span style={{ display: 'block' }}>
            <em>MD Mehrab</em>
          </span>
          <span style={{ display: 'block' }}>Hossain</span>
        </h1>
        <p className="glenn-gate-sub">
          <span style={{ display: 'block' }}>Full-Stack</span>
          <span style={{ display: 'block' }}>Web Developer</span>
        </p>
        <button
          type="button"
          className="glenn-enter"
          onClick={() => enter(true)}
          onMouseEnter={() => glennBlip(440, 0.05, 0.02)}
          tabIndex={leaving ? -1 : undefined}
        >
          <span className="glenn-enter-dot" />
          <span>{leaving ? 'Welcome' : 'Enter'}</span>
          <span className="glenn-enter-dot" />
        </button>
      </div>
      {!leaving && (
        <button type="button" className="glenn-enter-quiet" onClick={() => enter(false)}>
          Enter without sound
        </button>
      )}
    </div>
  )
}

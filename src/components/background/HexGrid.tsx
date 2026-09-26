'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/* Living honeycomb — one canvas, one heat simulation, many moods.
   Every cell holds a heat value (0..1+). Each frame heat decays and
   the active pattern pours heat back in: cursor bloom, sweeping wave,
   breathing seeds, twinkles, ripples, drifting embers. Heat renders as
   fill + flared borders + vertex sparks, so light lingers and fades
   like something alive instead of snapping on and off.
   Patterns are switched live via the `effect` prop (see HexGridFxPanel).
   Static devices get a single painted frame. */

export type HexFx =
  | 'cursor'
  | 'wave'
  | 'vortex'
  | 'breathing'
  | 'twinkle'
  | 'ripple'
  | 'ember'
  | 'off'

export const HEX_FX_OPTIONS: HexFx[] = [
  'cursor',
  'wave',
  'vortex',
  'breathing',
  'twinkle',
  'ripple',
  'ember',
  'off',
]

export const HEX_FX_DEFAULT: HexFx = 'cursor'

const WAVE_PERIOD = 6000
const WAVE_SIGMA = 130
const CURSOR_RADIUS = 270
const RIPPLE_SPEED = 0.45 // px per ms
const RIPPLE_WIDTH = 130
const HEAT_DECAY = 2.1 // per second — visible trails, settles fast
const VORTEX_ARMS = 3
const VORTEX_TWIST = 0.0045 // spiral curl per px
const VORTEX_SPEED = 0.7 // radians per second
const VORTEX_SPREAD = 0.22 // arm thickness in radians — thin for crisp arms

type RGB = [number, number, number]

interface Cell {
  x: number
  y: number
  seed: number
  phase: number
  pts: [number, number][]
}

interface Ripple {
  x: number
  y: number
  t0: number
}

function parseRgb(value: string): RGB {
  const parts = value.split(',').map((s) => parseInt(s.trim(), 10))
  if (parts.length >= 3 && parts.every((n) => Number.isFinite(n))) {
    return [parts[0], parts[1], parts[2]]
  }
  return [0, 229, 255]
}

function cellRadius(): number {
  if (typeof window === 'undefined') return 30
  const w = window.innerWidth
  if (w < 640) return 20
  if (w < 1024) return 24
  return 30
}

/* Phones are NOT automatically weak — only actual low memory / few cores
   freeze the grid. (The shared useLowPerfDevice treats every small screen
   as low-perf, which would kill the animation on all mobile.) */
function useWeakDevice(): boolean {
  const [weak, setWeak] = useState(false)
  useEffect(() => {
    try {
      const nav = navigator as unknown as {
        deviceMemory?: number
        hardwareConcurrency?: number
      }
      const lowMem = nav.deviceMemory !== undefined && nav.deviceMemory < 4
      const lowCores =
        nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4
      setWeak(lowMem || lowCores)
    } catch {
      setWeak(false)
    }
  }, [])
  return weak
}

export function HexGrid({
  opacity = 0.34,
  effect = HEX_FX_DEFAULT,
  intensity = 1,
}: {
  opacity?: number
  effect?: HexFx
  intensity?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const intensityRef = useRef(intensity)
  const prefersReduced = useReducedMotion()
  const weakDevice = useWeakDevice()
  const staticMode = prefersReduced || weakDevice || effect === 'off'

  useEffect(() => {
    intensityRef.current = intensity
  }, [intensity])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let dpr = 1
    let R = 30
    let cells: Cell[] = []
    let heat = new Float32Array(0)
    let ripples: Ripple[] = []
    let lastAutoRipple = 0
    let rgb: RGB = [0, 229, 255]
    let raf = 0
    let running = true
    let last = 0

    const readTheme = () => {
      rgb = parseRgb(
        getComputedStyle(document.documentElement).getPropertyValue('--theme-rgb'),
      )
    }
    readTheme()
    const themeObs = new MutationObserver(readTheme)
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    })

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      R = cellRadius()
      const cw = Math.sqrt(3) * R
      const ch = 1.5 * R
      const cols = Math.ceil(w / cw) + 3
      const rows = Math.ceil(h / ch) + 4
      const next: Cell[] = []
      const prev = heat
      heat = new Float32Array(cols * rows)
      heat.set(prev.subarray(0, Math.min(prev.length, heat.length)))
      let i = 0
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++, i++) {
          const x = (c + 0.5 * (r & 1)) * cw - cw
          const y = r * ch - ch
          const seed = ((i * 2654435761) % 1000) / 1000
          const pts: [number, number][] = []
          for (let k = 0; k < 6; k++) {
            const a = (Math.PI / 180) * (60 * k - 30)
            pts.push([x + R * Math.cos(a), y + R * Math.sin(a)])
          }
          next.push({ x, y, seed, phase: seed * Math.PI * 2, pts })
        }
      }
      cells = next
    }

    const trace = (pts: [number, number][]) => {
      ctx.beginPath()
      ctx.moveTo(pts[0][0], pts[0][1])
      for (let k = 1; k < 6; k++) ctx.lineTo(pts[k][0], pts[k][1])
      ctx.closePath()
    }

    const paint = (now: number, dt: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.lineJoin = 'round'
      const t = now / 1000
      const k = intensityRef.current
      const [r, g, b] = rgb
      const m = mouseRef.current
      const maxR = Math.hypot(w, h)

      // --- wavefront position (wave mode) ---
      const p = (now % WAVE_PERIOD) / WAVE_PERIOD
      const band = WAVE_SIGMA * 2.2
      const front = -band + p * (w + band * 2)

      // --- autonomous ripple source (ripple mode) ---
      if (effect === 'ripple' && now - lastAutoRipple > 3800 && cells.length > 0) {
        lastAutoRipple = now
        const c = cells[(Math.random() * cells.length) | 0]
        ripples.push({ x: c.x, y: c.y, t0: now })
      }

      // --- ember drift blobs (ember mode) ---
      const embers =
        effect === 'ember'
          ? [
              {
                x: w * (0.5 + 0.42 * Math.sin(t * 0.21)),
                y: h * (0.5 + 0.36 * Math.cos(t * 0.16 + 1.3)),
                s: 170,
              },
              {
                x: w * (0.5 + 0.4 * Math.sin(t * 0.13 + 2.1)),
                y: h * (0.5 + 0.38 * Math.cos(t * 0.19 + 0.4)),
                s: 210,
              },
              {
                x: w * (0.5 + 0.44 * Math.cos(t * 0.17 + 4.2)),
                y: h * (0.5 + 0.4 * Math.sin(t * 0.23 + 2.8)),
                s: 140,
              },
            ]
          : []

      // --- twinkle shots (twinkle mode) ---
      if (effect === 'twinkle' && cells.length > 0) {
        for (let s = 0; s < 4; s++) {
          const idx = (Math.random() * cells.length) | 0
          heat[idx] = Math.max(heat[idx], 0.9 + Math.random() * 0.4)
        }
      }

      // --- live ripples ---
      ripples = ripples.filter((rp) => (now - rp.t0) * RIPPLE_SPEED < maxR + RIPPLE_WIDTH)

      const decay = Math.exp(-HEAT_DECAY * dt)

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i]
        if (cell.x < -R * 2 || cell.x > w + R * 2 || cell.y < -R * 2 || cell.y > h + R * 2) {
          continue
        }

        let add = 0

        // cursor bloom — only in its own mode. Every pattern is pure:
        // the touched hex burns brightest and each connected ring steps down
        if (m.active && effect === 'cursor') {
          const mdx = cell.x - m.x
          const mdy = cell.y - m.y
          const d = Math.sqrt(mdx * mdx + mdy * mdy)
          if (d < CURSOR_RADIUS) {
            const ring = Math.floor(d / (R * 1.1))
            add = Math.max(add, 1 / (1 + ring * 0.55))
          }
        }

        if (effect === 'wave') {
          const dx = cell.x - front
          add = Math.max(add, Math.exp(-(dx * dx) / (2 * WAVE_SIGMA * WAVE_SIGMA)))
        }

        if (effect === 'breathing' && cell.seed < 0.08) {
          const pulse = 0.5 + 0.5 * Math.sin(t * 0.9 + cell.phase)
          add = Math.max(add, (0.25 + 0.75 * pulse) * 0.9)
        }

        if (effect === 'vortex') {
          const vdx = cell.x - w / 2
          const vdy = cell.y - h / 2
          const dist = Math.sqrt(vdx * vdx + vdy * vdy)
          const ang = Math.atan2(vdy, vdx)
          const sector = (Math.PI * 2) / VORTEX_ARMS
          let rel =
            (ang - dist * VORTEX_TWIST - t * VORTEX_SPEED) % sector
          if (rel < 0) rel += sector
          const prox = Math.exp(-(rel * rel) / (2 * VORTEX_SPREAD * VORTEX_SPREAD))
          const fade = Math.exp(-dist / (maxR * 0.7))
          add = Math.max(add, prox * fade * 1.1)
          const corePulse = 0.6 + 0.4 * Math.sin(t * 2)
          add = Math.max(
            add,
            Math.exp(-(dist * dist) / (2 * 90 * 90)) * corePulse,
          )
        }

        if (effect === 'ember') {
          for (const e of embers) {
            const edx = cell.x - e.x
            const edy = cell.y - e.y
            add = Math.max(add, Math.exp(-(edx * edx + edy * edy) / (2 * e.s * e.s)))
          }
        }

        for (const rp of ripples) {
          const rdx = cell.x - rp.x
          const rdy = cell.y - rp.y
          const d = Math.sqrt(rdx * rdx + rdy * rdy)
          const radius = (now - rp.t0) * RIPPLE_SPEED
          const fade = Math.max(0, 1 - radius / maxR)
          const dd = d - radius
          if (Math.abs(dd) < RIPPLE_WIDTH && fade > 0) {
            add = Math.max(
              add,
              Math.exp(-(dd * dd) / (2 * 60 * 60)) * fade,
            )
          }
        }

        heat[i] = add > heat[i] ? add : heat[i] * decay

        const glow = Math.min(heat[i] * k, 1.15)

        trace(cell.pts)
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.26 + 0.65 * glow})`
        ctx.lineWidth = 1 + 2.2 * glow
        ctx.stroke()

        if (glow > 0.03) {
          trace(cell.pts)
          ctx.fillStyle = `rgba(${r},${g},${b},${0.32 * glow})`
          ctx.fill()
          if (glow > 0.3) {
            trace(cell.pts)
            ctx.fillStyle = `rgba(255,255,255,${0.14 * ((glow - 0.3) / 0.85)})`
            ctx.fill()
          }
          ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, glow)})`
          const vr = 1.2 + 2.4 * glow
          for (const [px, py] of cell.pts) {
            ctx.beginPath()
            ctx.arc(px, py, vr, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }

    const loop = (now: number) => {
      if (!running) return
      const dt = Math.min((now - last) / 1000 || 0.016, 0.05)
      last = now
      paint(now, dt)
      raf = requestAnimationFrame(loop)
    }

    const onResize = () => {
      build()
      if (staticMode) paint(1200, 0.016)
    }

    const onPointerMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      mouseRef.current.active = true
    }

    const onLeave = () => {
      mouseRef.current.active = false
    }

    const onDown = (e: PointerEvent) => {
      // a tap is also a touch of the grid — seed the cursor bloom
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      mouseRef.current.active = true
      // click shockwaves in Cursor Bloom and Ripple modes
      if (effect !== 'ripple' && effect !== 'cursor') return
      ripples.push({ x: e.clientX, y: e.clientY, t0: performance.now() })
    }

    const onUp = (e: PointerEvent) => {
      // touch over: let the bloom fade instead of sticking;
      // mouse keeps glowing while it hovers
      if (e.pointerType !== 'mouse') mouseRef.current.active = false
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!staticMode) {
        running = true
        last = performance.now()
        raf = requestAnimationFrame(loop)
      } else {
        paint(1200, 0.016)
      }
    }

    build()
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    if (staticMode) {
      paint(1200, 0.016)
    } else {
      window.addEventListener('pointermove', onPointerMove)
      document.documentElement.addEventListener('mouseleave', onLeave)
      window.addEventListener('pointerdown', onDown)
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onUp)
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }

    return () => {
      running = false
      cancelAnimationFrame(raf)
      themeObs.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [staticMode, effect])

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 2,
        opacity,
        maskImage:
          'linear-gradient(180deg, transparent 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(180deg, transparent 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { HexGrid } from '@/components/background/HexGrid'

/* Original lightweight backdrop: dark gradient + two slow drifting
   glows + theme-colored hex grid + subtle film grain painted on canvas.
   The hex grid reuses the site's own HexGrid (theme-rgb strokes), so the
   8-color engine textures the room too. Respects reduced motion. */
export function GlennBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    const DPR = Math.min(1.5, window.devicePixelRatio || 1)

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * DPR)
      canvas.height = Math.floor(h * DPR)
    }
    resize()
    window.addEventListener('resize', resize)

    // pre-render a small grain tile
    const tile = document.createElement('canvas')
    tile.width = 128
    tile.height = 128
    const tctx = tile.getContext('2d')
    if (tctx) {
      const img = tctx.createImageData(128, 128)
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.floor(Math.random() * 255)
        img.data[i] = v
        img.data[i + 1] = v
        img.data[i + 2] = v
        img.data[i + 3] = 14
      }
      tctx.putImageData(img, 0, 0)
    }

    const start = performance.now()
    /* Theme lighting: sample --glenn-accent (driven by the 8-color engine)
       so the gallery glow follows the chosen theme. Refreshed lazily inside
       the loop so auto-cycle retints the room without any subscription. */
    let accent: [number, number, number] = [255, 255, 255]
    let frames = 0
    const readAccent = () => {
      try {
        const host = document.querySelector('.glenn-root') ?? document.body
        const v = getComputedStyle(host).getPropertyValue('--glenn-accent').trim()
        const m3 = /^#([0-9a-f]{6})$/i.exec(v)
        if (m3) {
          const n = parseInt(m3[1], 16)
          accent = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
          return
        }
        const m6 = /^rgba?\(([^)]+)\)$/i.exec(v)
        if (m6) {
          const parts = m6[1].split(',').map((s) => parseFloat(s.trim()))
          if (parts.length >= 3 && parts.every((n) => Number.isFinite(n))) {
            accent = [parts[0], parts[1], parts[2]]
          }
        }
      } catch {
        /* keep last */
      }
    }
    readAccent()
    const render = (now: number) => {
      const t = (now - start) / 1000
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      ctx.clearRect(0, 0, w, h)

      frames += 1
      if (frames % 60 === 0) readAccent()
      const [ar, ag, ab] = accent

      const drift = reduced ? 0 : t
      // glow A — top
      const ax = w * (0.5 + 0.08 * Math.sin(drift * 0.11))
      const ay = h * (0.28 + 0.05 * Math.cos(drift * 0.09))
      let g = ctx.createRadialGradient(ax, ay, 0, ax, ay, Math.max(w, h) * 0.55)
      g.addColorStop(0, `rgba(${ar},${ag},${ab},0.055)`)
      g.addColorStop(1, `rgba(${ar},${ag},${ab},0)`)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      // glow B — bottom
      const bx = w * (0.5 + 0.1 * Math.cos(drift * 0.07))
      const by = h * (0.85 + 0.04 * Math.sin(drift * 0.08))
      g = ctx.createRadialGradient(bx, by, 0, bx, by, Math.max(w, h) * 0.5)
      g.addColorStop(0, `rgba(${ar},${ag},${ab},0.035)`)
      g.addColorStop(1, `rgba(${ar},${ag},${ab},0)`)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      // grain
      if (tile.width) {
        const pattern = ctx.createPattern(tile, 'repeat')
        if (pattern) {
          ctx.save()
          ctx.globalAlpha = 0.5
          ctx.fillStyle = pattern
          ctx.fillRect(0, 0, w, h)
          ctx.restore()
        }
      }

      if (!reduced) raf = requestAnimationFrame(render)
    }

    if (reduced) {
      render(performance.now())
    } else {
      raf = requestAnimationFrame(render)
    }
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  return (
    <div className="glenn-backdrop" aria-hidden="true">
      <canvas ref={canvasRef} />
      <HexGrid />
    </div>
  )
}

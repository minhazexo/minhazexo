'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { themes } from '@/data/themes'
import { setThemeAutoCycle } from '@/hooks/useThemeAutoCycle'
import { glennBlip } from '@/lib/glenn-sound'
import { useHexFx, setHexFx, setHexIntensity } from '@/components/background/hexFxStore'
import { HEX_FX_OPTIONS } from '@/components/background/HexGridFxPanel'
import { LINKS, Roll } from './GlennNav'

const EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1]

/* Phone-only top bar: logo tile + the 8 accent dots + a hamburger that
   drops the full menu (links, CV, hexgrid effects). Desktop keeps the
   original top-right pill nav — the two never show at once (glenn.css
   swaps them at 640px). Class prefix `mnav-` keeps every selector out
   of the reach of the desktop nav tests. */
export function GlennMobileNav({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { effect, intensity } = useHexFx()
  const sheetRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  /* Focus moves into the sheet on open and returns to the toggle on
     close — but never on first mount, so the entry gate keeps focus. */
  useEffect(() => {
    if (open) {
      wasOpen.current = true
      sheetRef.current?.focus()
    } else if (wasOpen.current) {
      wasOpen.current = false
      toggleRef.current?.focus()
    }
  }, [open])

  /* Escape closes; background stops scrolling while it's open. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  const close = () => setOpen(false)

  const toggle = () => {
    glennBlip(open ? 420 : 660, 0.06, 0.03)
    setOpen((o) => !o)
  }

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    glennBlip(600, 0.06, 0.03)
    setOpen(false)
    onNavigate(href)
  }

  const pickAccent = (value: string) => {
    setThemeAutoCycle(false)
    setTheme(value)
    glennBlip(700, 0.06, 0.03)
  }

  const pickFx = (id: (typeof HEX_FX_OPTIONS)[number]['id']) => {
    setHexFx(id)
    glennBlip(id === 'off' ? 380 : 740, 0.06, 0.03)
  }

  return (
    <div className="glenn-mobile-nav">
      <div className="mnav-bar">
        <a className="mnav-logo" href="#projects" onClick={go('#projects')} aria-label="minhazexo — back to index">
          <img src="/favicon_io/android-chrome-192x192.png" alt="" width={40} height={40} />
        </a>

        <div className="mnav-dots" role="group" aria-label="Accent color">
          {themes.map((t) => (
            <button
              key={t.value}
              type="button"
              className={`mnav-dot${theme === t.value ? ' is-active' : ''}`}
              style={{ ['--dot' as string]: t.color }}
              onClick={() => pickAccent(t.value)}
              aria-label={`Accent color: ${t.name}`}
              aria-pressed={theme === t.value}
              title={t.name}
            />
          ))}
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="mnav-toggle"
          onClick={toggle}
          aria-expanded={open}
          aria-controls="mnav-sheet"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            className="mnav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
          />
        )}
        {open && (
          <motion.div
            key="sheet"
            id="mnav-sheet"
            ref={sheetRef}
            className="mnav-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            tabIndex={-1}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45, ease: EXPO }}
          >
            <div className="mnav-pills">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  className="glenn-pill"
                  href={l.href}
                  onClick={go(l.href)}
                  onMouseEnter={() => glennBlip(480, 0.04, 0.02)}
                >
                  <Roll text={l.label} />
                </a>
              ))}
              <a
                className="glenn-pill"
                href="mailto:mehrabhossain7102@gmail.com"
                onClick={close}
                onMouseEnter={() => glennBlip(480, 0.04, 0.02)}
              >
                <Roll text="Email" />
              </a>
            </div>

            <a
              className="glenn-pill mnav-cv"
              href="/api/cv"
              download="Minhaz-CV.pdf"
              onClick={close}
              onMouseEnter={() => glennBlip(480, 0.04, 0.02)}
              style={{ background: 'var(--glenn-accent)', borderColor: 'var(--glenn-accent)' }}
            >
              <Roll text="Download CV" />
            </a>

            <div className="mnav-section">
              <h2 className="mnav-heading">Hexgrid animation</h2>
              <div className="mnav-fx">
                {HEX_FX_OPTIONS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    className={`mnav-fx-chip${effect === id ? ' is-active' : ''}`}
                    onClick={() => pickFx(id)}
                    aria-pressed={effect === id}
                  >
                    <Icon size={13} aria-hidden="true" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {effect !== 'off' && (
                <label className="mnav-intensity">
                  <span className="mnav-intensity-label">
                    Intensity <em>{Math.round(intensity * 100)}%</em>
                  </span>
                  <input
                    type="range"
                    min={0.4}
                    max={1.6}
                    step={0.1}
                    value={intensity}
                    onChange={(e) => setHexIntensity(Number(e.target.value))}
                    aria-label="Glow intensity"
                  />
                </label>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

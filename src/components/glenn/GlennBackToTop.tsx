'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { glennBlip } from '@/lib/glenn-sound'

/* Original mono back-to-top, bottom-left (sound toggle owns bottom-right).
   Steps aside while the contact section or footer is on screen so the
   fixed button never covers the send control or footer links. */
export function GlennBackToTop() {
  const [pastFold, setPastFold] = useState(false)
  const [nearEnd, setNearEnd] = useState(false)

  useEffect(() => {
    const onScroll = () => setPastFold(window.scrollY > 900)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const targets = [document.getElementById('contact'), document.querySelector('.glenn-footer')].filter(
      (el): el is Element => el !== null
    )
    if (targets.length === 0) return
    const obs = new IntersectionObserver(
      (entries) => setNearEnd(entries.some((e) => e.isIntersecting)),
      { threshold: 0.08 }
    )
    targets.forEach((t) => obs.observe(t))
    return () => obs.disconnect()
  }, [])

  const show = pastFold && !nearEnd

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          className="glenn-top"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            glennBlip(600, 0.06, 0.03)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          aria-label="Back to top"
        >
          Top ↑
        </motion.button>
      )}
    </AnimatePresence>
  )
}

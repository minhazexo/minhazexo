'use client'

import { GlennNav } from '@/components/glenn/GlennNav'

/* Glenn-style top-right pill nav. Keeps the same export name so
   existing imports keep working. Full menu lives in the index. */
export function Navigation() {
  const handleNavigate = (href: string) => {
    if (href.startsWith('mailto:')) {
      window.location.href = href
      return
    }
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return <GlennNav onNavigate={handleNavigate} />
}

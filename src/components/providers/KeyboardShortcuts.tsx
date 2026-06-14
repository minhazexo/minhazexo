'use client'

import { useEffect, useState } from 'react'

const shortcuts = [
  { key: 'h', section: 'hero', label: 'Scroll to Home' },
  { key: 'a', section: 'about', label: 'Scroll to About' },
  { key: 'p', section: 'projects', label: 'Scroll to Projects' },
  { key: 's', section: 'skills', label: 'Scroll to Skills' },
  { key: 'c', section: 'contact', label: 'Scroll to Contact' },
  { key: 'k', section: 'shortcuts', label: 'Toggle this menu' },
]

const sectionSelectors: Record<string, string> = {
  hero: '#hero-section',
  about: '#about-section',
  projects: '#projects-section',
  skills: '#skills-section',
  contact: '#contact-section',
}

export function KeyboardShortcutProvider({ children }: { children: React.ReactNode }) {
  const [showHints, setShowHints] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      const key = e.key.toLowerCase()

      if (key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setShowHints(prev => !prev)
        return
      }

      const shortcut = shortcuts.find(s => s.key === key && s.section !== 'shortcuts')
      if (shortcut && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        const el = document.querySelector(sectionSelectors[shortcut.section])
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {children}
      {showHints && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowHints(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
        >
          <div
            className="bg-[var(--bg-secondary)] border border-white/10 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-white mb-4 font-heading">Keyboard Shortcuts</h2>
            <ul className="space-y-2">
              {shortcuts.map(s => (
                <li key={s.key} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{s.label}</span>
                  <kbd className="px-2 py-0.5 bg-white/10 rounded text-white font-mono text-xs border border-white/10">
                    {s.key === 'k' ? 'CMD+K' : s.key.toUpperCase()}
                  </kbd>
                </li>
              ))}
            </ul>
            <p className="text-gray-500 text-xs mt-4 text-center">Press CMD+K to toggle</p>
          </div>
        </div>
      )}
    </>
  )
}

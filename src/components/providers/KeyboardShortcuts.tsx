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
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: 24,
                maxWidth: 384,
                width: 'calc(100% - 32px)',
                margin: '0 16px',
                boxShadow: 'var(--shadow-large)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Keyboard Shortcuts</h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {shortcuts.map(s => (
                  <li key={s.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                    <kbd style={{
                      padding: '2px 8px', borderRadius: 6,
                      background: 'var(--glass-bg)', color: 'var(--text)',
                      fontFamily: 'var(--font-mono)', fontSize: 12,
                      border: '1px solid var(--border)',
                    }}>
                      {s.key === 'k' ? 'CMD+K' : s.key.toUpperCase()}
                    </kbd>
                  </li>
                ))}
              </ul>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 16, textAlign: 'center' }}>Press CMD+K to toggle</p>
            </div>
        </div>
      )}
    </>
  )
}

'use client'

import { glennBlip } from '@/lib/glenn-sound'

function Roll({ text }: { text: string }) {
  return (
    <span className="glenn-roll">
      <span>{text}</span>
      <span aria-hidden="true">{text}</span>
    </span>
  )
}

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Index', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

/* Original top-right pill nav. Keeps anchor behaviour of the old site. */
export function GlennNav({ onNavigate }: { onNavigate: (href: string) => void }) {
  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    glennBlip(600, 0.06, 0.03)
    onNavigate(href)
  }

  return (
    <nav className="glenn-nav" aria-label="Primary">
      <ul>
        {LINKS.map((l) => (
          <li key={l.label}>
            <a className="glenn-pill" href={l.href} onClick={go(l.href)} onMouseEnter={() => glennBlip(480, 0.04, 0.02)}>
              <Roll text={l.label} />
            </a>
          </li>
        ))}
        <li>
          <a className="glenn-pill" href="mailto:mehrabhossain7102@gmail.com" onMouseEnter={() => glennBlip(480, 0.04, 0.02)}>
            <Roll text="Email" />
          </a>
        </li>
        <li>
          <a
            className="glenn-pill"
            href="/api/cv"
            download="Minhaz-CV.pdf"
            onMouseEnter={() => glennBlip(480, 0.04, 0.02)}
            style={{ background: 'var(--glenn-accent)', borderColor: 'var(--glenn-accent)' }}
          >
            <Roll text="Download CV" />
          </a>
        </li>
      </ul>
    </nav>
  )
}

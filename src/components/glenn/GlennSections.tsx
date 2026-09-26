'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlennThemeDots } from '@/components/glenn/GlennThemeDots'
import type { Testimonial } from '@/types'

const EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1]

function Block({
  id,
  kicker,
  title,
  lede,
  children,
}: {
  id: string
  kicker: string
  title: React.ReactNode
  lede?: string
  children: React.ReactNode
}) {
  return (
    <section className="glenn-section" id={id}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: EXPO }}
      >
        <p className="glenn-kicker">{kicker}</p>
        <h2 className="glenn-h2">{title}</h2>
        {lede && <p className="glenn-lede">{lede}</p>}
        {children}
      </motion.div>
    </section>
  )
}

/* Original lower-page sections reusing the owner's real data.
   Only the presentation language (mono labels + display headers)
   follows the reference feel. */
export function GlennAbout({ paragraphs }: { paragraphs: string[] }) {
  return (
    <Block id="about" kicker="About" title={<>Behind <em>the work</em></>} lede="Full-stack web developer crafting premium digital experiences.">
      <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem', maxWidth: '40rem' }}>
        {paragraphs.map((p, i) => (
          <p key={i} className="glenn-body">{p}</p>
        ))}
      </div>
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <a
          className="glenn-pill"
          href="/api/cv"
          download="Minhaz-CV.pdf"
          style={{ height: '2.4rem', padding: '0 1.2rem', background: 'var(--glenn-accent)', borderColor: 'var(--glenn-accent)' }}
        >
          <span className="glenn-roll"><span>Download CV</span><span aria-hidden="true">Download CV</span></span>
        </a>
      </div>
    </Block>
  )
}

export function GlennSkills({ groups }: { groups: { title: string; items: string[] }[] }) {
  return (
    <Block id="skills" kicker="Capabilities" title={<>What <em>I do</em></>} lede="Tools and disciplines I reach for on real projects.">
      <div className="glenn-cards">
        {groups.map((g) => (
          <div key={g.title} className="glenn-card">
            <h3>{g.title}</h3>
            <p>{g.items.join(' / ')}</p>
          </div>
        ))}
      </div>
    </Block>
  )
}

export function GlennExperience({ roles }: { roles: { role: string; company: string; period: string }[] }) {
  return (
    <Block id="experience" kicker="Experience" title={<>Where <em>I worked</em></>}>
      <ul className="glenn-list">
        {roles.map((r, i) => (
          <li key={i}>
            <strong>{r.role} — {r.company}</strong>
            <span>{r.period}</span>
          </li>
        ))}
      </ul>
    </Block>
  )
}

export function GlennTestimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null
  return (
    <Block id="testimonials" kicker="Word of mouth" title={<>Kind <em>words</em></>} lede="What clients and collaborators say.">
      <div className="glenn-quotes">
        {items.map((t) => (
          <figure key={t.id} className="glenn-quote">
            <span className="glenn-quote-stars" aria-label={`${t.rating} out of 5 stars`}>
              {'★'.repeat(Math.max(0, Math.min(5, t.rating)))}
            </span>
            <blockquote style={{ margin: 0 }}>
              <p>&ldquo;{t.content}&rdquo;</p>
            </blockquote>
            <footer>
              <span>{t.name} — {t.role}{t.company ? `, ${t.company}` : ''}</span>
            </footer>
          </figure>
        ))}
      </div>
    </Block>
  )
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function GlennContact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: '' }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (!form.name.trim()) er.name = 'Name is required'
    if (!form.email.trim()) er.email = 'Email is required'
    else if (!EMAIL_RE.test(form.email)) er.email = 'Invalid email'
    if (!form.message.trim()) er.message = 'Message is required'
    setErrors(er)
    if (Object.keys(er).length > 0) return

    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrors(body.errors || { message: body.error || 'Failed to send. Try again.' })
        return
      }
      setSent(true)
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setSent(false), 6000)
    } catch {
      setErrors({ message: 'Network error. Please check your connection.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <Block
      id="contact"
      kicker="Contact"
      title={<>Let&apos;s <em>talk</em></>}
      lede="Available for freelance work. Fastest reply by email."
    >
      <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <a className="glenn-pill" href="mailto:mehrabhossain7102@gmail.com" style={{ height: '2.4rem', padding: '0 1.2rem' }}>
          <span className="glenn-roll"><span>Email me</span><span aria-hidden="true">Email me</span></span>
        </a>
        <a className="glenn-pill" href="https://github.com/minhazexo" target="_blank" rel="noopener noreferrer" style={{ height: '2.4rem', padding: '0 1.2rem' }}>
          <span className="glenn-roll"><span>GitHub</span><span aria-hidden="true">GitHub</span></span>
        </a>
      </div>

      <form className="glenn-form" onSubmit={submit} noValidate>
        <div className="glenn-field">
          <label htmlFor="glenn-name">Name</label>
          <input id="glenn-name" type="text" value={form.name} onChange={set('name')} placeholder="Your name" autoComplete="name" />
          {errors.name && <p className="glenn-field-error">{errors.name}</p>}
        </div>
        <div className="glenn-field">
          <label htmlFor="glenn-email">Email</label>
          <input id="glenn-email" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" autoComplete="email" />
          {errors.email && <p className="glenn-field-error">{errors.email}</p>}
        </div>
        <div className="glenn-field">
          <label htmlFor="glenn-message">Message</label>
          <textarea id="glenn-message" rows={4} value={form.message} onChange={set('message')} placeholder="Tell me about your project..." />
          {errors.message && <p className="glenn-field-error">{errors.message}</p>}
        </div>
        {errors.message && typeof errors.message === 'string' && errors.name === undefined && errors.email === undefined && (
          <p className="glenn-field-error">{errors.message}</p>
        )}
        <div>
          <button type="submit" className="glenn-pill" disabled={sending} style={{ height: '2.4rem', padding: '0 1.4rem' }}>
            <span className="glenn-roll">
              <span>{sending ? 'Sending…' : sent ? 'Sent ✓' : 'Send message'}</span>
              <span aria-hidden="true">{sending ? 'Sending…' : sent ? 'Sent ✓' : 'Send message'}</span>
            </span>
          </button>
          {sent && <p className="glenn-form-status" role="status">Transmission sent — I&apos;ll reply soon.</p>}
        </div>
      </form>
    </Block>
  )
}

const FOOT_LINKS = [
  { label: 'Index', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Words', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

export function GlennFooter() {
  return (
    <footer className="glenn-footer">
      <div className="glenn-footer-inner" style={{ alignItems: 'center' }}>
        <span>© {new Date().getFullYear()} MD Mehrab Hossain</span>
        <GlennThemeDots />
        <span>
          {FOOT_LINKS.map((l, i) => (
            <span key={l.href}>
              {i > 0 && ' / '}
              <a href={l.href}>{l.label}</a>
            </span>
          ))}
          {' / '}
          <a href="mailto:mehrabhossain7102@gmail.com">Email</a>
        </span>
      </div>
    </footer>
  )
}

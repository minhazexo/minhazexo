'use client'

import { useState, useRef, useCallback, memo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Send, Check } from 'lucide-react'
import { SectionWrapper, cinematicEase } from '@/components/ui/SectionWrapper'
import { PremiumButton } from '@/components/ui/PremiumButton'

export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showConfirm, setShowConfirm] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const validate = useCallback((name: string, value: string) => {
    if (!value.trim()) return `${name} is required`
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email'
    return ''
  }, [])

  const handleChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: validate(field, value) }))
  }, [validate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    Object.entries(formData).forEach(([key, value]) => { const err = validate(key, value); if (err) newErrors[key] = err })
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Failed')
      setIsSubmitted(true)
      setShowConfirm(true)
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => { setIsSubmitted(false); setShowConfirm(false) }, 5000)
    } catch {
      setErrors({ message: 'Failed to send. Try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getError = (f: string) => errors[f] || ''

  return (
    <SectionWrapper
      id="contact"
      label="Connect"
      title={"Let's Connect"}
      subtitle={"Have a project in mind? Let's build something great together."}
      pt={6}
      pb={6}
    >
      <div ref={ref} style={{ maxWidth: 560, margin: '0 auto' }}>
        <motion.div
          style={{
            padding: 'var(--space-8) var(--space-9)',
            borderRadius: 'var(--radius-glass)',
            border: '1px solid var(--border)',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(var(--glass-blur))',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15, ease: cinematicEase }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {(['name', 'email', 'message'] as const).map((field) => (
              <div key={field}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 'var(--space-2)', letterSpacing: '0.05em' }}>
                  {field.toUpperCase()}
                </label>
                {field === 'message' ? (
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    rows={4}
                    className="input"
                    placeholder="Tell me about your project..."
                    style={{
                      borderColor: focusedField === 'message' ? 'var(--primary)' : 'var(--border)',
                      boxShadow: focusedField === 'message' ? '0 0 0 1px var(--primary)' : 'none',
                      resize: 'vertical',
                    }}
                  />
                ) : (
                  <input
                    type={field}
                    value={formData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    onFocus={() => setFocusedField(field)}
                    onBlur={() => setFocusedField(null)}
                    className="input"
                    placeholder={field === 'name' ? 'Your name' : 'your@email.com'}
                    style={{
                      borderColor: focusedField === field ? 'var(--primary)' : 'var(--border)',
                      boxShadow: focusedField === field ? '0 0 0 1px var(--primary)' : 'none',
                    }}
                  />
                )}
                {getError(field) && (
                  <p style={{ fontSize: 12, color: '#FF4B4B', marginTop: 4 }}>{getError(field)}</p>
                )}
              </div>
            ))}

            <PremiumButton type="submit" variant="primary" size="lg" disabled={isSubmitting || isSubmitted} icon={isSubmitted ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}>
              {isSubmitting ? 'Sending...' : isSubmitted ? 'Sent!' : 'Send Message'}
            </PremiumButton>
          </form>

          <div style={{ marginTop: 'var(--space-7)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--divider)', textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>Or reach out directly</p>
            <a href="mailto:mehrabhossain7102@gmail.com" style={{ fontSize: 14, color: 'var(--primary)' }}>
              mehrabhossain7102@gmail.com
            </a>
          </div>
        </motion.div>
      </div>

      {/* Confirmation overlay */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            style={{
              position: 'fixed', inset: 0, zIndex: 'var(--z-modal)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(5,7,10,0.7)', backdropFilter: 'blur(20px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{ textAlign: 'center' }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <div
                style={{
                  width: 72, height: 72, borderRadius: 'var(--radius-full)',
                  margin: '0 auto var(--space-5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--gradient-primary)',
                  boxShadow: '0 0 30px var(--glow-color)',
                }}
              >
                <Check style={{ width: 32, height: 32, color: '#fff' }} />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-2)' }}>Message Sent</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>I&apos;ll get back to you within 24-48 hours.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}

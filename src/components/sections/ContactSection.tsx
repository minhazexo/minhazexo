'use client'

import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Send, Rocket, Check, Signal, Radio, Satellite, Zap } from 'lucide-react'
import { contactSocialLinks } from '@/data/social'
import { SectionHeader } from '@/components/effects/CinematicSection'
import { cinematicEase } from '@/hooks/useCinematicReveal'

const CommunicationField = memo(function CommunicationField({ label, type, value, onChange, focused, onFocus, onBlur, error, placeholder }: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  error: string;
  placeholder: string;
}) {
  const fieldColors: Record<string, string> = {
    name: '#818cf8',
    email: '#a78bfa',
    message: '#6366f1',
  }
  const color = fieldColors[label] || '#6366f1'

  return (
    <div className="relative group">
      {/* Field label with signal icon */}
      <div className="flex items-center gap-2 mb-2">
        <motion.span
          animate={focused ? { rotate: [0, 20, -20, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <Radio className="w-3 h-3" style={{ color }} />
        </motion.span>
        <label className="font-mono text-xs tracking-wider" style={{ color }}>
          {`TRANSMISSION_${label.toUpperCase()}`}
        </label>
      </div>

      <motion.div
        className="relative rounded-lg overflow-hidden"
        animate={{
          boxShadow: focused
            ? `0 0 25px ${color}40`
            : 'none',
          borderColor: focused ? color : 'rgba(99,102,241,0.2)',
        }}
        style={{
          border: '1px solid rgba(99,102,241,0.2)',
          background: 'linear-gradient(135deg, rgba(15,15,35,0.8), rgba(30,10,60,0.4))',
        }}
      >
        {/* Signal strength bars - animate on focus */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-end gap-0.5 h-4" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full"
              style={{ backgroundColor: color }}
              animate={focused ? {
                height: [4, 8 + i * 4, 4],
                opacity: [0.3, 1, 0.3],
              } : {
                height: [4, 6, 4],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>

        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            rows={5}
            className="w-full bg-transparent px-4 py-3 text-white focus:outline-none text-sm font-mono resize-none pr-12"
            placeholder={placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? `${label}-error` : undefined}
            required
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            className="w-full bg-transparent px-4 py-3 text-white focus:outline-none text-sm font-mono pr-12"
            placeholder={placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? `${label}-error` : undefined}
            required
          />
        )}

        {/* Bottom scan line effect on focus */}
        {focused && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </motion.div>

      {error && (
        <motion.p
          className="text-red-400 text-xs mt-1 font-mono flex items-center gap-1"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Zap className="w-3 h-3" />
          {`ERROR: ${error}`}
        </motion.p>
      )}
    </div>
  )
})

const LaunchConfirmation = memo(function LaunchConfirmation({ isVisible }: { isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Message */}
          <motion.div
            className="relative text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Orbiting particles */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <motion.div
                className="absolute inset-0 rounded-full border border-indigo-500/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-4 rounded-full border border-purple-500/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.5)]">
                  <Check className="w-10 h-10 text-white" />
                </div>
              </motion.div>
            </div>

            <motion.h3
              className="text-3xl font-orbitron font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              TRANSMISSION SENT
            </motion.h3>
            <motion.p
              className="text-indigo-300 font-mono text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Your message has been launched into the cosmos.
              <br />
              I'll respond within 24-48 hours.
            </motion.p>

            {/* Decorative dots */}
            <div className="flex justify-center gap-2 mt-6">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-indigo-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

const PortalSocialLink = memo(function PortalSocialLink({ social, index, isInView }: {
  social: typeof contactSocialLinks[0];
  index: number;
  isInView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false)
  const angle = (index * 360) / contactSocialLinks.length
  const radius = 120

  return (
    <motion.div
      className="absolute"
      style={{
        left: `calc(50% + ${radius * Math.cos((angle * Math.PI) / 180)}px - 28px)`,
        top: `calc(50% + ${radius * Math.sin((angle * Math.PI) / 180)}px - 28px)`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 300 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative"
        aria-label={`${social.label} (opens in new tab)`}
      >
        {/* Portal ring effect */}
        <motion.div
          className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center relative"
          style={{
            background: isHovered
              ? `radial-gradient(circle, ${social.color}40, transparent)`
              : 'rgba(15,15,35,0.8)',
            border: `1px solid ${social.color}40`,
            boxShadow: isHovered
              ? `0 0 30px ${social.color}60, inset 0 0 20px ${social.color}20`
              : `0 0 10px ${social.color}20`,
          }}
          animate={isHovered ? { scale: 1.15 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <span className="w-6 h-6 relative z-10 flex items-center justify-center" style={{ color: isHovered ? social.color : `${social.color}80` }}>
            <social.icon className="w-5 h-5" />
          </span>
          
          {/* Orbiting dot */}
          {isHovered && (
            <motion.div
              className="absolute w-1 h-1 rounded-full"
              style={{ backgroundColor: social.color }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              // Position at top of circle
            >
              <div style={{
                position: 'absolute',
                width: 28,
                height: 1,
                top: -0.5,
                left: -14,
                background: `linear-gradient(90deg, transparent, ${social.color}60, transparent)`,
              }} />
            </motion.div>
          )}
        </motion.div>
      </a>
    </motion.div>
  )
})

export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showLaunchConfirm, setShowLaunchConfirm] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const validateField = useCallback((name: string, value: string) => {
    if (!value.trim()) {
      return `${name} is required`
    }
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address'
    }
    return ''
  }, [])

  const handleChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    const error = validateField(field, value)
    setErrors((prev) => ({ ...prev, [field]: error }))
  }, [validateField])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: Record<string, string> = {}
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value)
      if (error) newErrors[key] = error
    })
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message')
      }

      setIsSubmitted(true)
      setShowLaunchConfirm(true)
      setFormData({ name: '', email: '', message: '' })
      setSubmissionError(null)
      
      setTimeout(() => {
        setIsSubmitted(false)
        setShowLaunchConfirm(false)
      }, 5000)
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmissionError(error instanceof Error ? error.message : 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldError = (field: string) => errors[field] || ''

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true)
    updateOnlineStatus()

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-24 relative overflow-hidden"
      aria-label="Contact"
    >
      {/* Background communication grid */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, #6366f1 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }} />

      {/* Floating signal indicators */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-indigo-400/30 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 4 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <SectionHeader
          label="// transmit_signal"
          title="CONNECT"
          subtitle="Initiate communication with the command center"
          isInView={isInView}
        />

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Communication Array - Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div
              className="rounded-2xl p-6 md:p-8 border border-indigo-500/10"
              style={{
                background: 'linear-gradient(135deg, rgba(15,15,35,0.9), rgba(30,10,60,0.4))',
                boxShadow: '0 0 40px rgba(99,102,241,0.05)',
              }}
            >
              {/* Communication Array Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-indigo-500/10">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Satellite className="w-5 h-5 text-indigo-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-mono text-indigo-300">COMM_ARRAY</h3>
                    <p className="text-[10px] font-mono text-indigo-500/60">STATUS: ONLINE</p>
                  </div>
                </div>
                <motion.div
                  className="flex items-center gap-1.5"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Signal className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-mono text-accent-muted">SIGNAL_ACTIVE</span>
                </motion.div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <CommunicationField
                  label="name"
                  type="text"
                  value={formData.name}
                  onChange={(v) => handleChange('name', v)}
                  focused={focusedField === 'name'}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  error={getFieldError('name')}
                  placeholder="Identify yourself..."
                />

                <CommunicationField
                  label="email"
                  type="email"
                  value={formData.email}
                  onChange={(v) => handleChange('email', v)}
                  focused={focusedField === 'email'}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  error={getFieldError('email')}
                  placeholder="Transmission return address..."
                />

                <CommunicationField
                  label="message"
                  type="textarea"
                  value={formData.message}
                  onChange={(v) => handleChange('message', v)}
                  focused={focusedField === 'message'}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  error={getFieldError('message')}
                  placeholder="Compose your transmission..."
                />

                {/* Submit Button - Launch styled */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className="relative w-full py-4 rounded-lg font-mono text-sm font-bold tracking-wider overflow-hidden group"
                  style={{
                    background: isSubmitted
                      ? 'linear-gradient(135deg, #059669, #10b981)'
                      : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    boxShadow: isSubmitted
                      ? '0 0 30px rgba(5,150,105,0.3)'
                      : '0 0 30px rgba(99,102,241,0.2)',
                  }}
                  whileHover={{ scale: isSubmitting || isSubmitted ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting || isSubmitted ? 1 : 0.98 }}
                >
                  {/* Animated background sweep */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    aria-hidden="true"
                  />

                  <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        TRANSMITTING...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <Check className="w-5 h-5" />
                        TRANSMISSION SENT
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                        LAUNCH TRANSMISSION
                      </>
                    )}
                  </span>
                </motion.button>
              </form>

              {submissionError && (
                <motion.div
                  role="alert"
                  className="text-red-400 text-sm font-mono mt-4 p-3 rounded-lg border border-red-500/20 bg-red-500/5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Zap className="w-3 h-3 inline-block mr-1" />
                  {submissionError}
                </motion.div>
              )}

              {/* Bottom status bar */}
              <div className="mt-6 pt-4 border-t border-indigo-500/10 flex items-center justify-between text-[10px] font-mono text-indigo-500/40">
                <span>ENCRYPTION: AES-256</span>
                <span>NODE: {isOnline ? 'ONLINE' : 'OFFLINE'}</span>
              </div>
            </div>
          </motion.div>

          {/* Portal Social Links */}
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: cinematicEase, delay: 0.3 }}
          >
            <div className="relative w-72 h-72 md:w-80 md:h-80">
              {/* Outer portal ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-indigo-500/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-3 rounded-full border border-purple-500/10"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />
              
              {/* Social links positioned on ring */}
              {contactSocialLinks.map((social, i) => (
                <PortalSocialLink
                  key={social.label}
                  social={social}
                  index={i}
                  isInView={isInView}
                />
              ))}

              {/* Center Core - Portal */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, rgba(99,102,241,0.3), rgba(79,70,229,0.1))',
                  border: '1px solid rgba(99,102,241,0.3)',
                  boxShadow: '0 0 40px rgba(99,102,241,0.2), inset 0 0 30px rgba(99,102,241,0.1)',
                }}
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 40px rgba(99,102,241,0.2), inset 0 0 30px rgba(99,102,241,0.1)',
                    '0 0 60px rgba(99,102,241,0.3), inset 0 0 40px rgba(99,102,241,0.15)',
                    '0 0 40px rgba(99,102,241,0.2), inset 0 0 30px rgba(99,102,241,0.1)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Rocket className="w-8 h-8 md:w-10 md:h-10 text-indigo-300" />
              </motion.div>
            </div>

            {/* Email Link */}
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
            >
              <p className="text-indigo-500/60 text-xs font-mono mb-2">
                {'// direct_channel'}
              </p>
              <a
                href="mailto:mehrabhossain7102@gmail.com"
                className="text-indigo-300 hover:text-indigo-200 transition-colors font-mono text-sm tracking-wide"
                style={{
                  textShadow: '0 0 20px rgba(99,102,241,0.3)',
                }}
                aria-label="Send email to mehrabhossain7102@gmail.com"
              >
                mehrabhossain7102@gmail.com
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Launch Confirmation Overlay */}
      <LaunchConfirmation isVisible={showLaunchConfirm} />
    </section>
  )
}

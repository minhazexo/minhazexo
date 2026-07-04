'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { navLinks } from '@/data/navigation'
import { themes } from '@/data/themes'

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const mode = document.documentElement.getAttribute('data-mode')
    setIsDark(mode !== 'light')
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.setAttribute('data-mode', next ? 'dark' : 'light')
  }

  return (
    <motion.button
      onClick={toggle}
      style={{
        width: 54,
        height: 30,
        borderRadius: 999,
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: 'var(--glass-border)',
        cursor: 'pointer',
        position: 'relative',
        flexShrink: 0,
        outline: 'none',
      }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 2,
          left: 2,
          width: 24,
          height: 24,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(12px)',
          border: 'var(--glass-border)',
        }}
        animate={{ x: isDark ? 0 : 26 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {isDark ? (
          <Moon style={{ width: 12, height: 12, color: 'var(--primary)' }} />
        ) : (
          <Sun style={{ width: 12, height: 12, color: 'var(--primary)' }} />
        )}
      </motion.div>
    </motion.button>
  )
}

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
      const sections = navLinks.map(link => link.href.replace('#', ''))
      for (const section of sections.reverse()) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150) { setActiveSection(section); break }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [isMobileOpen])

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <header
        className="fixed left-1/2 z-nav"
        style={{
          top: isScrolled ? '16px' : '24px',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '1240px',
          transition: 'top 300ms ease',
        }}
      >
        <nav
          className="flex items-center justify-between"
          style={{
            height: isScrolled ? '68px' : '72px',
            padding: '8px',
            paddingLeft: '20px',
            paddingRight: '20px',
            borderRadius: '999px',
            background: 'var(--glass-bg)',
            backdropFilter: 'saturate(180%) blur(28px)',
            WebkitBackdropFilter: 'saturate(180%) blur(28px)',
            border: 'var(--glass-border)',
            overflow: 'hidden',
            boxShadow: isScrolled ? '0 20px 60px rgba(0,0,0,0.45)' : '0 18px 60px rgba(0,0,0,0.38)',
            transition: 'height 300ms ease, box-shadow 300ms ease',
          }}
          aria-label="Main navigation"
        >
          {/* Logo */}
          <motion.a
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleNavClick('#hero') }}
            className="flex items-center gap-3"
            style={{ width: '220px' }}
            whileHover={{ scale: 1.05, rotate: 3 }}
            transition={{ duration: 0.3 }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-glass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 700,
                color: '#fff',
                background: 'var(--gradient-primary)',
                boxShadow: '0 0 20px var(--glow-color)',
              }}
            >
              M
            </div>
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: 'var(--text)',
              }}
              className="hidden sm:block"
            >
              minhazexo
            </span>
          </motion.a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center" style={{ gap: '36px' }}>
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '')
              const isActive = activeSection === sectionId
              return (
                <motion.button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="relative font-medium transition-colors"
                  style={{
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: 15,
                  }}
                  whileHover={{ color: 'var(--primary)', scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -bottom-1 left-0 right-0"
                      style={{ height: 2, borderRadius: '999px' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '999px',
                          background: 'var(--primary)',
                          boxShadow: '0 0 12px var(--glow-color)',
                          opacity: 0.6,
                        }}
                      />
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: 'var(--primary)',
                          boxShadow: '0 0 12px var(--glow-color)',
                          margin: '2px auto 0',
                        }}
                      />
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Right Controls */}
          <div className="flex items-center" style={{ gap: '16px' }}>
            {/* Dark Mode Toggle */}
            <div className="hidden md:flex">
              <DarkModeToggle />
            </div>

            {/* Inline Theme Picker */}
            <div className="hidden md:flex items-center" style={{ gap: '10px' }}>
              {themes.map((t) => (
                <motion.button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    backgroundColor: t.color,
                    border: theme === t.value
                      ? `2px solid ${t.color}`
                      : '2px solid rgba(255,255,255,0.10)',
                    boxShadow: theme === t.value
                      ? `0 0 24px ${t.color}60`
                      : 'none',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  aria-label={`Switch to ${t.name} theme`}
                  title={t.name}
                />
              ))}
            </div>

            {/* Hire Me Button */}
            <motion.a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleNavClick('#contact') }}
              className="hidden sm:inline-flex items-center justify-center"
              style={{
                height: 48,
                padding: '16px 26px',
                borderRadius: '999px',
                background: 'var(--gradient-primary)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                boxShadow: '0 0 20px var(--glow-color)',
                cursor: 'pointer',
                border: 'none',
                whiteSpace: 'nowrap',
              }}
              whileHover={{ y: -2, scale: 1.02, boxShadow: '0 0 30px var(--glow-color)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              Hire Me
            </motion.a>

            {/* Mobile Hamburger */}
            <motion.button
              className="lg:hidden flex items-center justify-center"
              style={{
                width: 44,
                height: 44,
                borderRadius: '999px',
                background: 'var(--glass-bg)',
                border: 'var(--glass-border)',
                color: 'var(--text)',
                cursor: 'pointer',
              }}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 z-drawer lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0"
              style={{ background: 'color-mix(in srgb, var(--background) 80%, transparent)' }}
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="absolute right-0 top-0 h-full"
              style={{
                width: 320,
                maxWidth: '85vw',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                borderLeft: '1px solid var(--border)',
                boxShadow: '-10px 0 40px rgba(0,0,0,0.3)',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full p-8">
                {/* Close button */}
                <div className="flex justify-end mb-8">
                  <motion.button
                    onClick={() => setIsMobileOpen(false)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '999px',
                      background: 'var(--glass-bg)',
                      border: 'var(--glass-border)',
                      color: 'var(--text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Nav links */}
                <div className="flex-1 space-y-6">
                  {navLinks.map((link, i) => (
                    <motion.button
                      key={link.name}
                      onClick={() => handleNavClick(link.href)}
                      className="block w-full text-left"
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: activeSection === link.href.replace('#', '')
                          ? 'var(--primary)'
                          : 'var(--text-secondary)',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: activeSection === link.href.replace('#', '')
                          ? 'var(--glass-bg)'
                          : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {link.name}
                    </motion.button>
                  ))}
                </div>

                {/* Bottom: Dark mode + Theme picker + Hire Me */}
                <div className="space-y-6 pt-8 border-t" style={{ borderColor: 'var(--divider)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                      APPEARANCE
                    </p>
                    <DarkModeToggle />
                  </div>

                  <div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '0.05em' }}>
                      THEME
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {themes.map((t) => (
                        <motion.button
                          key={t.value}
                          onClick={() => setTheme(t.value)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            backgroundColor: t.color,
                            border: theme === t.value
                              ? `2px solid ${t.color}`
                      : '2px solid var(--border)',
                            boxShadow: theme === t.value
                              ? `0 0 20px ${t.color}50`
                              : 'none',
                            cursor: 'pointer',
                            outline: 'none',
                          }}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={`Switch to ${t.name} theme`}
                          title={t.name}
                        />
                      ))}
                    </div>
                  </div>

                  <motion.a
                    href="#contact"
                    onClick={(e) => { e.preventDefault(); handleNavClick('#contact') }}
                    className="flex items-center justify-center w-full"
                    style={{
                      height: 52,
                      borderRadius: '999px',
                      background: 'var(--gradient-primary)',
                      color: '#fff',
                      fontSize: 16,
                      fontWeight: 600,
                      boxShadow: '0 0 20px var(--glow-color)',
                      cursor: 'pointer',
                      border: 'none',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Hire Me
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

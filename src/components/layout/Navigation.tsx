'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Moon, Sun, Home, User, Code2, Briefcase, Sparkles, Send, Palette, Zap } from 'lucide-react'
import { useTheme } from 'next-themes'
import { navLinks } from '@/data/navigation'
import { themes } from '@/data/themes'
import { useDarkMode } from '@/hooks/useDarkMode'

const navIcons: Record<string, React.ReactNode> = {
  Home: <Home style={{ width: 18, height: 18 }} />,
  About: <User style={{ width: 18, height: 18 }} />,
  Skills: <Code2 style={{ width: 18, height: 18 }} />,
  Projects: <Briefcase style={{ width: 18, height: 18 }} />,
  Experience: <Sparkles style={{ width: 18, height: 18 }} />,
  Contact: <Send style={{ width: 18, height: 18 }} />,
}

function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode()

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

  // Initialize data-mode from localStorage on first mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('aurora-mode')
      if (stored === 'light' || stored === 'dark') {
        document.documentElement.setAttribute('data-mode', stored)
      } else if (!document.documentElement.getAttribute('data-mode')) {
        document.documentElement.setAttribute('data-mode', 'dark')
      }
    } catch {
      if (!document.documentElement.getAttribute('data-mode')) {
        document.documentElement.setAttribute('data-mode', 'dark')
      }
    }
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
        className="nav-header fixed left-1/2 z-nav"
        style={{
          top: isScrolled ? '16px' : '24px',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '1240px',
          transition: 'top 300ms ease',
        }}
      >
        <nav
          className="nav-inner flex items-center justify-between"
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
            className="nav-logo flex items-center gap-3"
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
              className="nav-logo-text hidden sm:block"
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: 'var(--text)',
              }}
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
            transition={{ duration: 0.25 }}
          >
            {/* Backdrop with gradient blur */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(5,7,10,0.92) 0%, rgba(5,7,10,0.7) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Decorative glow behind drawer */}
            <div className="absolute right-0 top-0 w-96 h-96 pointer-events-none" aria-hidden="true">
              <div style={{
                width: '100%', height: '100%',
                background: 'radial-gradient(circle, var(--glow-color) 0%, transparent 70%)',
                filter: 'blur(120px)',
                opacity: 0.15,
              }} />
            </div>

            {/* Drawer */}
            <motion.div
              className="nav-drawer absolute right-0 top-0 h-full"
              style={{
                width: 340,
                maxWidth: '85vw',
                background: 'linear-gradient(180deg, rgba(12,16,23,0.98) 0%, rgba(5,7,10,0.98) 100%)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                borderLeft: '1px solid var(--border)',
                boxShadow: '-20px 0 80px rgba(0,0,0,0.5), -4px 0 20px rgba(0,0,0,0.3)',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="nav-drawer-inner" style={{
                display: 'flex', flexDirection: 'column', height: '100%',
                padding: '28px 24px',
              }}>
                {/* Top section: Logo + Close */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 32, flexShrink: 0,
                }}>
                  <motion.div
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, color: '#fff',
                      background: 'var(--gradient-primary)',
                      boxShadow: '0 0 12px var(--glow-color)',
                    }}>
                      M
                    </div>
                    <span className="nav-menu-label" style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                      Menu
                    </span>
                  </motion.div>

                  <motion.button
                    onClick={() => setIsMobileOpen(false)}
                    style={{
                      width: 36, height: 36,
                      borderRadius: '10px',
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                    whileHover={{ background: 'var(--glass-hover-bg)', color: 'var(--text)', scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close menu"
                  >
                    <X style={{ width: 16, height: 16 }} />
                  </motion.button>
                </div>

                {/* Scrollable Navigation Links */}
                <nav className="drawer-nav-scroll" style={{
                  flex: 1, overflowY: 'auto', overflowX: 'hidden',
                  marginLeft: -8, marginRight: -8, paddingLeft: 8, paddingRight: 8,
                }} aria-label="Mobile navigation">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {navLinks.map((link, i) => {
                      const isActive = activeSection === link.href.replace('#', '')
                      const sectionId = link.href.replace('#', '')
                      return (
                        <motion.button
                          key={link.name}
                          onClick={() => handleNavClick(link.href)}
                          className="drawer-nav-item"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: 14,
                            fontSize: 15,
                            fontWeight: isActive ? 600 : 500,
                            color: isActive ? 'var(--text)' : 'var(--text-secondary)',
                            background: isActive
                              ? 'linear-gradient(135deg, var(--glass-bg) 0%, rgba(255,255,255,0.06) 100%)'
                              : 'transparent',
                            border: isActive
                              ? '1px solid var(--border-strong)'
                              : '1px solid transparent',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.2s ease',
                            flexShrink: 0,
                          }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.06 + i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                          whileHover={{
                            background: 'var(--glass-bg)',
                            borderColor: 'var(--border)',
                            x: 3,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Active indicator bar */}
                          {isActive && (
                            <motion.div
                              layoutId="mobileNavIndicator"
                              style={{
                                position: 'absolute',
                                left: 0,
                                top: '50%',
                                y: '-50%',
                                width: 3,
                                height: 20,
                                borderRadius: '0 4px 4px 0',
                                background: 'var(--gradient-primary)',
                                boxShadow: '0 0 10px var(--glow-color)',
                              }}
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                          )}

                          {/* Icon */}
                          <div className="drawer-nav-icon" style={{
                            width: 32, height: 32,
                            borderRadius: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: isActive
                              ? 'linear-gradient(135deg, var(--primary) 0%, rgba(255,255,255,0.1) 100%)'
                              : 'var(--glass-bg)',
                            border: '1px solid',
                            borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                            flexShrink: 0,
                            transition: 'all 0.2s ease',
                          }}>
                            <span style={{ color: isActive ? '#fff' : 'var(--text-muted)', display: 'flex' }}>
                              {navIcons[link.name] || <Zap style={{ width: 16, height: 16 }} />}
                            </span>
                          </div>

                          {/* Label */}
                          <span style={{ flex: 1, textAlign: 'left' }}>{link.name}</span>

                          {/* Arrow */}
                          <motion.span
                            style={{ color: 'var(--text-muted)', opacity: 0, display: 'flex' }}
                            animate={{ opacity: isActive ? 0.5 : 0, x: isActive ? 0 : -6 }}
                            transition={{ duration: 0.2 }}
                          >
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                              <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.span>
                        </motion.button>
                      )
                    })}
                  </div>
                </nav>

                {/* Bottom Section - Sticky */}
                <div className="drawer-bottom" style={{ paddingTop: 20, borderTop: '1px solid var(--divider)', flexShrink: 0 }}>
                  {/* Appearance + Theme */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="drawer-appearance"
                    style={{
                      position: 'relative',
                      padding: 16,
                      borderRadius: 16,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                      border: '1px solid var(--border-strong)',
                      boxShadow: '0 0 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
                      marginBottom: 12,
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                      background: 'var(--gradient-primary)',
                      opacity: 0.5,
                    }} aria-hidden="true" />

                    <div style={{
                      position: 'absolute', top: '-40px', right: '-40px',
                      width: 100, height: 100, borderRadius: '50%',
                      background: 'var(--glow-color)',
                      filter: 'blur(50px)',
                      opacity: 0.08,
                      pointerEvents: 'none',
                    }} aria-hidden="true" />

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 8,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'linear-gradient(135deg, var(--primary) 0%, rgba(255,255,255,0.08) 100%)',
                          border: '1px solid',
                          borderColor: 'var(--border-strong)',
                          boxShadow: '0 0 12px var(--glow-color)',
                        }}>
                          <Palette style={{ width: 14, height: 14, color: '#fff' }} />
                        </div>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>Appearance</span>
                          <span style={{ fontSize: 9, color: 'var(--text-muted)', display: 'block', marginTop: 1, letterSpacing: '0.05em' }}>
                            Customize your view
                          </span>
                        </div>
                      </div>
                      <DarkModeToggle />
                    </div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
                      }}>
                        <div style={{ width: 1, height: 12, background: 'var(--primary)', opacity: 0.3, borderRadius: '999px' }} />
                        <span style={{
                          fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em',
                          textTransform: 'uppercase', fontWeight: 600,
                        }}>
                          Theme
                        </span>
                        <div style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {themes.map((t) => {
                          const isCurrentTheme = theme === t.value
                          return (
                            <motion.button
                              key={t.value}
                              onClick={() => setTheme(t.value)}
                              className="drawer-theme-dot"
                              style={{
                                position: 'relative',
                                width: 28, height: 28,
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${t.color}, ${t.color}cc)`,
                                border: isCurrentTheme
                                  ? `2px solid ${t.color}`
                                  : '2px solid var(--border)',
                                boxShadow: isCurrentTheme
                                  ? `0 0 14px ${t.color}60, inset 0 1px 0 rgba(255,255,255,0.25)`
                                  : 'inset 0 1px 0 rgba(255,255,255,0.08)',
                                cursor: 'pointer', outline: 'none',
                                transition: 'all 0.2s ease',
                              }}
                              whileHover={{
                                scale: 1.15,
                                boxShadow: `0 0 20px ${t.color}80`,
                              }}
                              whileTap={{ scale: 0.9 }}
                              aria-label={`Switch to ${t.name} theme`}
                              title={t.name}
                            >
                              {isCurrentTheme && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -90 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                  style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}
                                >
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </motion.div>
                              )}
                              {!isCurrentTheme && (
                                <div style={{
                                  position: 'absolute', inset: 0,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                  <div style={{
                                    width: 6, height: 6, borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.15)',
                                  }} />
                                </div>
                              )}
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>

                  {/* Hire Me Button */}
                  <motion.a
                    href="#contact"
                    onClick={(e) => { e.preventDefault(); handleNavClick('#contact') }}
                    className="drawer-hire-btn"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      height: 48, borderRadius: 14,
                      background: 'var(--gradient-primary)',
                      color: '#fff', fontSize: 14, fontWeight: 600,
                      boxShadow: '0 0 20px var(--glow-color)',
                      cursor: 'pointer', border: 'none', textDecoration: 'none',
                    }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 28px var(--glow-color)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send style={{ width: 14, height: 14 }} />
                    Hire Me
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @media (max-width: 640px) {
          .nav-header { max-width: calc(100% - 16px) !important; top: 12px !important; }
          .nav-inner { height: 60px !important; padding-left: 16px !important; padding-right: 16px !important; }
          .nav-logo { width: auto !important; }
          .nav-logo-text { font-size: 16px !important; }
          .nav-drawer { width: 100vw !important; max-width: 100vw !important; }
          .nav-drawer-inner { padding: 20px 16px !important; }
          .nav-menu-label { font-size: 14px !important; }
          .drawer-nav-item { padding: 10px 14px !important; gap: 12px !important; font-size: 14px !important; border-radius: 12px !important; }
          .drawer-nav-icon { width: 28px !important; height: 28px !important; border-radius: 8px !important; }
          .drawer-nav-scroll { margin-left: -4px !important; margin-right: -4px !important; padding-left: 4px !important; padding-right: 4px !important; }
          .drawer-appearance { padding: 14px !important; border-radius: 14px !important; }

          .drawer-hire-btn { height: 44px !important; font-size: 13px !important; border-radius: 12px !important; }
          .drawer-bottom { padding-top: 16px !important; }
        }
        @media (max-width: 374px) {
          .nav-drawer-inner { padding: 16px 12px !important; }
          .drawer-nav-item { padding: 8px 12px !important; gap: 10px !important; font-size: 13px !important; }
          .drawer-nav-icon { width: 24px !important; height: 24px !important; }
        }
      `}</style>
    </>
  )
}

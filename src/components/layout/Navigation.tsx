'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X, Github } from 'lucide-react'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'
import { BackgroundEffectSwitcher } from '@/components/ui/BackgroundEffectSwitcher'
import { navLinks } from '@/data/navigation'

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 100)
  })

  useEffect(() => {
    const sections = navLinks.map((link) => link.href.slice(1))
    const observers: IntersectionObserver[] = []

    sections.forEach((section) => {
      const element = document.getElementById(section)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Using 0.3 threshold means if 30% of the section is visible, it becomes active
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              setActiveSection(section)
            }
          })
        },
        { threshold: [0.1, 0.3, 0.5, 0.7, 0.9] }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [])

  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }, [])

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isMobileMenuOpen])

  // Trap focus inside mobile menu when open
  useEffect(() => {
    if (!isMobileMenuOpen) return
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      
      const mobileMenu = document.getElementById('mobile-menu-panel')
      if (!mobileMenu) return
      
      const focusableElements = mobileMenu.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length === 0) return
      
      const firstEl = focusableElements[0]
      const lastEl = focusableElements[focusableElements.length - 1]
      
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }
    
    window.addEventListener('keydown', handleTabKey)
    return () => window.removeEventListener('keydown', handleTabKey)
  }, [isMobileMenuOpen])

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'nav-glass py-3' : 'py-6'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="#hero"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('#hero')
              }}
              className="text-2xl font-orbitron font-bold gradient-text"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Go to top of page"
            >
              {'<MH/>'}
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1" role="menubar" aria-label="Navigation links">
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(link.href)
                  }}
                  className={`relative px-4 py-2 min-h-[44px] min-w-[44px] text-sm font-medium transition-colors ${
                    activeSection === link.href.slice(1)
                      ? 'text-cyan-400'
                      : 'text-gray-300 hover:text-white'
                  } touch-target-min`}
                  whileHover={{ y: -2 }}
                  role="menuitem"
                  aria-current={activeSection === link.href.slice(1) ? 'true' : undefined}
                >
                  {link.name}
                  {activeSection === link.href.slice(1) && (
                    <motion.span
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-cyan-400 to-magenta-500"
                      layoutId="activeNav"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.a>
              ))}

{/* Theme Switcher */}
              <ThemeSwitcher />

              {/* Background Effect Switcher */}
              <BackgroundEffectSwitcher />

              {/* GitHub Link */}
              <motion.a
                href="https://github.com/minhazexo"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full glass ml-2 hover:bg-cyan-400/20 transition-colors touch-target-min"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Visit GitHub profile (opens in new tab)"
              >
                <Github className="w-5 h-5" />
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg glass touch-target-min"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu-panel"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Content */}
            <motion.div
              id="mobile-menu-panel"
              className="absolute top-20 left-4 right-4 glass-strong rounded-2xl p-6"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              role="menu"
              aria-label="Mobile navigation menu"
            >
              <div className="space-y-2" role="group">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(link.href)
                    }}
                    className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
                      activeSection === link.href.slice(1)
                        ? 'bg-cyan-400/20 text-cyan-400'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    role="menuitem"
                    aria-current={activeSection === link.href.slice(1) ? 'true' : undefined}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

{/* Mobile Theme Switcher */}
              <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Theme</span>
                  <ThemeSwitcher />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Background</span>
                  <BackgroundEffectSwitcher />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

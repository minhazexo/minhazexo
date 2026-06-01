'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Check, Eye } from 'lucide-react'
import { useTheme } from 'next-themes'
import { themes } from '@/data/themes'

const colorBlindModes = [
  { value: 'none', label: 'Default' },
  { value: 'deuteranopia', label: 'Deuteranopia' },
  { value: 'protanopia', label: 'Protanopia' },
  { value: 'tritanopia', label: 'Tritanopia' },
  { value: 'achromatopsia', label: 'Achromatopsia' },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [cbMode, setCbMode] = useState('none')
  const toggleRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    const saved = document.documentElement.getAttribute('data-colorblind') || 'none'
    setCbMode(saved)
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && 
          toggleRef.current && !toggleRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const setColorBlindMode = (mode: string) => {
    setCbMode(mode)
    if (mode === 'none') {
      document.documentElement.removeAttribute('data-colorblind')
    } else {
      document.documentElement.setAttribute('data-colorblind', mode)
    }
  }

  if (!mounted) {
    return null
  }

  const currentTheme = themes.find((t) => t.value === theme) || themes[0]

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <motion.button
        ref={toggleRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-full glass hover:bg-white/10 transition-colors touch-target-min"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        aria-label="Choose color theme"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="theme-dropdown-listbox"
        aria-haspopup="listbox"
      >
        <Palette className="w-5 h-5" style={{ color: currentTheme.color }} />
      </motion.button>

      {/* Theme Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
              aria-hidden="true"
            />

            {/* Dropdown Menu */}
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 z-50 glass-strong rounded-2xl p-4 w-72 shadow-2xl"
              id="theme-dropdown-listbox"
              role="listbox"
              aria-label="Select a color theme"
            >
              {/* Theme Selection */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <Palette className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                <h3 className="text-white font-semibold">Choose Theme</h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {themes.map((t) => (
                  <motion.button
                    key={t.value}
                    onClick={() => {
                      setTheme(t.value)
                      setIsOpen(false)
                    }}
                    className={`relative p-3 rounded-xl border-2 transition-all ${
                      theme === t.value
                        ? 'border-cyan-400 bg-cyan-400/10'
                        : 'border-transparent hover:bg-white/5'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    role="option"
                    aria-selected={theme === t.value}
                  >
                    {/* Theme Color Preview */}
                    <div
                      className="w-full h-8 rounded-lg mb-2"
                      style={{ background: t.gradient }}
                      aria-hidden="true"
                    />

                    {/* Theme Name */}
                    <span className="text-sm font-medium text-white">{t.name}</span>

                    {/* Checkmark for active theme */}
                    {theme === t.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2"
                      >
                        <Check className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Color Blind Mode Section */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                  <h4 className="text-gray-300 text-sm font-medium">Color Blind Safe</h4>
                </div>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Color blindness compensation mode">
                  {colorBlindModes.map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => setColorBlindMode(mode.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        cbMode === mode.value
                          ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                      role="radio"
                      aria-checked={cbMode === mode.value}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
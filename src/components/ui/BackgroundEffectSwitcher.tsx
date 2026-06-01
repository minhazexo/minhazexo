'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Check, Layers } from 'lucide-react'
import { useBackgroundEffect } from '@/components/providers/BackgroundEffectsProvider'
import { backgroundEffects } from '@/data/backgrounds'

const effects = backgroundEffects

export function BackgroundEffectSwitcher() {
  const { backgroundEffect, setBackgroundEffect, secondaryEffect, setSecondaryEffect } = useBackgroundEffect()
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState<'primary' | 'secondary'>('primary')
  const [mounted, setMounted] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  if (!mounted) return null

  const currentPrimary = effects.find((e) => e.value === backgroundEffect) || effects[0]
  const currentSecondary = effects.find((e) => e.value === secondaryEffect) || effects[1]

  return (
    <div className="relative">
      <motion.button
        ref={toggleRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-full glass hover:bg-white/10 transition-colors touch-target-min"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        aria-label="Choose background effect"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="background-dropdown"
        aria-haspopup="listbox"
      >
        <Sparkles className="w-5 h-5 text-purple-400" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
              aria-hidden="true"
            />

            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 z-50 glass-strong rounded-2xl p-4 w-80 shadow-2xl"
              id="background-dropdown"
              role="dialog"
              aria-label="Background effect settings"
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <Layers className="w-5 h-5 text-purple-400" aria-hidden="true" />
                <h3 className="text-white font-semibold">Background Effects</h3>
              </div>

              <div className="flex gap-2 mb-4 p-1 bg-white/5 rounded-lg">
                <button
                  onClick={() => setTab('primary')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    tab === 'primary'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Primary
                </button>
                <button
                  onClick={() => setTab('secondary')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    tab === 'secondary'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Overlay
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {effects.map((effect) => {
                  const isActive = tab === 'primary' 
                    ? backgroundEffect === effect.value
                    : secondaryEffect === effect.value

                  return (
                    <motion.button
                      key={effect.value}
                      onClick={() => {
                        if (tab === 'primary') {
                          setBackgroundEffect(effect.value)
                        } else {
                          setSecondaryEffect(effect.value)
                        }
                      }}
                      className={`relative p-2 rounded-xl border-2 transition-all text-left ${
                        isActive
                          ? 'border-purple-400 bg-purple-400/10'
                          : 'border-transparent hover:bg-white/5'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      role="option"
                      aria-selected={isActive}
                    >
                      <div
                        className="h-10 rounded-lg mb-2"
                        style={{ background: effect.gradient }}
                        aria-hidden="true"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white">{effect.name}</span>
                        <span className="text-xs opacity-60">{effect.icon}</span>
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2"
                        >
                          <Check className="w-3 h-3 text-purple-400" />
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Current: {tab === 'primary' ? currentPrimary.name : currentSecondary.name}</span>
                  <span>{tab === 'primary' ? 'Main background' : 'Adds to background'}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
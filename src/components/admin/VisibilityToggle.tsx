'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface VisibilityToggleProps {
  projectId: number
  isVisible: boolean
  /** Called after the server confirms the new state */
  onToggle: (projectId: number, isVisible: boolean) => void
  /** Called when the update fails (UI has been reverted) */
  onError: (message: string) => void
  disabled?: boolean
}

const TRACK_WIDTH = 52
const TRACK_HEIGHT = 28
const KNOB_SIZE = 22
const KNOB_TRAVEL = TRACK_WIDTH - KNOB_SIZE - 6 // 3px padding on each side

/**
 * ON/OFF switch that instantly hides/shows a project on the public website.
 * Optimistically flips, blocks duplicate requests while saving, and reverts
 * to the previous state if the PATCH fails.
 */
export default function VisibilityToggle({ projectId, isVisible, onToggle, onError, disabled = false }: VisibilityToggleProps) {
  const [pending, setPending] = useState(false)
  const [current, setCurrent] = useState(isVisible)

  const handleClick = async () => {
    if (pending || disabled) return

    const previous = current
    const next = !current
    setPending(true)
    setCurrent(next) // optimistic update

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visible: next }),
      })
      if (!res.ok) throw new Error('Failed to update visibility')
      const updated = await res.json()
      const confirmed = updated.isVisible === true
      setCurrent(confirmed)
      onToggle(projectId, confirmed)
    } catch (err) {
      setCurrent(previous) // revert on failure
      onError(err instanceof Error ? err.message : 'Failed to update visibility')
    } finally {
      setPending(false)
    }
  }

  const on = current
  const interactive = !pending && !disabled

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
      {/* Status */}
      <span
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 600, letterSpacing: '0.02em',
          color: on ? '#34d399' : '#f87171', whiteSpace: 'nowrap',
        }}
      >
        <motion.span
          animate={{ scale: pending ? [1, 1.35, 1] : 1 }}
          transition={pending ? { repeat: Infinity, duration: 1.1 } : { duration: 0.2 }}
          style={{
            width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
            background: on ? '#34d399' : '#f87171',
            boxShadow: `0 0 8px ${on ? 'rgba(52,211,153,0.9)' : 'rgba(248,113,113,0.9)'}`,
          }}
        />
        {on ? 'Visible' : 'Hidden'}
      </span>

      {/* Switch */}
      <motion.button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={`${on ? 'Hide' : 'Show'} project on public website`}
        onClick={handleClick}
        disabled={!interactive}
        whileTap={interactive ? { scale: 0.94 } : undefined}
        style={{
          position: 'relative',
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: 999,
          border: 'none',
          cursor: interactive ? 'pointer' : 'default',
          padding: 0,
          flexShrink: 0,
          background: on
            ? 'linear-gradient(135deg, #10b981, #059669)'
            : 'rgba(255,255,255,0.14)',
          boxShadow: on ? '0 0 12px rgba(16,185,129,0.4)' : 'inset 0 1px 2px rgba(0,0,0,0.4)',
          opacity: pending ? 0.75 : 1,
          transition: 'background 0.3s ease, opacity 0.3s ease',
        }}
      >
        {/* ON / OFF label */}
        <span
          style={{
            position: 'absolute', top: '50%',
            transform: 'translateY(-50%)',
            left: on ? 7 : 'auto', right: on ? 'auto' : 8,
            fontSize: 9, fontWeight: 800, letterSpacing: '0.06em',
            color: on ? '#fff' : 'rgba(255,255,255,0.55)',
            pointerEvents: 'none', lineHeight: 1,
          }}
        >
          {on ? 'ON' : 'OFF'}
        </span>

        {/* Knob */}
        <motion.span
          animate={{ x: on ? KNOB_TRAVEL : 0 }}
          transition={{ type: 'spring', stiffness: 550, damping: 32 }}
          style={{
            position: 'absolute', top: 3, left: 3,
            width: KNOB_SIZE, height: KNOB_SIZE,
            borderRadius: '50%', background: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        />

        {/* Loading overlay */}
        {pending && (
          <span
            style={{
              position: 'absolute', inset: 0, borderRadius: 999,
              background: 'rgba(0,0,0,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
              style={{
                width: 12, height: 12, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.35)',
                borderTopColor: '#fff',
              }}
            />
          </span>
        )}
      </motion.button>
    </div>
  )
}

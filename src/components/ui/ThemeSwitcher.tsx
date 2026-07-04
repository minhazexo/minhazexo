'use client'

import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { themes } from '@/data/themes'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-[10px]">
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
  )
}

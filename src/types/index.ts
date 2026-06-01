import { type ComponentType } from 'react'

// Navigation
export interface NavLink {
  name: string
  href: string
}

// Projects
export interface Project {
  id: number
  title: string
  description: string
  image: string
  tech: string[]
  category: string
  github: string
  demo: string
}

// Skills
export interface Skill {
  name: string
  level: number
}

export interface SkillCategory {
  name: string
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  skills: string[]
}

export interface OrbitSkill {
  name: string
  angle: number
}

// About / Timeline
export interface Milestone {
  year: string
  title: string
  description: string
  color: string
}

// Social Links
export interface SocialLink {
  icon: ComponentType<{ className?: string }>
  href: string
  label: string
  color?: string
}

// Theme
export interface Theme {
  name: string
  value: string
  color: string
  gradient: string
}

// Stats (Hero)
export interface Stat {
  value: string
  label: string
}

// Loading Screen
export interface LoadingScreenProps {
  onComplete: () => void
  progress: number
  isReady: boolean
}

// Theme Provider
export interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
}

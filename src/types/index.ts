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
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>
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

// Experience
export interface Experience {
  id: number
  role: string
  company: string
  period: string
  description: string
  highlights: string[]
  tech: string[]
  color: string
}

// Testimonials
export interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  avatar: string
  content: string
  rating: number
  color: string
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

// Feature Cards
export interface Feature {
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>
  title: string
  description: string
  accentColor?: string
  href?: string
}

// About Info Panel
export interface AboutInfoItem {
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>
  label: string
  value: string
}

// Stats Card
export interface StatItem {
  value: string
  label: string
  description: string
}

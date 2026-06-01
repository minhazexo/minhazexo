import { Palette, Server, Terminal, Code2 } from 'lucide-react'
import type { SkillCategory, OrbitSkill } from '@/types'

export const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    icon: Palette,
    color: '#00D4FF',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
  },
  {
    name: 'Backend',
    icon: Server,
    color: '#00FF88',
    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'GraphQL', 'REST API'],
  },
  {
    name: 'Tools',
    icon: Terminal,
    color: '#FF00FF',
    skills: ['Git', 'Docker', 'AWS', 'Vercel', 'Figma', 'VS Code'],
  },
]

export const orbitSkills: OrbitSkill[] = [
  { name: 'React', angle: 0 },
  { name: 'Node', angle: 60 },
  { name: 'TypeScript', angle: 120 },
  { name: 'Next.js', angle: 180 },
  { name: 'MongoDB', angle: 240 },
  { name: 'Tailwind', angle: 300 },
]

// Enhanced skills with levels for 3D visualization
export interface SkillWithLevel {
  name: string;
  level: number;
  color: string;
}

export const topSkills: SkillWithLevel[] = [
  { name: 'React', level: 95, color: '#61dafb' },
  { name: 'TypeScript', level: 90, color: '#3178c6' },
  { name: 'Next.js', level: 88, color: '#ffffff' },
  { name: 'Node.js', level: 85, color: '#339933' },
  { name: 'Three.js', level: 78, color: '#049ef4' },
  { name: 'MongoDB', level: 80, color: '#47A248' },
  { name: 'Tailwind', level: 92, color: '#38bdf8' },
  { name: 'Framer', level: 85, color: '#ff69b4' },
  { name: 'GraphQL', level: 75, color: '#e535ab' },
  { name: 'Docker', level: 70, color: '#2496ed' },
  { name: 'PostgreSQL', level: 78, color: '#336791' },
  { name: 'Git', level: 90, color: '#f05032' },
]

export { Code2 }

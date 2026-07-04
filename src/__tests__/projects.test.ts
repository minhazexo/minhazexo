import { describe, it, expect } from 'vitest'
import { projects, categories } from '@/data/projects'

describe('projects data', () => {
  it('has 8 projects', () => {
    expect(projects).toHaveLength(8)
  })

  it('all projects have valid IDs', () => {
    projects.forEach((p) => {
      expect(p.id).toBeGreaterThan(0)
    })
  })

  it('all projects have unique IDs', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all projects have non-empty titles', () => {
    projects.forEach((p) => {
      expect(p.title.length).toBeGreaterThan(0)
    })
  })

  it('all projects have descriptions longer than 10 characters', () => {
    projects.forEach((p) => {
      expect(p.description.length).toBeGreaterThan(10)
    })
  })

  it('all projects have valid image paths', () => {
    projects.forEach((p) => {
      expect(p.image).toMatch(/\.(png|jpg|webp|jpeg)$/)
    })
  })

  it('all projects have at least one tech', () => {
    projects.forEach((p) => {
      expect(p.tech.length).toBeGreaterThan(0)
    })
  })

  it('all projects have valid categories', () => {
    projects.forEach((p) => {
      expect(categories).toContain(p.category)
    })
  })

  it('all projects have GitHub and demo links', () => {
    projects.forEach((p) => {
      expect(p.github).toMatch(/^https?:\/\//)
      expect(p.demo).toMatch(/^https?:\/\//)
    })
  })
})

describe('categories', () => {
  it('includes "All" category', () => {
    expect(categories).toContain('All')
  })

  it('has at least 2 categories', () => {
    expect(categories.length).toBeGreaterThanOrEqual(2)
  })
})

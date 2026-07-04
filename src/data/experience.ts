import type { Experience } from '@/types'

export const experiences: Experience[] = [
  {
    id: 1,
    role: 'Senior Frontend Developer',
    company: 'Freelance / Self-Employed',
    period: '2023 — Present',
    description: 'Leading frontend architecture and development for diverse clients, delivering premium web experiences.',
    highlights: [
      'Architected and built 15+ production applications using Next.js and React',
      'Implemented complex animation systems with Framer Motion and GSAP',
      'Achieved 95+ Lighthouse scores across all client projects',
      'Reduced bundle sizes by 40% through code splitting and optimization',
    ],
    tech: ['Next.js', 'React', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    color: '#00E5FF',
  },
  {
    id: 2,
    role: 'Full Stack Developer',
    company: 'Various Agencies',
    period: '2022 — 2023',
    description: 'Developed end-to-end web solutions for startups and agencies, focusing on performance and UX.',
    highlights: [
      'Built RESTful APIs with Node.js and Express for 10+ applications',
      'Integrated third-party services including Stripe, Auth0, and SendGrid',
      'Developed real-time features using WebSockets and Server-Sent Events',
      'Migrated legacy PHP applications to modern React stack',
    ],
    tech: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'React', 'Docker'],
    color: '#00F593',
  },
  {
    id: 3,
    role: 'Junior Web Developer',
    company: 'Tech Startup',
    period: '2021 — 2022',
    description: 'Started professional journey building responsive websites and learning modern development practices.',
    highlights: [
      'Built responsive websites using HTML, CSS, JavaScript, and React',
      'Collaborated with design team to implement pixel-perfect UI components',
      'Participated in code reviews and agile development processes',
      'Contributed to open-source projects and internal tooling',
    ],
    tech: ['JavaScript', 'React', 'HTML/CSS', 'Git', 'Figma'],
    color: '#FF2D95',
  },
]

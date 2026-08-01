import { neon } from '@neondatabase/serverless'
import { readFileSync, existsSync } from 'fs'

const envPath = new URL('../.env.local', import.meta.url)
const envContent = existsSync(envPath) ? readFileSync(envPath, 'utf-8') : ''
const envVars = Object.fromEntries(
  envContent.split('\n').filter(l => l.includes('=')).map(l => {
    const [k, ...v] = l.split('=')
    return [k.trim(), v.join('=').trim()]
  })
)

const DATABASE_URL = envVars.DATABASE_URL || process.env.DATABASE_URL
if (!DATABASE_URL) { console.error('DATABASE_URL not found'); process.exit(1) }

const sql = neon(DATABASE_URL)

async function seed() {
  console.log('Seeding data...')

  // --- Projects ---
  const existingProjects = await sql`SELECT id FROM projects LIMIT 1`
  if (existingProjects.length === 0) {
    const projects = [
      { title: 'GeoWeather', description: 'Real-time weather dashboard with location-based forecasts, interactive maps, and severe weather alerts.', image: '/webp/project-weather.webp', tech: ['React', 'API Integration', 'Chart.js', 'PWA', 'Geolocation'], category: 'React', github: 'https://github.com/minhazexo/weather-app', demo: 'https://minhazexo.github.io/weather-app/' },
      { title: 'GBC Physics', description: 'Official academic portal for the Department of Physics at Government Bangla College. Features faculty profiles, program info, research highlights, and a modern campus showcase.', image: '/Project%20Photo/Gbcphy%20project.png', tech: ['Next.js', 'Tailwind', 'Framer Motion'], category: 'React', github: 'https://github.com/minhazexo', demo: 'https://gbcphy.netlify.app/' },
      { title: 'ChocoVerse', description: 'A premium chocolate boutique e-commerce platform in Bangladesh. Features product collections, categorized browsing, and seamless shopping cart experience built with Next.js.', image: '/Project%20Photo/project-chocovers.jpg', tech: ['Next.js', 'Tailwind', 'Stripe'], category: 'React', github: 'https://github.com/minhazexo', demo: 'https://chocoverse.nahidaferjana27022002.workers.dev/' },
      { title: 'BD Cloths', description: 'A web platform hosted on Render serving climate & sustainability content for Bangladesh. Features a modern responsive design with community-focused interfaces.', image: '/Project%20Photo/project-bd-cloths.jpg', tech: ['Next.js', 'React', 'Tailwind'], category: 'React', github: 'https://github.com/minhazexo', demo: 'https://bd-cloths.onrender.com/' },
      { title: 'ScienceBee', description: 'An educational web platform designed for interactive science learning. Built with Next.js for a modern, responsive experience.', image: '/Project%20Photo/Project%20Sciencebee.png', tech: ['Next.js', 'Tailwind', 'API Integration'], category: 'React', github: 'https://github.com/minhazexo', demo: 'https://science-box-rose.vercel.app/' },
      { title: 'Nityadi Shop', description: 'Bangladesh\'s largest online bookstore featuring an extensive catalog of novels, classics, translations, and educational books. Supports bKash and Nagad payments.', image: '/Project%20Photo/project-nityadi-shop.jpg', tech: ['PHP', 'MySQL', 'JavaScript', 'HTML/CSS'], category: 'Fullstack', github: 'https://github.com/minhazexo', demo: 'https://nityadi-shop.free.nf/?i=1' },
      { title: 'Seecto Bangladesh', description: 'A youth-led climate justice organization platform championing sustainability, energy transition, and environmental advocacy across Bangladesh.', image: '/webp/project-seecto-bangladesh.webp', tech: ['React', 'Tailwind', 'CSS'], category: 'React', github: 'https://github.com/minhazexo', demo: 'https://minhazexo.github.io/seecto-bangladesh/' },
      { title: 'Singularity', description: 'A cinematic black hole observatory experience with immersive visual effects, CSS animations, and interactive cosmic exploration.', image: '/Project%20Photo/Singularity%20Project.png', tech: ['React', 'Three.js', 'GSAP', 'CSS'], category: 'React', github: 'https://github.com/minhazexo', demo: 'https://blackholesimulation.vercel.app/' },
    ]
    for (const p of projects) {
      await sql`
        INSERT INTO projects (title, description, image, tech, category, github, demo, created_at)
        VALUES (${p.title}, ${p.description}, ${p.image}, ${p.tech}, ${p.category}, ${p.github}, ${p.demo}, NOW())
      `
    }
    console.log(`  ✓ ${projects.length} projects seeded`)
  } else {
    console.log('  - Projects already exist, skipping')
  }

  // --- Skills ---
  const existingSkills = await sql`SELECT id FROM skills LIMIT 1`
  if (existingSkills.length === 0) {
    const skills = [
      { name: 'React', category: 'Frontend', level: 95, color: '#61dafb' },
      { name: 'Next.js', category: 'Frontend', level: 88, color: '#ffffff' },
      { name: 'TypeScript', category: 'Frontend', level: 90, color: '#3178c6' },
      { name: 'JavaScript', category: 'Frontend', level: 92, color: '#f7df1e' },
      { name: 'HTML5', category: 'Frontend', level: 95, color: '#e34f26' },
      { name: 'CSS3', category: 'Frontend', level: 93, color: '#1572b6' },
      { name: 'Tailwind CSS', category: 'Frontend', level: 92, color: '#38bdf8' },
      { name: 'Framer Motion', category: 'Frontend', level: 85, color: '#ff69b4' },
      { name: 'Three.js', category: 'Frontend', level: 78, color: '#049ef4' },
      { name: 'Redux', category: 'Frontend', level: 80, color: '#764abc' },
      { name: 'Zustand', category: 'Frontend', level: 82, color: '#f97316' },
      { name: 'Vite', category: 'Frontend', level: 85, color: '#646cff' },
      { name: 'Node.js', category: 'Backend', level: 85, color: '#339933' },
      { name: 'Express', category: 'Backend', level: 82, color: '#000000' },
      { name: 'Python', category: 'Backend', level: 70, color: '#3776ab' },
      { name: 'REST APIs', category: 'Backend', level: 90, color: '#00b4d8' },
      { name: 'GraphQL', category: 'Backend', level: 75, color: '#e535ab' },
      { name: 'PostgreSQL', category: 'Backend', level: 78, color: '#336791' },
      { name: 'MongoDB', category: 'Backend', level: 80, color: '#47A248' },
      { name: 'SQLite', category: 'Backend', level: 72, color: '#003b57' },
      { name: 'Firebase', category: 'Backend', level: 75, color: '#ffca28' },
      { name: 'Supabase', category: 'Backend', level: 70, color: '#3ecf8e' },
      { name: 'Appwrite', category: 'Backend', level: 65, color: '#fd366e' },
      { name: 'Cloudflare', category: 'Backend', level: 68, color: '#f38020' },
      { name: 'Git', category: 'Tools & Others', level: 90, color: '#f05032' },
      { name: 'GitHub', category: 'Tools & Others', level: 88, color: '#ffffff' },
      { name: 'VS Code', category: 'Tools & Others', level: 92, color: '#007acc' },
      { name: 'Figma', category: 'Tools & Others', level: 75, color: '#f24e1e' },
      { name: 'Linux', category: 'Tools & Others', level: 72, color: '#fcc624' },
      { name: 'Docker', category: 'Tools & Others', level: 70, color: '#2496ed' },
      { name: 'Postman', category: 'Tools & Others', level: 82, color: '#ff6c37' },
      { name: 'Vercel', category: 'Tools & Others', level: 85, color: '#ffffff' },
      { name: 'Netlify', category: 'Tools & Others', level: 83, color: '#00c7b7' },
      { name: 'CI/CD', category: 'Tools & Others', level: 78, color: '#2396ed' },
      { name: 'Jira', category: 'Tools & Others', level: 70, color: '#0052cc' },
      { name: 'Notion', category: 'Tools & Others', level: 75, color: '#ffffff' },
    ]
    for (const s of skills) {
      await sql`
        INSERT INTO skills (name, category, level, color, created_at)
        VALUES (${s.name}, ${s.category}, ${s.level}, ${s.color}, NOW())
      `
    }
    console.log(`  ✓ ${skills.length} skills seeded`)
  } else {
    console.log('  - Skills already exist, skipping')
  }

  // --- Experience ---
  const existingExperience = await sql`SELECT id FROM experience LIMIT 1`
  if (existingExperience.length === 0) {
    const experiences = [
      { role: 'Senior Frontend Developer', company: 'Freelance / Self-Employed', period: '2023 — Present', description: 'Leading frontend architecture and development for diverse clients, delivering premium web experiences.', highlights: ['Architected and built 15+ production applications using Next.js and React', 'Implemented complex animation systems with Framer Motion and GSAP', 'Achieved 95+ Lighthouse scores across all client projects', 'Reduced bundle sizes by 40% through code splitting and optimization'], tech: ['Next.js', 'React', 'TypeScript', 'Framer Motion', 'Tailwind CSS'], color: '#00E5FF', sortOrder: 3 },
      { role: 'Full Stack Developer', company: 'Various Agencies', period: '2022 — 2023', description: 'Developed end-to-end web solutions for startups and agencies, focusing on performance and UX.', highlights: ['Built RESTful APIs with Node.js and Express for 10+ applications', 'Integrated third-party services including Stripe, Auth0, and SendGrid', 'Developed real-time features using WebSockets and Server-Sent Events', 'Migrated legacy PHP applications to modern React stack'], tech: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'React', 'Docker'], color: '#00F593', sortOrder: 2 },
      { role: 'Junior Web Developer', company: 'Tech Startup', period: '2021 — 2022', description: 'Started professional journey building responsive websites and learning modern development practices.', highlights: ['Built responsive websites using HTML, CSS, JavaScript, and React', 'Collaborated with design team to implement pixel-perfect UI components', 'Participated in code reviews and agile development processes', 'Contributed to open-source projects and internal tooling'], tech: ['JavaScript', 'React', 'HTML/CSS', 'Git', 'Figma'], color: '#FF2D95', sortOrder: 1 },
    ]
    for (const e of experiences) {
      await sql`
        INSERT INTO experience (role, company, period, description, highlights, tech, color, sort_order, created_at)
        VALUES (${e.role}, ${e.company}, ${e.period}, ${e.description}, ${e.highlights}, ${e.tech}, ${e.color}, ${e.sortOrder}, NOW())
      `
    }
    console.log(`  ✓ ${experiences.length} experiences seeded`)
  } else {
    console.log('  - Experience already exists, skipping')
  }

  // --- Testimonials ---
  const existingTestimonials = await sql`SELECT id FROM testimonials LIMIT 1`
  if (existingTestimonials.length === 0) {
    const testimonials = [
      { name: 'Sarah Johnson', role: 'CTO', company: 'TechVentures', avatar: '/webp/profile.webp', content: 'Working with Mehrab was an exceptional experience. His attention to detail and deep understanding of modern web technologies resulted in a product that exceeded our expectations. The animations and user experience he delivered were truly world-class.', rating: 5, color: '#00E5FF' },
      { name: 'David Chen', role: 'Product Manager', company: 'Digital Solutions Inc.', avatar: '/webp/profile.webp', content: 'Mehrab has a rare combination of technical skill and design sensibility. He doesn\'t just write code — he crafts experiences. Our platform saw a 40% increase in user engagement after his redesign. Highly recommended.', rating: 5, color: '#8B5CF6' },
      { name: 'Emily Rodriguez', role: 'Founder', company: 'StartupLab', avatar: '/webp/profile.webp', content: 'From concept to deployment, Mehrab demonstrated exceptional professionalism and technical expertise. His ability to translate complex requirements into elegant, performant solutions is remarkable. A true asset to any project.', rating: 5, color: '#00F593' },
    ]
    for (const t of testimonials) {
      await sql`
        INSERT INTO testimonials (name, role, company, avatar, content, rating, color, created_at)
        VALUES (${t.name}, ${t.role}, ${t.company}, ${t.avatar}, ${t.content}, ${t.rating}, ${t.color}, NOW())
      `
    }
    console.log(`  ✓ ${testimonials.length} testimonials seeded`)
  } else {
    console.log('  - Testimonials already exist, skipping')
  }

  console.log('\nSeed complete!')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})

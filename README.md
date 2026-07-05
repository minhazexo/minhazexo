<div align="center">
  <img src="/hero-astronaut.jpg" alt="MD Mehrab Hossain" width="120" style="border-radius: 50%" />

  # MD Mehrab Hossain — Portfolio

  <p>
    <strong>Full-stack developer crafting premium digital experiences.</strong>
  </p>

  <p>
    <a href="https://mehrabhossain.dev">Live Site</a> ·
    <a href="#features">Features</a> ·
    <a href="#getting-started">Getting Started</a> ·
    <a href="#project-structure">Structure</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat&logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?style=flat&logo=drizzle" alt="Drizzle ORM" />
    <img src="https://img.shields.io/badge/Framer_Motion-11.3-0055FF?style=flat&logo=framer" alt="Framer Motion" />
  </p>
</div>

---

## Overview

A modern, performant portfolio website built with Next.js 14. Features a dynamic admin dashboard with database-backed content management, immersive visual effects, theme system, and PWA support.

**Stack:** Next.js 14 (App Router) · React 18 · TypeScript · PostgreSQL (Neon) · Drizzle ORM · Framer Motion · Tailwind CSS

---

## Features

- **Dynamic Content Management** — Projects, skills, experience, and testimonials stored in PostgreSQL, editable via admin dashboard
- **Admin Dashboard** — Full CRUD at `/admin` with JWT-based authentication
- **Immersive Visuals** — Animated background with hex grid, floating particles, stars, glow effects, and vignette
- **Theme System** — 8 color themes (Blue, Green, Orange, Pink, Purple, Cyan, Amber, Silver) with smooth transitions
- **Performance Optimized** — Lazy-loaded sections, optimized images (WebP), scroll-triggered animations
- **PWA Ready** — Installable with manifest and service worker support
- **Responsive Design** — Fluid layouts, glassmorphism UI, mobile-first
- **Contact Form** — Server-side validated form with Resend email integration and rate limiting

---

## Getting Started

### Prerequisites

- **Node.js** 20+ (see `.nvmrc`)
- **Bun** (package manager)
- **PostgreSQL** database — [Neon](https://neon.tech) (serverless) recommended

### Installation

```bash
# Clone the repository
git clone https://github.com/minhazexo/mehrab-portfolio.git
cd mehrab-portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Fill in `.env.local`:

```env
DATABASE_URL=postgresql://user:password@ep-xxx.aws.neon.tech/neondb?sslmode=require
ADMIN_JWT_SECRET=your-secret-at-least-32-chars-long
RESEND_API_KEY=re_xxx              # Optional — for contact form emails
CONTACT_EMAIL=you@example.com       # Optional — where contact emails go
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX     # Optional — Google Analytics
```

### Database Setup

```bash
# Generate Drizzle schema
npm run db:generate

# Push schema to database
npm run db:push

# Seed admin user + content data
npm run db:seed
```

Default admin credentials: `admin` / `admin123` (change immediately after first login).

### Development

```bash
npm run dev
```

Open [http://localhost:4000](http://localhost:4000). Admin panel at [http://localhost:4000/admin](http://localhost:4000/admin).

### Build

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/          # Admin login page
│   │   ├── page.tsx        # Admin dashboard (CRUD)
│   │   └── layout.tsx
│   ├── api/
│   │   ├── admin/          # Authenticated admin CRUD routes
│   │   │   ├── projects/
│   │   │   ├── skills/
│   │   │   ├── experience/
│   │   │   ├── testimonials/
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   └── me/
│   │   ├── projects/       # Public read-only API routes
│   │   ├── skills/
│   │   ├── experience/
│   │   ├── testimonials/
│   │   └── contact/        # Contact form email endpoint
│   ├── layout.tsx          # Root layout (theme, background, effects)
│   └── page.tsx            # Homepage (all sections)
├── components/
│   ├── background/         # HexGrid, GlowLayer, Stars, Particles, etc.
│   ├── effects/            # CursorGlow, ScrollProgress, ProjectDetailModal
│   ├── providers/          # ThemeProvider, ThemeAutoCycle, ThemeTransition
│   ├── sections/           # Hero, About, Skills, Projects, Experience, etc.
│   └── ui/                 # SectionWrapper, FeatureCard, StatsCard
├── data/                   # Static fallback data (used when API unavailable)
├── hooks/
│   └── useApiData.ts       # Generic data-fetching hook with fallback
├── lib/
│   ├── db/                 # Drizzle ORM client + schema
│   ├── auth.ts             # JWT authentication helpers
│   └── utils.ts            # Utility functions
├── styles/                 # CSS (variables, base, components, animations)
└── types/                  # TypeScript interfaces
```

---

## API Routes

### Public (no auth required)

| Route | Description |
|---|---|
| `GET /api/projects` | List all projects |
| `GET /api/skills` | List all skills |
| `GET /api/experience` | List all experience |
| `GET /api/testimonials` | List all testimonials |
| `POST /api/contact` | Submit contact form |

### Admin (JWT auth required)

| Route | Description |
|---|---|
| `POST /api/admin/login` | Authenticate and receive JWT cookie |
| `GET /api/admin/me` | Verify current session |
| `POST /api/admin/logout` | Clear session cookie |
| `GET/POST/PUT/DELETE /api/admin/projects` | CRUD projects |
| `GET/POST/PUT/DELETE /api/admin/skills` | CRUD skills |
| `GET/POST/PUT/DELETE /api/admin/experience` | CRUD experience |
| `GET/POST/PUT/DELETE /api/admin/testimonials` | CRUD testimonials |

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server (port 4000) |
| `npm run build` | Production build |
| `npm start` | Start production server (port 4000) |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Playwright E2E tests |
| `npm run test:unit` | Run Vitest unit tests |
| `npm run analyze` | Build with bundle analyzer |
| `npm run db:generate` | Generate Drizzle schema files |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed admin user + content data |
| `npm run optimize:images` | Convert images to WebP |

---

## Deployment

### Netlify (recommended)

The project includes a `netlify.toml` configured for the Netlify Next.js plugin:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

Set environment variables in Netlify dashboard:
- `DATABASE_URL`
- `ADMIN_JWT_SECRET`
- `RESEND_API_KEY` (optional)
- `CONTACT_EMAIL` (optional)
- `NEXT_PUBLIC_GA_ID` (optional)

### Vercel

```bash
vercel --prod
```

Set the same environment variables in Vercel dashboard.

---

## Admin Panel

Access at `/admin`. Login with credentials created during seeding.

- **Projects** — Manage portfolio projects with title, description, image, tech stack, category, and links
- **Skills** — Manage skills with name, category, proficiency level, and color
- **Experience** — Manage work history with role, company, period, description, highlights, and tech
- **Testimonials** — Manage client testimonials with name, role, company, content, and rating

---

## Database Schema

Six tables managed via Drizzle ORM:

- `admin_users` — Authentication (username, email, password_hash)
- `projects` — Portfolio projects (title, description, image, tech[], category, github, demo)
- `skills` — Technical skills (name, category, level, color)
- `experience` — Work experience (role, company, period, description, highlights[], tech[], color, sort_order)
- `testimonials` — Client testimonials (name, role, company, avatar, content, rating, color)

---

## License

This project is **private** — all rights reserved. The code is shared for portfolio demonstration purposes.

---

<div align="center">
  <sub>Built by <a href="https://github.com/minhazexo">MD Mehrab Hossain</a></sub>
</div>

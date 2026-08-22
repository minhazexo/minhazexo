# Mehrab Portfolio

A modern, full-stack developer portfolio built with Next.js 14, featuring a cinematic UI with multi-theme support, dynamic content management via an admin dashboard, and server-side rendering with Neon PostgreSQL.

**Live:** [minhazexo.vercel.app](https://minhazexo.vercel.app)

## Features

### Public Site
- **Hero Section** — Animated intro with typing effect and parallax background
- **Features & About** — Glassmorphic cards with intersection-reveal animations
- **Projects** — Dynamic grid loaded from the database with category filtering and detail modals
- **Skills** — Orbiting animation with proficiency levels fetched from the API
- **Experience** — Timeline with company data from the database
- **Testimonials** — Carousel with ratings from the database
- **Contact** — Form powered by Resend for email delivery
- **Multi-Theme** — 6 switchable color themes with auto-cycling and persistence
- **Responsive** — Mobile-first layout with animated hamburger drawer navigation
- **Performance** — Lazy-loaded sections, image preloading, WebP optimization, and bundle analysis
- **Accessibility** — Skip-to-content link, ARIA labels, semantic HTML, keyboard navigation

### Admin Dashboard
- **Auth** — JWT-based login with bcrypt password hashing and session versioning
- **Project Management** — CRUD with image upload (stored as WebP data URLs in Neon)
- **Skills / Experience / Testimonials** — Full CRUD for all content sections
- **Profile** — Avatar upload, display name, bio, contact info
- **Documents** — Private file storage for CVs and certificates
- **Visibility Toggle** — Show/hide projects on the public site

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| UI | React 18, Tailwind CSS 3, Framer Motion |
| Database | Neon PostgreSQL (serverless) |
| ORM | Drizzle ORM |
| Auth | JWT (jose), bcryptjs |
| Email | Resend |
| Analytics | Vercel Analytics, Speed Insights |
| Testing | Playwright (E2E), Vitest (unit) |
| Deployment | Vercel |

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes (REST)
│   │   ├── admin/        # Authenticated admin endpoints
│   │   ├── contact/      # Contact form submission
│   │   ├── projects/     # Public project data & images
│   │   ├── skills/       # Public skills data
│   │   ├── experience/   # Public experience data
│   │   └── testimonials/ # Public testimonials data
│   ├── admin/            # Admin dashboard pages
│   └── page.tsx          # Homepage
├── components/
│   ├── admin/            # Admin-specific components
│   ├── background/       # Animated background layers
│   ├── effects/          # Visual effects (cursor glow, scroll progress, etc.)
│   ├── layout/           # Navigation, footer, back-to-top
│   ├── providers/        # Theme provider, auto-cycle, transitions
│   ├── sections/         # Homepage content sections
│   └── ui/               # Shared UI components
├── data/                 # Static data (nav links, features, themes, etc.)
├── hooks/                # Custom React hooks
├── lib/
│   ├── db/               # Database connection and Drizzle schema
│   ├── auth.ts           # JWT authentication utilities
│   ├── storage.ts        # File storage (documents, project images)
│   ├── constants.ts      # Shared constants
│   └── utils.ts          # Utility functions
├── styles/               # Global CSS (Tailwind, variables, animations)
└── types/                # TypeScript interfaces
```

## Getting Started

### Prerequisites

- Node.js >= 20
- Bun (recommended) or npm
- A [Neon](https://neon.tech) PostgreSQL database

### 1. Clone and install

```bash
git clone https://github.com/minhazexo/minhazexo.git
cd minhazexo
bun install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values. See [Environment Variables](#environment-variables) below.

### 3. Set up the database

```bash
# Push schema to Neon
bun run db:push

# Seed admin user (creates default admin/admin account)
bun run db:seed:admin

# Seed content data
bun run db:seed:data
```

### 4. Start development server

```bash
bun run dev
```

Open [http://localhost:4000](http://localhost:4000).

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server on port 4000 |
| `bun run build` | Production build |
| `bun run start` | Start production server on port 4000 |
| `bun run lint` | Run ESLint |
| `bun run test` | Run Playwright E2E tests |
| `bun run test:unit` | Run Vitest unit tests |
| `bun run db:push` | Push schema changes to Neon |
| `bun run db:seed` | Seed admin + content data |
| `bun run db:generate` | Generate Drizzle migration files |
| `bun run analyze` | Build with bundle analyzer |

## Environment Variables

See `.env.example` for the full template.

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `ADMIN_JWT_SECRET` | Yes | Secret key for JWT signing (generate with `openssl rand -base64 32`) |
| `RESEND_API_KEY` | No | Resend API key for contact form emails |
| `CONTACT_EMAIL` | No | Email address to receive contact form submissions |
| `NEXT_PUBLIC_SITE_URL` | No | Site URL for sitemap and canonical links |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics 4 measurement ID |

## Architecture

```
Browser → Next.js App Router
            ├── Static sections (SSG/ISR)
            └── API routes (serverless functions)
                  ├── Public: /api/projects, /api/skills, ...
                  └── Admin: /api/admin/* (JWT-protected)
                        └── Neon PostgreSQL (serverless driver)
```

- **Public data** is fetched client-side via `useApiData` hook with fallback defaults
- **Admin routes** validate JWT from httpOnly cookies on every request
- **Project images** are converted to WebP and stored as data URLs in the database
- **Documents** are stored on the filesystem (ephemeral on Vercel, persistent locally)

## Deployment

The project deploys automatically to [Vercel](https://vercel.com) on push to `main`.

```bash
# Manual deploy
vercel --prod
```

### Vercel Setup

1. Connect your GitHub repository
2. Set environment variables in the Vercel dashboard
3. Ensure `DATABASE_URL` points to your Neon pooler endpoint
4. Deploy — the build uses `bun run build`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).

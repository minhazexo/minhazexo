# 🚀 Vercel Deployment Guide

Complete guide to deploying **MD Mehrab Hossain — Portfolio** to [Vercel](https://vercel.com).

The project uses **Next.js 14 (App Router)**, **Bun** as the package manager, and a **Neon (PostgreSQL)** database. It is fully configured for a zero-config Vercel deployment — the only manual step is adding environment variables.

---

## 1. Prerequisites

- A [GitHub](https://github.com) repository containing this project (bun.lock committed — it already is).
- A [Vercel](https://vercel.com) account (sign in with GitHub for the fastest flow).
- A [Neon](https://neon.tech) PostgreSQL database with a connection string.
  - This project uses **one database**: `DATABASE_URL` in `.env.local`.
  - Example: `postgresql://neondb_owner:xxxxx@ep-xxx-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`

---

## 2. Deploy via Vercel Dashboard (recommended)

1. Go to [vercel.com/new](https://vercel.com/new).
2. **Import** your GitHub repository.
3. Vercel auto-detects the framework as **Next.js**.
4. Confirm the build settings (auto-filled — see table below).
5. **Add the environment variables** listed in §3.
6. Click **Deploy**. 🎉

### Auto-detected build settings

| Setting          | Value                          |
| ---------------- | ------------------------------ |
| Framework Preset | Next.js                        |
| Build Command    | `bun run build`                |
| Install Command  | `bun install`                  |
| Output Directory | `Next.js (default)` / `.next`  |
| Node.js Version  | 20.x (matches `.nvmrc`)        |

> Vercel includes a built-in Bun runtime. If a "Build Command" override is ever needed, the exact command is `bun run build`.

---

## 3. Environment Variables

Add these in **Project → Settings → Environment Variables** (add them for `Production`, `Preview`, and `Development`):

| Variable                 | Required | Value                                                                 |
| ------------------------ | -------- | --------------------------------------------------------------------- |
| `DATABASE_URL`           | ✅ Yes    | Your Neon connection string (same as `.env.local`)                    |
| `ADMIN_JWT_SECRET`       | ✅ Yes    | Long random secret — generate with `openssl rand -base64 32`          |
| `RESEND_API_KEY`         | ⚠ No     | Needed only for the contact form emails (`re_...`)                     |
| `CONTACT_EMAIL`          | ⚠ No     | Recipient address for the contact form                                 |
| `NEXT_PUBLIC_SITE_URL`   | ⚠ No     | Your production URL, e.g. `https://mehrabhossain.dev`                  |
| `NEXT_PUBLIC_GA_ID`      | ⚠ No     | Google Analytics 4 measurement ID (`G-XXXXXXXXXX`)                     |

> 🔒 **Never** commit real secrets. `.env.local` is already git-ignored.
>
> ⚠️ **Precedence gotcha:** Next.js gives real shell/CI environment variables precedence over `.env.local`. If `DATABASE_URL` is exported in your shell (or set in an old CI env), it silently overrides `.env.local` and the site will connect to the wrong database. If you ever see stale data, run `unset DATABASE_URL` (or `env -u DATABASE_URL bun run dev`) and confirm the Vercel env var holds the new connection string.

---

## 4. Deploy via Vercel CLI (alternative)

```bash
# Install the Vercel CLI (with bun)
bun add -g vercel

# Or with npm
npm i -g vercel

# Login
vercel login

# Link the project folder
vercel link

# Add environment variables (repeat for production/preview)
vercel env add DATABASE_URL
vercel env add ADMIN_JWT_SECRET
vercel env add RESEND_API_KEY        # optional
vercel env add NEXT_PUBLIC_SITE_URL  # optional

# Deploy
vercel --prod
```

---

## 5. Database Setup (one-time, after first deploy)

The Neon database must be **seeded** once before the site shows content. From your local machine:

```bash
# 1. Make sure .env.local points to your database
# 2. Push the Drizzle schema (creates tables)
bun run db:push

# 3. Seed admin user + all content (projects, skills, experience, testimonials)
bun run db:seed
```

Default admin credentials:

| Username | Password   |
| -------- | ---------- |
| `admin`  | `admin123` |

> ⚠ **Change the admin password immediately** after first login via the admin panel at `/admin`.

---

## 6. Custom Domain

1. In your Vercel project: **Settings → Domains**.
2. Add your domain, e.g. `mehrabhossain.dev`.
3. Follow the DNS instructions shown (point the `A`/`CNAME` records at Vercel).
4. Vercel auto-provisions HTTPS.

---

## 7. After Deploy — Checklist

- [ ] Site loads at the production URL.
- [ ] `NEXT_PUBLIC_SITE_URL` matches the final domain (for SEO/sitemap).
- [ ] `/admin` login works with the seeded credentials.
- [ ] Projects section shows all 8 projects; "Singularity" Live Demo opens `https://blackholesimulation.vercel.app/`.
- [ ] Contact form works (if `RESEND_API_KEY` is set).
- [ ] **Hard refresh** the browser (Ctrl/Cmd+Shift+R) once so the v2 service worker (`sw.js`) takes over and clears the old cache.

---

## 8. Troubleshooting

| Symptom                                          | Fix                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------- |
| API routes return `500`                          | Check `DATABASE_URL` env var in Vercel; verify DB is seeded          |
| Site shows static fallback data                  | API request failed → confirm DB connectivity + seed                  |
| Old data / stale links in browser                | Hard refresh; the service worker never caches `/api/*` (v2)          |
| Contact form doesn't send emails                 | Add `RESEND_API_KEY` + `CONTACT_EMAIL` and redeploy                  |
| Admin login fails                                | Re-run `bun run db:seed:admin` locally                              |
| Build fails with memory error                    | Increase function memory or reduce `experimental` config             |
| `next/image` errors for remote images            | Add the domain to `images.remotePatterns` in `next.config.mjs`       |

### Important notes

- All public API routes (`/api/projects`, `/api/skills`, ...) use `force-dynamic` — they always read fresh data from the database.
- The service worker (`public/sw.js`) is configured to **never cache API responses**, so admin edits appear immediately after a reload.
- `vercel.json` contains the security & cache headers (moved from the old Netlify `_headers`).

---

## 9. Redeploying after changes

Every push to the connected branch triggers a production deployment automatically.

```bash
git add -A && git commit -m "update" && git push origin main
```

Or trigger manually:

```bash
vercel --prod
```

---

### Related docs

- [`ADMIN.md`](./ADMIN.md) — managing content via the admin panel
- [`README.md`](../README.md) — project overview & local development

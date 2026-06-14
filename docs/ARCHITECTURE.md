# Architecture Overview — MD Mehrab Hossain Portfolio

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14 (App Router) | SSR/SSG, routing, API routes |
| Language | TypeScript 5.5 | Type safety, intellisense |
| Styling | Tailwind CSS 3.4 + CSS Variables | Utility-first + runtime theming |
| Animation | Framer Motion 11 | Scroll-driven, gestures, layout animations |
| Icons | Lucide React | Lightweight SVG icon set |
| State (Client) | React Context + localStorage | Theme, background effects, music prefs |
| Email | Resend | Contact form delivery |
| Deployment | Netlify | Edge network + Next.js plugin |

---

## Directory Structure

```
src/
├── app/
│   ├── api/contact/route.ts    # POST /api/contact — email submission
│   ├── layout.tsx               # Root layout — providers, metadata, schemas
│   ├── page.tsx                 # SPA-style home page with lazy sections
│   └── loading.tsx              # Next.js route-level loading fallback
├── components/
│   ├── effects/                 # Visual effects (canvas, SVG, DOM animations)
│   │   ├── AuroraBorealis.tsx
│   │   ├── BackgroundEffectRenderer.tsx  # Dynamic effect router
│   │   ├── BackgroundMusic.tsx
│   │   ├── CinematicSection.tsx          # Reusable section wrapper
│   │   ├── CinematicText.tsx             # Staggered character/word reveal
│   │   ├── ConstellationMap.tsx
│   │   ├── DigitalRain.tsx
│   │   ├── FloatingOrbs.tsx
│   │   ├── GeometricPattern.tsx
│   │   ├── NoiseOverlay.tsx
│   │   ├── ParticleBackground.tsx
│   │   ├── ProjectDetailModal.tsx        # Portal-based modal
│   │   ├── RetroGrid.tsx
│   │   ├── ScrollProgress.tsx            # Top bar + side nav dots
│   │   ├── ThemeTransition.tsx           # Warp flash on theme change
│   │   ├── TiltCard.tsx                  # Card entrance animation wrapper
│   │   └── WaveFlowField.tsx
│   ├── layout/
│   │   ├── BackToTop.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── providers/
│   │   ├── BackgroundEffectsProvider.tsx  # Context + localStorage
│   │   └── ThemeProvider.tsx             # next-themes wrapper
│   ├── sections/
│   │   ├── AboutSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   └── SkillsSection.tsx
│   └── ui/
│       ├── BackgroundEffectSwitcher.tsx
│       ├── LoadingScreen.tsx            # Galaxy spinner overlay
│       └── ThemeSwitcher.tsx
├── data/                  # All static content
│   ├── about.ts
│   ├── assets.ts
│   ├── backgrounds.ts
│   ├── hero.ts
│   ├── navigation.ts
│   ├── projects.ts
│   ├── skills.ts
│   ├── social.ts
│   └── themes.ts
├── hooks/
│   └── useCinematicReveal.ts       # Reusable scroll-reveal hook
├── lib/
│   └── utils.ts                    # cn(), throttle(), localStorage helpers
├── styles/
│   └── globals.css                 # ~1800 lines of CSS variables, utilities, a11y
└── types/
    └── index.ts                    # Shared TypeScript interfaces
```

---

## Component Tree (Runtime)

```
<html> (ThemeProvider > next-themes)
  <body>
    <SkipToContent />
    <PageAmbient />        <!-- CSS ambient glow -->
    <VignetteOverlay />    <!-- Fixed vignette -->
    <ScrollProgress />     <!-- Top progress bar (Framer Motion spring) -->
    <ThemeProvider (next-themes)>
      <BackgroundEffectsProvider>
        <ThemeTransition />         <!-- Warp flash overlay -->
        <NoiseOverlay />            <!-- Film grain -->
        <SectionProgress />         <!-- Right-side navigation dots -->
        <main>
          <Home />
            └─ <LoadingScreen />             <!-- AnimatePresence exit -->
            └─ <BackgroundEffectRenderer />   <!-- Dynamic effect loader -->
            └─ <Navigation />                <!-- Sticky + mobile menu -->
            └─ <HeroSection />
            └─ <AboutSection />              <!-- lazy -->
            └─ <ProjectsSection />           <!-- lazy -->
            └─ <SkillsSection />             <!-- lazy -->
            └─ <ContactSection />            <!-- lazy -->
            └─ <Footer />                   <!-- lazy -->
            └─ <BackToTop />                <!-- lazy -->
            └─ <BackgroundMusic />           <!-- lazy -->
        </main>
      </BackgroundEffectsProvider>
    </ThemeProvider>
  </body>
</html>
```

---

## Data Flow

### Static Content
All copy, project data, skills, social links, and navigation live in `src/data/*.ts`. Sections import these directly — no CMS, no API calls for content.

### Theme System
```
User clicks ThemeSwitcher
  → next-themes setTheme(value)
    → <html class="dark|light|pink|red|...">
      → CSS variables cascade (globals.css)
        → All components consume var(--primary), var(--secondary), etc.
```

### Background Effects
```
User picks effect in BackgroundEffectSwitcher
  → Context setBackgroundEffect(value)
    → localStorage('background-effect')
      → BackgroundEffectRenderer reads context
        → Dynamically loads effect component (next/dynamic)
```

### Contact Form
```
User submits ContactSection form
  → POST /api/contact
    → Rate limit check (in-memory Map)
    → Server-side validation
    → Resend SDK sendEmail()
    → JSON response
  → LaunchConfirmation overlay shown
```

### Loading Sequence
```
Page mount → LoadingScreen appears
  → Preload images (Image() objects, count total)
  → fonts.ready → fontsLoaded = true
  → isReady (all images loaded) && fontsLoaded && 1.5s elapsed
    → set displayProgress → 100 → exit animation
      → Main content renders
```

---

## Performance Patterns Used

1. **Lazy loading** — 7 components via `React.lazy()` + `<Suspense>`
2. **Dynamic imports** — `BackgroundEffectRenderer`, `ProjectDetailModal` via `next/dynamic` with `ssr: false`
3. **`content-visibility: auto`** — All `section[id]` elements
4. **Image preloading** — Critical images loaded before main content renders
5. **`will-change` hints** — Canvas elements, transform animations
6. **`contain-intrinsic-size`** — Space reserved for below-fold sections
7. **`memo()`** — `ProjectsSection`, `SkillsSection`, `Footer`, form subcomponents
8. **`useMemo`** — Stats array in HeroSection

---

## Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| SPA-style single page with section IDs | Smooth scroll navigation, no route transitions, simpler state |
| CSS variables for theming | Runtime theme switching without full re-render; Tailwind `darkMode: 'class'` |
| Data layer as `.ts` files | Zero network cost, tree-shakeable, type-safe, easy to edit |
| Provider pattern for effects | Simple context + localStorage — no server state library needed |
| Portal for modal | Avoids z-index / overflow clipping issues from parent containers |
| `loading="lazy"` on section images | Defers off-screen images; Next.js Image handles optimization |
| Resend for email | Simple transactional email API with good DX |

---

## Theme & Color Blind System

Themes are implemented via CSS class-based variables. Each theme (dark, light, pink, red, blue, green, purple, orange, cyan, rose) defines ~30 CSS custom properties under its class selector.

Color blindness compensation is orthogonal: a `data-colorblind` attribute on `<html>` triggers alternative variable sets for deuteranopia, protanopia, tritanopia, and achromatopsia — layered on top of any theme.

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `RESEND_API_KEY` | No (falls back to console.log) | Contact form email delivery |
| `CONTACT_EMAIL` | No (default: mehrabhossain7102@gmail.com) | Recipient for contact messages |
| `NEXT_PUBLIC_SITE_URL` | No (default: https://mehrabhossain.dev) | Base URL for OG/sitemap |

---

## Build & Deployment

```bash
npm run dev      # next dev -p 4000
npm run build    # next build
npm run start    # next start -p 4000
npm run lint     # next lint
```

Netlify builds via `@netlify/plugin-nextjs`. Security headers in `public/_headers`. PWA manifest at `/manifest.json`.

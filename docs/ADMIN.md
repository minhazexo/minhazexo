# Admin Guide — Content Management

This portfolio has **no admin panel**. All content is managed by editing TypeScript files directly. This guide covers everything you need to add, edit, or remove content.

---

## Table of Contents

- [Adding a Project](#adding-a-project)
- [Editing a Project](#editing-a-project)
- [Adding a Skill](#adding-a-skill)
- [Editing About Milestones](#editing-about-milestones)
- [Adding a Theme](#adding-a-theme)
- [Managing Navigation Links](#managing-navigation-links)
- [Updating Social Links](#updating-social-links)
- [Image Management](#image-management)
- [Building a Real Admin Panel](#building-a-real-admin-panel)

---

## Adding a Project

**File:** `src/data/projects.ts`

### Step 1: Add Project Images

Place images in `public/`:
- `public/project-yourname.png` (screenshot)
- `public/project-yourname.jpg` (fallback)

### Step 2: Add the Project Object

```typescript
{
  id: 'your-project-slug',
  title: 'Your Project Title',
  description: 'A concise one-line description.',
  longDescription: 'A detailed multi-sentence description shown in the modal.',
  image: '/project-yourname.png',
  imageFallback: '/project-yourname.jpg',
  category: 'fullstack', // "fullstack" | "frontend" | "backend" | "mobile" | "ai"
  tags: ['React', 'Node.js', 'PostgreSQL'],
  features: [
    'Key feature one',
    'Key feature two',
    'Key feature three',
  ],
  links: {
    live: 'https://example.com',
    github: 'https://github.com/username/repo',
  },
}
```

### Step 3: Add to the `projects` array

Append the object to the `projects` array in the same file.

### Available Categories

Defined in `categories` array—currently: `fullstack`, `frontend`, `backend`, `mobile`, `ai`. You can add new categories there too.

---

## Editing a Project

Find the project object in `src/data/projects.ts` by its `id` and modify any field. The modal will automatically reflect changes.

### To Remove a Project

Delete its object from the `projects` array. Remove images from `public/` if no longer needed.

---

## Adding a Skill

**File:** `src/data/skills.ts`

### Option A: Add to a Skill Category

Find the right category (`Frontend`, `Backend`, `Tools`):

```typescript
{
  name: 'Skill Name',
  icon: '<SiYourIcon />', // Optional react-icons component
  level: 90,              // 0-100 proficiency
  color: '#your-hex',     // accent color
}
```

Append to the `skills` array inside the appropriate `skillCategories` entry.

### Option B: Add to Top Skills (Hero Section)

Add the skill name to the `topSkills` array. Use exact name matching with the skill categories above.

### Option C: Add Orbit Skills (Hero Animation)

Add a `{ name: 'Skill', color: '#hex' }` object to the `orbitSkills` array.

---

## Editing About Milestones

**File:** `src/data/about.ts`

### Add a Milestone

```typescript
{
  year: '2025',
  title: 'What Happened',
  description: 'Detailed description of the milestone.',
  icon: 'code',   // Lucide icon name: "code" | "briefcase" | "graduation-cap" | "award"
}
```

### Update Skill Bars

The `skills` array controls the skill progress bars in the About section:

```typescript
{
  name: 'Skill Name',
  level: 85,  // 0-100
  icon: '💻', // Any emoji
}
```

---

## Adding a Theme

**File:** `src/data/themes.ts`

```typescript
{
  id: 'your-theme',
  name: 'Your Theme',
  type: 'dark',       // "dark" | "light"
  description: 'What this theme looks like',
  color: '#hex',      // Primary accent for preview dot
  isNew: false,       // Set true to show a "NEW" badge
}
```

Then add corresponding CSS variables in `src/styles/globals.css`:

```css
.your-theme {
  --primary: #YOURHEX;
  --secondary: #YOURHEX;
  --accent: #YOURHEX;
  --bg-primary: #YOURHEX;
  --bg-secondary: #YOURHEX;
  /* ... all 31 variables */
}
```

---

## Managing Navigation Links

**File:** `src/data/navigation.ts`

Edit the `navLinks` array. Each link:

```typescript
{
  href: '#section-id', // Must match an id on the page
  label: 'Link Text',
  icon: <Home />,      // Lucide React icon component
}
```

---

## Updating Social Links

**File:** `src/data/social.ts`

Two arrays:
- `footerSocialLinks` — shown in footer
- `contactSocialLinks` — shown in contact section

Each link:

```typescript
{
  name: 'GitHub',
  url: 'https://github.com/yourhandle',
  icon: <Github />, // Lucide icon
}
```

---

## Image Management

**File:** `src/data/assets.ts`

- `imageAssets` — all images with path, alt text, and preload priority
- `preloadImages` — critical images loaded before app renders
- `audioAssets` — background music path

When adding new images, update the preload list if they're critical (above the fold).

---

## Building a Real Admin Panel

If you want a proper admin panel, here's the recommended approach:

### Option 1: Headless CMS (Recommended)

Use **Sanity** or **Hygraph** as a headless CMS:

```bash
npm install @sanity/client @sanity/image-url
```

1. Create a Sanity project with schemas for Project, Skill, Milestone, etc.
2. Replace hardcoded data in `src/data/` with CMS client queries
3. Add admin routes at `/admin` for content management
4. Use Next.js API routes as proxy for secure CMS tokens

### Option 2: Local JSON + Admin Route

Add a lightweight admin panel within the app:

1. Create `src/app/admin/` routes (protected by basic auth or a simple password)
2. Store content as JSON files in a `content/` directory
3. Admin forms read/write JSON via API routes
4. Use `fs` in API routes (server-only) to persist changes

### Option 3: GitHub-based CMS

Use the GitHub API as a data store:

1. Store content as JSON in a `data/` branch or a separate repo
2. Admin panel commits changes via GitHub API
3. Netlify rebuilds on new commits

### Recommended Tools

| Tool | Purpose |
|---|---|
| **Sanity** | Best DX, real-time preview, free tier |
| **Hygraph** | GraphQL-native, generous free tier |
| **Payload CMS** | Self-hosted, Next.js native |
| **TinaCMS** | Git-backed, works with local Markdown/JSON |

### Example: Sanity integration steps

1. Define schemas in a `sanity/` folder
2. Import `@sanity/client` in data files
3. Fetch data in Server Components or during `getStaticProps`
4. Deploy Sanity Studio separately or embed at `/admin`

---

## Quick Reference

| Task | File |
|---|---|
| Add/edit project | `src/data/projects.ts` + `public/` images |
| Add/edit skill | `src/data/skills.ts` |
| Edit about section | `src/data/about.ts` |
| Change hero stats | `src/data/hero.ts` |
| Add theme | `src/data/themes.ts` + `src/styles/globals.css` |
| Navigation links | `src/data/navigation.ts` |
| Social links | `src/data/social.ts` |
| Image paths | `src/data/assets.ts` |

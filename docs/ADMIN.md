# Admin Guide — Content Management

The portfolio includes a full admin dashboard at `/admin` for managing all content through the database.

---

## Accessing the Admin Panel

1. Navigate to `/admin/login`
2. Sign in with your admin credentials (default: `admin` / `admin123`)
3. You'll see tabs for **Projects**, **Skills**, **Experience**, and **Testimonials**

## Managing Content

Each tab provides a table view of your data with **Add**, **Edit**, and **Delete** actions.

### Projects

Fields: title, description, image path, tech stack (comma-separated), category, GitHub URL, demo URL.

### Skills

Fields: name, category (Frontend / Backend / Tools & Others), proficiency level (0–100), color hex.

### Experience

Fields: role, company, period, description, highlights (comma-separated), tech (comma-separated), color hex.

### Testimonials

Fields: name, role, company, avatar path, content, rating (1–5), color hex.

---

## Seeding Data

If the database is empty, run:

```bash
bun run db:seed
```

This populates all tables with the default portfolio content.

---

## Fallback Data

If the database API is unavailable, the public site falls back to static data files in `src/data/`. These files serve as both fallback and reference for the expected data shape:

| File | Content |
|---|---|
| `src/data/projects.ts` | Project entries |
| `src/data/skills.ts` | Skill categories and levels |
| `src/data/experience.ts` | Work history |
| `src/data/testimonials.ts` | Client testimonials |
| `src/data/about.ts` | About section info and stats |
| `src/data/hero.ts` | Hero stats and tech tags |
| `src/data/features.ts` | Feature cards |
| `src/data/navigation.ts` | Navigation links |
| `src/data/social.ts` | Social media links |
| `src/data/themes.ts` | Theme definitions |
| `src/data/assets.ts` | Image and audio asset paths |

---

## Quick Reference

| Task | Location |
|---|---|
| Admin login | `/admin/login` |
| Manage projects | `/admin` → Projects tab |
| Manage skills | `/admin` → Skills tab |
| Manage experience | `/admin` → Experience tab |
| Manage testimonials | `/admin` → Testimonials tab |
| Seed database | `bun run db:seed` |
| Database schema | `src/lib/db/schema.ts` |
| Public API routes | `src/app/api/{projects,skills,experience,testimonials}/` |
| Admin API routes | `src/app/api/admin/{projects,skills,experience,testimonials}/` |

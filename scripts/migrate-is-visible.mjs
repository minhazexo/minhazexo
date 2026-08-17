// Safe, idempotent migration: adds `is_visible` to the projects table.
// Existing and new projects default to visible (true). Run against any
// environment (local/production) as many times as needed — it is a no-op
// once the column already exists.
//
//   bun run db:migrate:visibility
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

async function migrate() {
  console.log('Running migration: add projects.is_visible ...')

  await sql`
    ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true
  `

  console.log('  ✓ projects.is_visible column added (existing projects default to visible)')

  const rows = await sql`
    SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE is_visible = true) AS visible
    FROM projects
  `
  console.log(`  ✓ ${rows[0].total} projects — ${rows[0].visible} visible, ${Number(rows[0].total) - Number(rows[0].visible)} hidden`)
  console.log('Migration complete!')
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})

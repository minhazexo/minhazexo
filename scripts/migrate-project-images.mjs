import { neon } from '@neondatabase/serverless'
import { readFileSync, existsSync } from 'fs'
import { readFile } from 'fs/promises'
import path from 'path'

// Load env
const envPath = new URL('../.env.local', import.meta.url)
const envContent = existsSync(envPath) ? readFileSync(envPath, 'utf-8') : ''
const vars = Object.fromEntries(
  envContent.split('\n').filter(l => l.includes('=')).map(l => {
    const [k, ...v] = l.split('=')
    return [k.trim(), v.join('=').trim()]
  })
)
const DATABASE_URL = vars.DATABASE_URL || process.env.DATABASE_URL
if (!DATABASE_URL) { console.error('DATABASE_URL not found'); process.exit(1) }

const sql = neon(DATABASE_URL)

// storage helper (importing via dynamic to reuse sharp logic)
const { saveProjectImage } = await import('../src/lib/storage.ts').catch(async () => {
  // fallback: direct implementation without TS import (for mjs)
  // we replicate saveProjectImage using same logic as storage.ts but in JS
  const { mkdir, writeFile } = await import('fs/promises')
  const UPLOAD_ROOT = process.env.VERCEL ? '/tmp/uploads' : path.join(process.cwd(), 'private_uploads')
  const PROJECT_DIR = path.join(UPLOAD_ROOT, 'projects')
  async function ensureDir(dir) { if (!existsSync(dir)) await mkdir(dir, { recursive: true }) }
  function sanitize(name) { return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0,200) }
  return {
    saveProjectImage: async (buffer, originalName) => {
      await ensureDir(PROJECT_DIR)
      let outBuffer = buffer
      let ext = '.webp'
      try {
        const sharp = (await import('sharp')).default
        outBuffer = await sharp(buffer).rotate().resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 82, effort: 4 }).toBuffer()
      } catch { outBuffer = buffer; ext = path.extname(originalName) || '.webp' }
      const base = sanitize(path.basename(originalName, path.extname(originalName)))
      const storedName = `${Date.now()}-${Math.random().toString(36).slice(2,8)}-${base}${ext}`
      const fullPath = path.join(PROJECT_DIR, storedName)
      await writeFile(fullPath, outBuffer)
      return { storedName, storageKey: fullPath, publicUrl: `/api/projects/images/${storedName}` }
    }
  }
})

async function migrate() {
  console.log('Fetching projects...')
  const rows = await sql`SELECT id, title, image FROM projects ORDER BY id`
  console.log(`Found ${rows.length} projects`)
  let migrated = 0
  let skipped = 0
  let failed = 0

  for (const row of rows) {
    const img = row.image
    if (!img) { skipped++; continue }
    if (img.startsWith('/api/projects/images/')) {
      console.log(`  [skip] #${row.id} "${row.title}" already migrated → ${img}`)
      skipped++
      continue
    }
    if (img.startsWith('http://') || img.startsWith('https://')) {
      console.log(`  [skip] #${row.id} "${row.title}" external URL → ${img}`)
      skipped++
      continue
    }
    // Resolve static file path under public/
    // Handles encoded spaces like /Project%20Photo/project-weather.webp
    let decoded = ''
    try { decoded = decodeURIComponent(img) } catch { decoded = img }
    // Remove leading slash
    const relative = decoded.replace(/^\//, '')
    const publicPath = path.join(process.cwd(), 'public', relative)
    console.log(`  [migrate] #${row.id} "${row.title}" ${img} → ${publicPath}`)

    if (!existsSync(publicPath)) {
      console.warn(`    ⚠ file not found: ${publicPath} — keeping original DB value`)
      failed++
      continue
    }
    try {
      const buffer = await readFile(publicPath)
      const originalName = path.basename(publicPath)
      // Use storage helper (will sharp-optimize to webp)
      // Direct import may have TS issue, so we implement inline
      const { mkdir, writeFile: wf } = await import('fs/promises')
      const UPLOAD_ROOT = process.env.VERCEL ? '/tmp/uploads' : path.join(process.cwd(), 'private_uploads')
      const PROJECT_DIR = path.join(UPLOAD_ROOT, 'projects')
      if (!existsSync(PROJECT_DIR)) await mkdir(PROJECT_DIR, { recursive: true })
      let outBuffer = buffer
      let ext = '.webp'
      try {
        const sharp = (await import('sharp')).default
        outBuffer = await sharp(buffer).rotate().resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 82, effort: 4 }).toBuffer()
      } catch (e) {
        console.warn('    sharp failed, using raw buffer', e.message)
        outBuffer = buffer
        ext = path.extname(originalName) || '.webp'
      }
      const base = originalName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0,200).replace(path.extname(originalName),'')
      const cleanBase = path.basename(originalName, path.extname(originalName)).replace(/[^a-zA-Z0-9._-]/g,'_').slice(0,80) || 'project'
      const storedName = `${Date.now()}-${Math.random().toString(36).slice(2,8)}-${cleanBase}${ext}`
      const fullPath = path.join(PROJECT_DIR, storedName)
      await wf(fullPath, outBuffer)
      const publicUrl = `/api/projects/images/${storedName}`
      await sql`UPDATE projects SET image=${publicUrl}, updated_at=NOW() WHERE id=${row.id}`
      console.log(`    ✓ migrated → ${publicUrl} (${buffer.length} → ${outBuffer.length} bytes)`)
      migrated++
      // small delay to ensure unique timestamps
      await new Promise(r => setTimeout(r, 10))
    } catch (e) {
      console.error(`    ✗ failed #${row.id}`, e)
      failed++
    }
  }

  console.log(`\nDone. Migrated: ${migrated}, Skipped: ${skipped}, Failed: ${failed}`)
  const after = await sql`SELECT id, title, image FROM projects ORDER BY id`
  console.log('\nAfter:')
  for (const r of after) console.log(`  #${r.id} ${r.title} → ${r.image}`)
}

migrate().catch(e => { console.error(e); process.exit(1) })

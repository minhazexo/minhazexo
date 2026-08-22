import { neon } from '@neondatabase/serverless'
import { readFileSync, existsSync } from 'fs'
import { readFile } from 'fs/promises'
import path from 'path'

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

function isDataUrl(url) { return url && url.startsWith('data:image/') }
function isBlobUrl(url) { return url && url.startsWith('https://') && url.includes('blob.vercel-storage.com') }

async function toDataUrl(buffer, originalName) {
  let out = buffer
  try {
    const sharp = (await import('sharp')).default
    out = await sharp(buffer).rotate().resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 82, effort: 4 }).toBuffer()
  } catch {}
  return `data:image/webp;base64,${out.toString('base64')}`
}

async function migrate() {
  console.log('Fetching projects...')
  const rows = await sql`SELECT id, title, image FROM projects ORDER BY id`
  console.log(`Found ${rows.length} projects`)
  let migrated = 0, skipped = 0, failed = 0
  for (const row of rows) {
    const img = row.image
    if (!img) { skipped++; continue }
    if (isDataUrl(img)) {
      console.log(`  [skip] #${row.id} "${row.title}" already data URL (${Math.round(img.length/1024)}KB)`)
      skipped++
      continue
    }
    if (isBlobUrl(img)) {
      console.log(`  [migrate blob→data] #${row.id} "${row.title}" fetching blob...`)
      try {
        const res = await fetch(img)
        if (!res.ok) throw new Error(`fetch ${res.status}`)
        const buf = Buffer.from(await res.arrayBuffer())
        const dataUrl = await toDataUrl(buf, 'blob.webp')
        await sql`UPDATE projects SET image=${dataUrl}, updated_at=NOW() WHERE id=${row.id}`
        console.log(`    ✓ blob → data URL (${Math.round(dataUrl.length/1024)}KB)`)
        migrated++
        continue
      } catch (e) {
        console.error(`    ✗ blob fetch failed #${row.id}`, e.message)
        failed++
        continue
      }
    }
    if (img.startsWith('/api/projects/images/')) {
      const filename = path.basename(new URL(img, 'http://localhost').pathname)
      const candidates = [
        path.join(process.cwd(), 'private_uploads', 'projects', filename),
        path.join('/tmp/uploads', 'projects', filename),
      ]
      let found = null
      for (const p of candidates) if (existsSync(p)) { found = p; break }
      if (!found) {
        console.warn(`  [miss] #${row.id} "${row.title}" local file not found for ${img}`)
        failed++
        continue
      }
      console.log(`  [migrate local→data] #${row.id} "${row.title}" ${found}`)
      try {
        const buf = await readFile(found)
        const dataUrl = await toDataUrl(buf, filename)
        await sql`UPDATE projects SET image=${dataUrl}, updated_at=NOW() WHERE id=${row.id}`
        console.log(`    ✓ local → data URL (${Math.round(dataUrl.length/1024)}KB)`)
        migrated++
      } catch (e) {
        console.error(`    ✗ failed #${row.id}`, e.message)
        failed++
      }
      continue
    }
    // Legacy public path like /Project Photo/... or /webp/...
    let decoded = img
    try { decoded = decodeURIComponent(img) } catch {}
    const relative = decoded.replace(/^\//, '')
    const publicPath = path.join(process.cwd(), 'public', relative)
    if (existsSync(publicPath)) {
      console.log(`  [migrate public→data] #${row.id} "${row.title}" ${publicPath}`)
      try {
        const buf = await readFile(publicPath)
        const dataUrl = await toDataUrl(buf, path.basename(publicPath))
        await sql`UPDATE projects SET image=${dataUrl}, updated_at=NOW() WHERE id=${row.id}`
        console.log(`    ✓ public → data URL (${Math.round(dataUrl.length/1024)}KB)`)
        migrated++
      } catch (e) {
        console.error(`    ✗ failed #${row.id}`, e.message)
        failed++
      }
      continue
    }
    if (img.startsWith('http://') || img.startsWith('https://')) {
      console.log(`  [skip] #${row.id} external URL → ${img}`)
      skipped++
      continue
    }
    console.warn(`  [skip unknown] #${row.id} ${img}`)
    skipped++
  }
  console.log(`\nDone. Migrated: ${migrated}, Skipped: ${skipped}, Failed: ${failed}`)
  const after = await sql`SELECT id, title, length(image) as len, substring(image,1,30) as preview FROM projects ORDER BY id`
  console.log('\nAfter:')
  for (const r of after) console.log(`  #${r.id} ${r.title} len=${r.len} preview=${r.preview}...`)
  if (migrated > 0) console.log('\n✓ Images now stored durably in Neon (data URLs). No Vercel config needed. Fresh deploys will keep images.')
}

migrate().catch(e => { console.error(e); process.exit(1) })

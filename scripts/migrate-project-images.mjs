import { neon } from '@neondatabase/serverless'
import { readFileSync, existsSync } from 'fs'
import { readFile, mkdir, writeFile } from 'fs/promises'
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

const BLOB_TOKEN = vars.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN
const sql = neon(DATABASE_URL)

function isBlobUrl(url) {
  return url && url.startsWith('https://') && url.includes('blob.vercel-storage.com')
}

async function saveToBlobOrLocal(buffer, originalName) {
  // sharp optimize
  let outBuffer = buffer
  let ext = '.webp'
  try {
    const sharp = (await import('sharp')).default
    outBuffer = await sharp(buffer).rotate().resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 82, effort: 4 }).toBuffer()
  } catch (e) {
    console.warn('  sharp failed, using raw', e.message)
    outBuffer = buffer
    ext = path.extname(originalName) || '.webp'
    if (!['.webp', '.jpg', '.jpeg', '.png', '.gif', '.avif'].includes(ext.toLowerCase())) ext = '.webp'
  }

  const base = path.basename(originalName, path.extname(originalName)).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80) || 'project'
  const storedName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}${ext}`

  if (BLOB_TOKEN) {
    try {
      const { put } = await import('@vercel/blob')
      const blob = await put(`projects/${storedName}`, outBuffer, {
        access: 'public',
        contentType: 'image/webp',
        addRandomSuffix: false,
      })
      console.log(`  → blob: ${blob.url}`)
      return { publicUrl: blob.url, size: outBuffer.length }
    } catch (e) {
      console.error('  Blob put failed, falling back to local filesystem', e.message)
    }
  } else {
    console.log('  ℹ BLOB_READ_WRITE_TOKEN not set — using local filesystem (will 404 on Vercel). Set token for durable production storage.')
  }

  // Fallback: local filesystem (dev without blob)
  const UPLOAD_ROOT = process.env.VERCEL ? '/tmp/uploads' : path.join(process.cwd(), 'private_uploads')
  const PROJECT_DIR = path.join(UPLOAD_ROOT, 'projects')
  if (!existsSync(PROJECT_DIR)) await mkdir(PROJECT_DIR, { recursive: true })
  const fullPath = path.join(PROJECT_DIR, storedName)
  await writeFile(fullPath, outBuffer)
  const publicUrl = `/api/projects/images/${storedName}`
  console.log(`  → local: ${publicUrl}`)
  return { publicUrl, size: outBuffer.length }
}

async function migrate() {
  console.log('Fetching projects...')
  console.log(`Blob enabled: ${!!BLOB_TOKEN}`)
  const rows = await sql`SELECT id, title, image FROM projects ORDER BY id`
  console.log(`Found ${rows.length} projects`)
  let migrated = 0, skipped = 0, failed = 0

  for (const row of rows) {
    const img = row.image
    if (!img) { skipped++; continue }
    if (isBlobUrl(img)) {
      console.log(`  [skip] #${row.id} "${row.title}" already blob → ${img}`)
      skipped++
      continue
    }

    let buffer = null
    let originalName = 'project.webp'

    if (img.startsWith('/api/projects/images/')) {
      if (!BLOB_TOKEN) {
        console.log(`  [skip] #${row.id} "${row.title}" already local (no blob token, keep) → ${img}`)
        skipped++
        continue
      }
      // Migrate local file to blob
      const filename = path.basename(new URL(img, 'http://localhost').pathname)
      const localPaths = [
        path.join(process.cwd(), 'private_uploads', 'projects', filename),
        path.join('/tmp/uploads', 'projects', filename),
      ]
      let found = null
      for (const p of localPaths) if (existsSync(p)) { found = p; break }
      if (!found) {
        console.warn(`  [miss] #${row.id} "${row.title}" local file not found for ${img} — cannot upload to blob`)
        failed++
        continue
      }
      console.log(`  [migrate local→blob] #${row.id} "${row.title}" ${img} → ${found}`)
      buffer = await readFile(found)
      originalName = filename
    } else if (img.startsWith('/Project') || img.startsWith('/Project%20') || img.startsWith('/webp/') || img.startsWith('/public/')) {
      let decoded = img
      try { decoded = decodeURIComponent(img) } catch {}
      const relative = decoded.replace(/^\//, '')
      const publicPath = path.join(process.cwd(), 'public', relative)
      console.log(`  [migrate public→${BLOB_TOKEN ? 'blob' : 'local'}] #${row.id} "${row.title}" ${img} → ${publicPath}`)
      if (!existsSync(publicPath)) {
        console.warn(`    ⚠ file not found: ${publicPath}`)
        failed++
        continue
      }
      buffer = await readFile(publicPath)
      originalName = path.basename(publicPath)
    } else if (img.startsWith('http://') || img.startsWith('https://')) {
      console.log(`  [skip] #${row.id} external URL → ${img}`)
      skipped++
      continue
    } else {
      console.warn(`  [skip unknown] #${row.id} ${img}`)
      skipped++
      continue
    }

    try {
      const { publicUrl } = await saveToBlobOrLocal(buffer, originalName)
      await sql`UPDATE projects SET image=${publicUrl}, updated_at=NOW() WHERE id=${row.id}`
      console.log(`    ✓ updated DB #${row.id} → ${publicUrl}`)
      migrated++
      await new Promise(r => setTimeout(r, 50))
    } catch (e) {
      console.error(`    ✗ failed #${row.id}`, e)
      failed++
    }
  }

  console.log(`\nDone. Migrated: ${migrated}, Skipped: ${skipped}, Failed: ${failed}`)
  const after = await sql`SELECT id, title, image FROM projects ORDER BY id`
  console.log('\nAfter:')
  for (const r of after) console.log(`  #${r.id} ${r.title} → ${r.image}`)
  if (!BLOB_TOKEN && migrated > 0) {
    console.log('\n⚠ You migrated to LOCAL filesystem. For Vercel persistence, set BLOB_READ_WRITE_TOKEN in .env.local and re-run, or set it in Vercel dashboard env and redeploy.')
  }
  if (BLOB_TOKEN) {
    console.log('\n✓ All migrated images are now on Vercel Blob (durable). Verify homepage at /api/projects.')
  }
}

migrate().catch(e => { console.error(e); process.exit(1) })

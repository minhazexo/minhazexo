import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminDocuments } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { readStoredFile } from '@/lib/storage'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

/* Public CV download — streams the CV uploaded in the admin panel
   (admin_documents, originalName "Minhaz-CV.pdf") without auth so the
   "Download CV" button works for every visitor.
   Fallbacks keep it working if the stored file was lost (e.g. Vercel
   /tmp is ephemeral) while the DB row still exists. */

const CV_FILENAME = 'Minhaz-CV.pdf'

type DocRow = typeof adminDocuments.$inferSelect

async function findCvDoc(): Promise<DocRow | null> {
  try {
    const docs = await db.select().from(adminDocuments).orderBy(desc(adminDocuments.createdAt)).limit(20)
    if (docs.length === 0) return null
    const byExact = docs.find((d) => d.originalName?.toLowerCase() === 'minhaz-cv.pdf')
    if (byExact) return byExact
    const byName = docs.find((d) => /cv|resume/i.test(d.originalName ?? ''))
    if (byName) return byName
    const byCategory = docs.find((d) => d.category === 'cv' || d.category === 'resume')
    if (byCategory) return byCategory
    const pdf = docs.find((d) => d.mimeType === 'application/pdf')
    if (pdf) return pdf
    return docs[0]
  } catch (e) {
    console.error('Public CV lookup failed', e)
    return null
  }
}

async function tryReadFile(filePath: string): Promise<Buffer | null> {
  try {
    if (!existsSync(filePath)) return null
    const data = await readFile(filePath)
    return data.length > 0 ? data : null
  } catch {
    return null
  }
}

async function loadCvBytes(doc: DocRow | null): Promise<{ bytes: Buffer; source: string } | null> {
  // 1) Exact storage location recorded in the database.
  if (doc) {
    const fromKey = await readStoredFile(doc.storageKey)
    if (fromKey && fromKey.length > 0) return { bytes: fromKey, source: 'database' }
    // 2) Same stored file, relocated (absolute storageKey breaks across
    //    machines — e.g. Windows dev path vs Vercel /tmp).
    const relocated = [
      path.join(process.cwd(), 'private_uploads', 'documents', doc.storedName),
      path.join('/tmp/uploads', 'documents', doc.storedName),
    ]
    for (const candidate of relocated) {
      const data = await tryReadFile(candidate)
      if (data) return { bytes: data, source: 'database-relocated' }
    }
  }
  // 3) Well-known filenames — covers the manually placed copy and deploys
  //    where the ephemeral upload volume was lost.
  const fallbacks = [
    path.join(process.cwd(), 'private_uploads', 'documents', CV_FILENAME),
    path.join(process.cwd(), 'private_uploads', 'documents', '1790373590457-hp310x-Minhaz-CV.pdf'),
    path.join('/tmp/uploads', 'documents', CV_FILENAME),
    path.join(process.cwd(), 'public', 'resume', CV_FILENAME),
  ]
  for (const candidate of fallbacks) {
    const data = await tryReadFile(candidate)
    if (data) return { bytes: data, source: 'fallback' }
  }
  return null
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const doc = await findCvDoc()
  const loaded = await loadCvBytes(doc)

  // Deploy-proof last resort: the copy committed at public/resume/ is
  // served as a static asset by the hosting CDN, so it survives fresh
  // deploys even when the ephemeral upload volume (and the exact file
  // the DB row points to) is gone.
  const staticUrl = new URL('/resume/Minhaz-CV.pdf', request.url)
  if (!loaded) {
    if (searchParams.get('info') === '1') {
      return NextResponse.json({
        fileName: CV_FILENAME,
        originalName: doc?.originalName ?? CV_FILENAME,
        mimeType: 'application/pdf',
        size: null,
        source: 'static',
        staticUrl: staticUrl.pathname,
        updatedAt: doc?.updatedAt ?? doc?.createdAt ?? null,
      })
    }
    return NextResponse.redirect(staticUrl)
  }

  // ?info=1 → lightweight JSON for UI (filename, size, last update).
  if (searchParams.get('info') === '1') {
    return NextResponse.json(
      {
        fileName: CV_FILENAME,
        originalName: doc?.originalName ?? CV_FILENAME,
        mimeType: doc?.mimeType ?? 'application/pdf',
        size: loaded.bytes.length,
        source: loaded.source,
        updatedAt: doc?.updatedAt ?? doc?.createdAt ?? null,
      },
      { headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600' } },
    )
  }

  const inline = searchParams.get('view') === '1' || searchParams.get('download') === '0'
  return new NextResponse(new Uint8Array(loaded.bytes) as unknown as BodyInit, {
    headers: {
      'Content-Type': doc?.mimeType ?? 'application/pdf',
      'Content-Length': String(loaded.bytes.length),
      'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="${CV_FILENAME}"; filename*=UTF-8''${CV_FILENAME}`,
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'X-Content-Source': loaded.source,
    },
  })
}

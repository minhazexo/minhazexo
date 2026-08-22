import { NextRequest, NextResponse } from 'next/server'
import { readStoredFile } from '@/lib/storage'
import path from 'path'

// Public — no auth. Serves project images uploaded via admin.
export const dynamic = 'force-dynamic'

function contentTypeFor(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  if (ext === '.webp') return 'image/webp'
  if (ext === '.avif') return 'image/avif'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.png') return 'image/png'
  if (ext === '.gif') return 'image/gif'
  return 'application/octet-stream'
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const raw = params.filename
  if (!raw || raw.includes('..') || raw.includes('/') || raw.includes('\\')) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
  }
  const filename = path.basename(raw)
  // Resolve via storage helper (handles UPLOAD_ROOT = /tmp on Vercel)
  const { getProjectImagePath } = await import('@/lib/storage')
  const storageKey = getProjectImagePath(filename)
  const data = await readStoredFile(storageKey)
  if (!data) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 })
  }
  const mime = contentTypeFor(filename)
  return new NextResponse(new Uint8Array(data) as unknown as BodyInit, {
    headers: {
      'Content-Type': mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Length': String(data.length),
    },
  })
}

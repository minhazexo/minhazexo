import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminUsers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'
import { validateAvatarFile } from '@/lib/storage'

export async function POST(request: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('avatar') as File | null
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided. Use field name avatar' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const mimeType = file.type || 'application/octet-stream'
    const size = buffer.length

    const validation = validateAvatarFile(mimeType, size)
    if (validation) return NextResponse.json({ error: validation }, { status: 400 })

    // Convert to webp data URL for durable storage (same approach as project images)
    let outBuffer = buffer
    let outMime = 'image/jpeg'
    try {
      const sharp = (await import('sharp')).default
      outBuffer = await sharp(buffer).rotate().resize({ width: 400, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
      outMime = 'image/webp'
    } catch {
      outMime = mimeType
    }
    const base64 = outBuffer.toString('base64')
    const dataUrl = `data:${outMime};base64,${base64}`

    // Store the data URL directly in the DB (survives Vercel's ephemeral /tmp)
    await db.update(adminUsers).set({ avatarUrl: dataUrl, updatedAt: new Date() }).where(eq(adminUsers.id, auth.id))

    // Return a cache-busted api url for displaying avatar
    const avatarApiUrl = `/api/admin/profile/avatar?adminId=${auth.id}&t=${Date.now()}`
    return NextResponse.json({ success: true, avatarUrl: dataUrl, avatarApiUrl })
  } catch (e) {
    console.error('Avatar upload error', e)
    return NextResponse.json({ error: 'Failed to upload avatar' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Serve avatar image - requires auth (private)
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const adminIdParam = searchParams.get('adminId')
    const targetId = adminIdParam ? Number(adminIdParam) : auth.id
    if (targetId !== auth.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, targetId))
    const avatarUrl = (user as any)?.avatarUrl as string | null
    if (!avatarUrl) return NextResponse.json({ error: 'No avatar' }, { status: 404 })

    // New format: data URL stored directly in DB
    if (avatarUrl.startsWith('data:')) {
      // Parse data URL: data:image/webp;base64,XXXXX
      const match = avatarUrl.match(/^data:([^;]+);base64,(.+)$/)
      if (!match) return NextResponse.json({ error: 'Invalid avatar data' }, { status: 500 })
      const mime = match[1]
      const buf = Buffer.from(match[2], 'base64')
      return new NextResponse(new Uint8Array(buf) as unknown as BodyInit, {
        headers: {
          'Content-Type': mime,
          'Cache-Control': 'private, max-age=3600',
          'Content-Length': String(buf.length),
        },
      })
    }

    // Legacy format: filesystem path (fallback for old local avatars)
    const { readStoredFile } = await import('@/lib/storage')
    const data = await readStoredFile(avatarUrl)
    if (!data) return NextResponse.json({ error: 'Avatar file not found' }, { status: 404 })

    let mime = 'image/jpeg'
    if (avatarUrl.endsWith('.png')) mime = 'image/png'
    else if (avatarUrl.endsWith('.webp')) mime = 'image/webp'
    else if (avatarUrl.endsWith('.gif')) mime = 'image/gif'
    else if (avatarUrl.endsWith('.jpg') || avatarUrl.endsWith('.jpeg')) mime = 'image/jpeg'

    return new NextResponse(new Uint8Array(data) as unknown as BodyInit, {
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'private, max-age=3600',
        'Content-Length': String(data.length),
      },
    })
  } catch (e) {
    console.error('Avatar GET error', e)
    return NextResponse.json({ error: 'Failed to retrieve avatar' }, { status: 500 })
  }
}

export async function DELETE() {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, auth.id))
    const key = (user as any)?.avatarUrl as string | null
    if (key) {
      // If it's a legacy filesystem path, try to clean up
      if (!key.startsWith('data:')) {
        try { const { deleteFile } = await import('@/lib/storage'); await deleteFile(key) } catch {}
      }
      await db.update(adminUsers).set({ avatarUrl: null, updatedAt: new Date() }).where(eq(adminUsers.id, auth.id))
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Avatar delete error', e)
    return NextResponse.json({ error: 'Failed to remove avatar' }, { status: 500 })
  }
}

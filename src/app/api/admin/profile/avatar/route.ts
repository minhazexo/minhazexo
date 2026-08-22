import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminUsers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getAuthStrict, getAuth } from '@/lib/auth'
import { saveAvatar, validateAvatarFile, deleteFile } from '@/lib/storage'

export async function POST(request: NextRequest) {
  const auth = await getAuthStrict() || await getAuth()
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

    // fetch current avatar to clean up old
    const [current] = await db.select().from(adminUsers).where(eq(adminUsers.id, auth.id))
    const oldKey = (current as any)?.avatarUrl as string | null

    const { storageKey } = await saveAvatar(buffer, file.name, mimeType)

    // store storageKey as avatarUrl (internal path). Client will fetch via authenticated endpoint
    // For serving, we expose via /api/admin/profile/avatar GET? We store key and also return API URL
    // But keep avatarUrl as storageKey for private retrieval

    await db.update(adminUsers).set({ avatarUrl: storageKey, updatedAt: new Date() }).where(eq(adminUsers.id, auth.id))

    // delete old file if exists and different
    if (oldKey && oldKey !== storageKey) {
      await deleteFile(oldKey)
    }

    // Return a cache-busted api url for displaying avatar
    const avatarApiUrl = `/api/admin/profile/avatar?adminId=${auth.id}&t=${Date.now()}`
    return NextResponse.json({ success: true, avatarUrl: storageKey, avatarApiUrl })
  } catch (e) {
    console.error('Avatar upload error', e)
    return NextResponse.json({ error: 'Failed to upload avatar' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Serve avatar image - requires auth (private)
  const auth = await getAuthStrict() || await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const adminIdParam = searchParams.get('adminId')
    const targetId = adminIdParam ? Number(adminIdParam) : auth.id
    if (targetId !== auth.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, targetId))
    const key = (user as any)?.avatarUrl as string | null
    if (!key) return NextResponse.json({ error: 'No avatar' }, { status: 404 })

    const { readStoredFile } = await import('@/lib/storage')
    const data = await readStoredFile(key)
    if (!data) return NextResponse.json({ error: 'Avatar file not found' }, { status: 404 })

    // infer mime from extension
    let mime = 'image/jpeg'
    if (key.endsWith('.png')) mime = 'image/png'
    else if (key.endsWith('.webp')) mime = 'image/webp'
    else if (key.endsWith('.gif')) mime = 'image/gif'
    else if (key.endsWith('.jpg') || key.endsWith('.jpeg')) mime = 'image/jpeg'

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
  const auth = await getAuthStrict() || await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, auth.id))
    const key = (user as any)?.avatarUrl as string | null
    if (key) {
      await deleteFile(key)
      await db.update(adminUsers).set({ avatarUrl: null, updatedAt: new Date() }).where(eq(adminUsers.id, auth.id))
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Avatar delete error', e)
    return NextResponse.json({ error: 'Failed to remove avatar' }, { status: 500 })
  }
}

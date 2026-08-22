import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminUsers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'

function sanitizeUser(u: any) {
  if (!u) return null
  const { passwordHash, ...safe } = u
  return safe
}

export async function GET() {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, auth.id))
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  return NextResponse.json(sanitizeUser(user))
}

export async function PUT(request: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { displayName, email, bio, phone, location, title, username } = body

    // Validation
    if (email !== undefined) {
      const emailTrim = String(email).trim()
      if (emailTrim && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
      }
      if (emailTrim.length > 255) return NextResponse.json({ error: 'Email too long' }, { status: 400 })
    }
    if (displayName !== undefined && String(displayName).length > 150) {
      return NextResponse.json({ error: 'Display name too long (max 150)' }, { status: 400 })
    }
    if (bio !== undefined && String(bio).length > 5000) {
      return NextResponse.json({ error: 'Bio too long (max 5000)' }, { status: 400 })
    }
    if (phone !== undefined && String(phone).length > 50) {
      return NextResponse.json({ error: 'Phone too long' }, { status: 400 })
    }
    if (location !== undefined && String(location).length > 255) {
      return NextResponse.json({ error: 'Location too long' }, { status: 400 })
    }
    if (title !== undefined && String(title).length > 255) {
      return NextResponse.json({ error: 'Title too long' }, { status: 400 })
    }
    if (username !== undefined) {
      const u = String(username).trim()
      if (!u || u.length < 3) return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 })
      if (u.length > 100) return NextResponse.json({ error: 'Username too long' }, { status: 400 })
      if (!/^[a-zA-Z0-9._-]+$/.test(u)) return NextResponse.json({ error: 'Username may only contain letters, numbers, dot, underscore, hyphen' }, { status: 400 })
    }

    const updates: Record<string, any> = {}
    if (displayName !== undefined) updates.displayName = String(displayName).trim() || null
    if (email !== undefined) updates.email = String(email).trim()
    if (bio !== undefined) updates.bio = String(bio).trim() || null
    if (phone !== undefined) updates.phone = String(phone).trim() || null
    if (location !== undefined) updates.location = String(location).trim() || null
    if (title !== undefined) updates.title = String(title).trim() || null
    if (username !== undefined) updates.username = String(username).trim()

    // email uniqueness: if trying to set email that exists for other user
    if (updates.email) {
      const [existing] = await db.select().from(adminUsers).where(eq(adminUsers.email, updates.email))
      if (existing && existing.id !== auth.id) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
      }
    }
    if (updates.username) {
      const [existing] = await db.select().from(adminUsers).where(eq(adminUsers.username, updates.username))
      if (existing && existing.id !== auth.id) {
        return NextResponse.json({ error: 'Username already in use' }, { status: 409 })
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    updates.updatedAt = new Date()

    const [updated] = await db.update(adminUsers).set(updates).where(eq(adminUsers.id, auth.id)).returning()
    return NextResponse.json(sanitizeUser(updated))
  } catch (e: any) {
    console.error('Profile update error', e)
    // handle unique constraint
    if (String(e.message).includes('duplicate') || String(e.code) === '23505') {
      return NextResponse.json({ error: 'Username or email already in use' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

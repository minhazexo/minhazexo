import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { adminUsers } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { getAuth, createToken, setAuthCookie } from '@/lib/auth'

function validatePasswordStrength(pw: string): string | null {
  if (pw.length < 8) return 'Password must be at least 8 characters'
  if (pw.length > 128) return 'Password too long (max 128)'
  if (!/[A-Z]/.test(pw)) return 'Password must contain at least one uppercase letter'
  if (!/[a-z]/.test(pw)) return 'Password must contain at least one lowercase letter'
  if (!/[0-9]/.test(pw)) return 'Password must contain at least one number'
  // optional special char requirement relaxed
  return null
}

export async function POST(request: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { currentPassword, newPassword, confirmPassword } = body

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: 'All password fields are required' }, { status: 400 })
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New password and confirmation do not match' }, { status: 400 })
    }
    if (currentPassword === newPassword) {
      return NextResponse.json({ error: 'New password must be different from current password' }, { status: 400 })
    }

    const strengthError = validatePasswordStrength(newPassword)
    if (strengthError) return NextResponse.json({ error: strengthError }, { status: 400 })

    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, auth.id))
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })

    const newHash = await bcrypt.hash(newPassword, 12)
    const currentVersion = (user as any).tokenVersion ?? 0
    const nextVersion = currentVersion + 1

    await db.update(adminUsers)
      .set({ passwordHash: newHash, tokenVersion: nextVersion, updatedAt: new Date() })
      .where(eq(adminUsers.id, auth.id))

    // Issue new token with incremented version, thereby invalidating all other sessions/tokens
    const newToken = await createToken({ id: user.id, username: user.username, tokenVersion: nextVersion })
    await setAuthCookie(newToken)

    return NextResponse.json({ success: true, message: 'Password changed successfully' })
  } catch (e) {
    console.error('Change password error', e)
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
  }
}

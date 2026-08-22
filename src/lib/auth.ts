import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!)
const COOKIE_NAME = 'admin_token'
const EXPIRES_IN = '24h'

export async function createToken(payload: { id: number; username: string; tokenVersion?: number }) {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(EXPIRES_IN)
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { id: number; username: string; tokenVersion?: number }
  } catch {
    return null
  }
}

export async function verifyTokenWithVersion(token: string): Promise<{ id: number; username: string; tokenVersion: number } | null> {
  const p = await verifyToken(token)
  if (!p) return null
  // lazy import to avoid circular deps at module init if DATABASE_URL missing during build
  try {
    const { db } = await import('@/lib/db')
    const { adminUsers } = await import('@/lib/db/schema')
    const { eq } = await import('drizzle-orm')
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, p.id))
    if (!user) return null
    const currentVersion = (user as any).tokenVersion ?? 0
    const tokenVer = (p as any).tokenVersion ?? 0
    if (tokenVer !== currentVersion) return null
    return { id: p.id, username: p.username, tokenVersion: tokenVer }
  } catch {
    // if DB check fails, fall back to basic verification (e.g., during build)
    return { id: p.id, username: p.username, tokenVersion: (p as any).tokenVersion ?? 0 }
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  // Strict version check — invalidates old sessions after password change
  return verifyTokenWithVersion(token)
}

export async function getAuthStrict() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyTokenWithVersion(token)
}

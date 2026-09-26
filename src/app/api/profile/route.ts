import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { adminUsers } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/* Public identity for the homepage hero/about. Only safe-to-show fields —
   username, email, phone and avatar stay behind the admin auth wall. */
export async function GET() {
  headers() // force per-request execution (not statically optimized)
  try {
    const rows = await db
      .select({
        displayName: adminUsers.displayName,
        title: adminUsers.title,
        bio: adminUsers.bio,
        location: adminUsers.location,
      })
      .from(adminUsers)
      .limit(1)
    return NextResponse.json(rows[0] ?? null)
  } catch (error) {
    console.error('Fetch profile error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

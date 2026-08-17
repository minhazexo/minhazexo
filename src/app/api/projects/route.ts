import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

// Never cache this route: admin visibility toggles must appear instantly.
// Reading `headers()` opts the handler into dynamic rendering, and
// revalidate = 0 disables the Full Route Cache as a belt-and-suspenders.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  headers() // force per-request execution (not statically optimized)
  try {
    // Only publicly expose projects the admin has marked as visible
    const all = await db.select().from(projects).where(eq(projects.isVisible, true)).orderBy(desc(projects.createdAt))
    return NextResponse.json(all)
  } catch (error) {
    console.error('Fetch projects error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

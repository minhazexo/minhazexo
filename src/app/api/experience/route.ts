import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { experience } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const all = await db.select().from(experience).orderBy(desc(experience.sortOrder))
    return NextResponse.json(all)
  } catch (error) {
    console.error('Fetch experience error:', error)
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 })
  }
}

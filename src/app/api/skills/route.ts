import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { skills } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  headers() // force per-request execution (not statically optimized)
  try {
    const all = await db.select().from(skills).orderBy(desc(skills.level))
    return NextResponse.json(all)
  } catch (error) {
    console.error('Fetch skills error:', error)
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
  }
}

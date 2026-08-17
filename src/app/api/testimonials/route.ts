import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  headers() // force per-request execution (not statically optimized)
  try {
    const all = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt))
    return NextResponse.json(all)
  } catch (error) {
    console.error('Fetch testimonials error:', error)
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

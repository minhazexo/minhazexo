import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { experience } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'

export async function GET() {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const all = await db.select().from(experience).orderBy(desc(experience.sortOrder))
  return NextResponse.json(all)
}

export async function POST(request: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const [entry] = await db.insert(experience).values({
      role: body.role,
      company: body.company,
      period: body.period,
      description: body.description,
      highlights: Array.isArray(body.highlights) ? body.highlights : [],
      tech: Array.isArray(body.tech) ? body.tech : [],
      color: body.color || '#00E5FF',
      sortOrder: body.sortOrder ?? 0,
    }).returning()

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Create experience error:', error)
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    if (!body.id) return NextResponse.json({ error: 'Experience ID required' }, { status: 400 })

    const [entry] = await db.update(experience)
      .set({
        role: body.role,
        company: body.company,
        period: body.period,
        description: body.description,
        highlights: Array.isArray(body.highlights) ? body.highlights : body.highlights,
        tech: Array.isArray(body.tech) ? body.tech : body.tech,
        color: body.color,
        sortOrder: body.sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(experience.id, body.id))
      .returning()

    if (!entry) return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    return NextResponse.json(entry)
  } catch (error) {
    console.error('Update experience error:', error)
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'Experience ID required' }, { status: 400 })

    await db.delete(experience).where(eq(experience.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete experience error:', error)
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 })
  }
}

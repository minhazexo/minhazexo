import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { skills } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'

export async function GET() {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const all = await db.select().from(skills).orderBy(desc(skills.level))
  return NextResponse.json(all)
}

export async function POST(request: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const [skill] = await db.insert(skills).values({
      name: body.name,
      category: body.category,
      level: body.level ?? 0,
      color: body.color || null,
    }).returning()

    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    console.error('Create skill error:', error)
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    if (!body.id) return NextResponse.json({ error: 'Skill ID required' }, { status: 400 })

    const [skill] = await db.update(skills)
      .set({ name: body.name, category: body.category, level: body.level, color: body.color, updatedAt: new Date() })
      .where(eq(skills.id, body.id))
      .returning()

    if (!skill) return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    return NextResponse.json(skill)
  } catch (error) {
    console.error('Update skill error:', error)
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'Skill ID required' }, { status: 400 })

    await db.delete(skills).where(eq(skills.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete skill error:', error)
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 })
  }
}

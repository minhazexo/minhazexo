import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'

export async function GET() {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const all = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt))
  return NextResponse.json(all)
}

export async function POST(request: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const [entry] = await db.insert(testimonials).values({
      name: body.name,
      role: body.role,
      company: body.company,
      avatar: body.avatar || '/webp/profile.webp',
      content: body.content,
      rating: body.rating ?? 5,
      color: body.color || '#00E5FF',
    }).returning()

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Create testimonial error:', error)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    if (!body.id) return NextResponse.json({ error: 'Testimonial ID required' }, { status: 400 })

    const [entry] = await db.update(testimonials)
      .set({
        name: body.name,
        role: body.role,
        company: body.company,
        avatar: body.avatar,
        content: body.content,
        rating: body.rating,
        color: body.color,
        updatedAt: new Date(),
      })
      .where(eq(testimonials.id, body.id))
      .returning()

    if (!entry) return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
    return NextResponse.json(entry)
  } catch (error) {
    console.error('Update testimonial error:', error)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'Testimonial ID required' }, { status: 400 })

    await db.delete(testimonials).where(eq(testimonials.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete testimonial error:', error)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}

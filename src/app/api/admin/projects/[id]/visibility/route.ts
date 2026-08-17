import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = Number(params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 })
    }

    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    if (typeof body.is_visible !== 'boolean') {
      return NextResponse.json({ error: 'is_visible must be a boolean' }, { status: 400 })
    }

    const [project] = await db.update(projects)
      .set({ isVisible: body.is_visible, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning()

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    return NextResponse.json(project)
  } catch (error) {
    console.error('Update project visibility error:', error)
    return NextResponse.json({ error: 'Failed to update project visibility' }, { status: 500 })
  }
}

// Only PATCH is supported on this route
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

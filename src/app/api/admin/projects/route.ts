import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'
import { saveProjectImage, validateProjectFile, isStoredProjectImageUrl, isDataUrl, storedNameFromProjectUrl, deleteFile, getProjectImagePath } from '@/lib/storage'

export async function GET() {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const all = await db.select().from(projects).orderBy(desc(projects.createdAt))
  return NextResponse.json(all)
}

async function parseBody(request: NextRequest): Promise<{ fields: Record<string, any>; imageFile: { buffer: Buffer; name: string; type: string } | null }> {
  const ct = request.headers.get('content-type') || ''
  if (ct.includes('multipart/form-data')) {
    const formData = await request.formData()
    const fields: Record<string, any> = {}
    // Collect text fields; support JSON-encoded arrays for tech
    const entries = Array.from(formData.entries()) as [string, FormDataEntryValue][]
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i]
      if (key === 'imageFile' || key === 'image') continue
      if (typeof value === 'string') {
        if (key === 'tech') {
          // Allow comma-separated or JSON array
          const trimmed = value.trim()
          if (trimmed.startsWith('[')) {
            try { fields[key] = JSON.parse(trimmed); continue } catch {}
          }
          fields[key] = trimmed ? trimmed.split(',').map((s) => s.trim()).filter(Boolean) : []
        } else fields[key] = value
      }
    }
    // Also handle tech as multiple entries if appended separately
    const file = formData.get('imageFile') as File | null
    let imageFile: { buffer: Buffer; name: string; type: string } | null = null
    if (file && typeof file !== 'string' && file.size > 0) {
      const buf = Buffer.from(await file.arrayBuffer())
      imageFile = { buffer: buf, name: file.name, type: file.type }
    }
    // id for PUT comes via field
    const idRaw = formData.get('id') as string | null
    if (idRaw) fields.id = Number(idRaw)
    return { fields, imageFile }
  } else {
    const body = await request.json().catch(() => ({}))
    const { imageFile, ...fields } = body
    return { fields, imageFile: null }
  }
}

export async function POST(request: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { fields, imageFile } = await parseBody(request)
    const { title, description, tech, category, github, demo } = fields
    let image: string | undefined = fields.image

    // If a file was uploaded, save it and override image URL (best path)
    if (imageFile) {
      const v = validateProjectFile(imageFile.type, imageFile.buffer.length)
      if (v) return NextResponse.json({ error: v }, { status: 400 })
      const { publicUrl } = await saveProjectImage(imageFile.buffer, imageFile.name)
      image = publicUrl
    }

    if (!title || !description || !image || !tech || !category) {
      return NextResponse.json({ error: 'Missing required fields (title, description, image, tech, category)' }, { status: 400 })
    }

    const [project] = await db.insert(projects).values({
      title, description, image,
      tech: Array.isArray(tech) ? tech : [tech],
      category, github: github || '#', demo: demo || '#',
    }).returning()

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { fields, imageFile } = await parseBody(request)
    const { id, ...data } = fields

    if (!id) return NextResponse.json({ error: 'Project ID required' }, { status: 400 })

    // If a new image file is provided, save it and set data.image
    if (imageFile) {
      const v = validateProjectFile(imageFile.type, imageFile.buffer.length)
      if (v) return NextResponse.json({ error: v }, { status: 400 })
      // Fetch old image to clean up later if it's a stored one
      const [existing] = await db.select().from(projects).where(eq(projects.id, Number(id)))
      const oldUrl = existing?.image as string | undefined
      const { publicUrl } = await saveProjectImage(imageFile.buffer, imageFile.name)
      data.image = publicUrl
      // Clean up old local file only (data URLs and blob URLs are DB-stored, no file)
      if (oldUrl && oldUrl.startsWith('/api/projects/images/')) {
        const oldName = storedNameFromProjectUrl(oldUrl)
        if (oldName && !isDataUrl(oldUrl)) await deleteFile(getProjectImagePath(oldName))
      }
    }

    // Whitelist updatable fields — never let the client overwrite
    // createdAt/updatedAt (their ISO strings break drizzle's timestamp columns).
    const allowed = ['title', 'description', 'image', 'tech', 'category', 'github', 'demo', 'isVisible']
    const clean: Record<string, unknown> = {}
    for (const key of allowed) {
      if (data[key] !== undefined) clean[key] = data[key]
    }

    // If data.image is being changed to a different stored URL without file upload (e.g., external URL),
    // and old was stored, we intentionally keep old file (not deleting) to avoid accidental loss.
    // Deletion only happens on explicit file replacement above.

    const [project] = await db.update(projects)
      .set({ ...clean, updatedAt: new Date() })
      .where(eq(projects.id, Number(id)))
      .returning()

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    return NextResponse.json(project)
  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'Project ID required' }, { status: 400 })

    const [existing] = await db.select().from(projects).where(eq(projects.id, Number(id)))
    await db.delete(projects).where(eq(projects.id, Number(id)))
    // Best-effort delete old local file (data URLs need no file cleanup)
    if (existing?.image && existing.image.startsWith('/api/projects/images/')) {
      const name = storedNameFromProjectUrl(existing.image)
      if (name) await deleteFile(getProjectImagePath(name))
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}

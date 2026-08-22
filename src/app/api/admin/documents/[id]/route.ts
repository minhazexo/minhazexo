import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminDocuments } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'
import { readStoredFile, deleteFile } from '@/lib/storage'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = Number(params.id)
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const [doc] = await db.select().from(adminDocuments).where(and(eq(adminDocuments.id, id), eq(adminDocuments.adminId, auth.id)))
  if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 })

  const { searchParams } = new URL(request.url)
  const download = searchParams.get('download') // if ?download=1 then stream file else return metadata

  if (download !== '1' && download !== 'true') {
    // return metadata
    return NextResponse.json({
      id: doc.id,
      originalName: doc.originalName,
      storedName: doc.storedName,
      mimeType: doc.mimeType,
      size: doc.size,
      category: doc.category,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })
  }

  // stream file
  const data = await readStoredFile(doc.storageKey)
  if (!data) return NextResponse.json({ error: 'File not found on storage' }, { status: 404 })

  return new NextResponse(new Uint8Array(data) as unknown as BodyInit, {
    headers: {
      'Content-Type': doc.mimeType,
      'Content-Length': String(data.length),
      'Content-Disposition': `attachment; filename="${encodeURIComponent(doc.originalName)}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = Number(params.id)
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const [doc] = await db.select().from(adminDocuments).where(and(eq(adminDocuments.id, id), eq(adminDocuments.adminId, auth.id)))
  if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 })

  await db.delete(adminDocuments).where(and(eq(adminDocuments.id, id), eq(adminDocuments.adminId, auth.id)))
  await deleteFile(doc.storageKey)
  return NextResponse.json({ success: true })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = Number(params.id)
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  try {
    const body = await request.json()
    const { category, description } = body
    const updates: Record<string, any> = {}
    if (category !== undefined) {
      const c = String(category).toLowerCase().trim().slice(0, 50)
      const allowed = ['cv', 'certificate', 'document', 'other', 'resume']
      updates.category = allowed.includes(c) ? c : 'document'
    }
    if (description !== undefined) {
      updates.description = String(description).trim().slice(0, 2000) || null
    }
    if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    updates.updatedAt = new Date()

    const [updated] = await db.update(adminDocuments).set(updates).where(and(eq(adminDocuments.id, id), eq(adminDocuments.adminId, auth.id))).returning()
    if (!updated) return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    return NextResponse.json({
      id: updated.id,
      originalName: updated.originalName,
      category: updated.category,
      description: updated.description,
      updatedAt: updated.updatedAt,
    })
  } catch (e) {
    console.error('Document patch error', e)
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminDocuments } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getAuthStrict, getAuth } from '@/lib/auth'
import { saveDocument, validateDocumentFile } from '@/lib/storage'

export async function GET(request: NextRequest) {
  const auth = await getAuthStrict() || await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  let docs
  if (category && category !== 'all') {
    docs = await db.select().from(adminDocuments)
      .where(eq(adminDocuments.category, category))
      .orderBy(desc(adminDocuments.createdAt))
    // filter by adminId as well
    docs = docs.filter(d => d.adminId === auth.id)
  } else {
    const all = await db.select().from(adminDocuments)
      .where(eq(adminDocuments.adminId, auth.id))
      .orderBy(desc(adminDocuments.createdAt))
    docs = all
  }

  // Don't expose storageKey directly as path; but we need it for download via id
  const sanitized = docs.map(d => ({
    id: d.id,
    originalName: d.originalName,
    storedName: d.storedName,
    mimeType: d.mimeType,
    size: d.size,
    category: d.category,
    description: d.description,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  }))
  return NextResponse.json(sanitized)
}

export async function POST(request: NextRequest) {
  const auth = await getAuthStrict() || await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided. Use field name file' }, { status: 400 })
    }

    const categoryRaw = formData.get('category') as string | null
    const descriptionRaw = formData.get('description') as string | null
    const category = (categoryRaw || 'document').toLowerCase().trim().slice(0, 50)
    const allowedCats = ['cv', 'certificate', 'document', 'other', 'resume']
    const finalCategory = allowedCats.includes(category) ? category : 'document'
    const description = descriptionRaw ? String(descriptionRaw).trim().slice(0, 2000) : null

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const mimeType = file.type || 'application/octet-stream'
    const size = buffer.length

    const validation = validateDocumentFile(mimeType, size)
    if (validation) return NextResponse.json({ error: validation }, { status: 400 })

    if (size === 0) return NextResponse.json({ error: 'Empty file' }, { status: 400 })

    const originalName = file.name || 'unnamed'

    const { storedName, storageKey } = await saveDocument(buffer, originalName)

    const [doc] = await db.insert(adminDocuments).values({
      adminId: auth.id,
      originalName: originalName.slice(0, 255),
      storedName,
      mimeType: mimeType.slice(0, 100),
      size,
      category: finalCategory,
      description,
      storageKey,
    }).returning()

    return NextResponse.json({
      id: doc.id,
      originalName: doc.originalName,
      storedName: doc.storedName,
      mimeType: doc.mimeType,
      size: doc.size,
      category: doc.category,
      description: doc.description,
      createdAt: doc.createdAt,
    }, { status: 201 })
  } catch (e) {
    console.error('Document upload error', e)
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 })
  }
}

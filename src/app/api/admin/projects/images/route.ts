import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@/lib/auth'
import { saveProjectImage, validateProjectFile } from '@/lib/storage'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const auth = await getAuth()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('image') as File | null
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No image file provided. Use field name image' }, { status: 400 })
    }

    const mimeType = file.type || 'application/octet-stream'
    const buffer = Buffer.from(await file.arrayBuffer())
    const validation = validateProjectFile(mimeType, buffer.length)
    if (validation) return NextResponse.json({ error: validation }, { status: 400 })
    if (buffer.length === 0) return NextResponse.json({ error: 'Empty file' }, { status: 400 })

    const { publicUrl, storedName } = await saveProjectImage(buffer, file.name || 'upload')

    return NextResponse.json({ url: publicUrl, storedName, size: buffer.length, mimeType }, { status: 201 })
  } catch (e) {
    console.error('Project image upload error', e)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}

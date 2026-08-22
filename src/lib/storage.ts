import { mkdir, writeFile, unlink, readFile, stat } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const UPLOAD_ROOT = process.env.VERCEL ? '/tmp/uploads' : path.join(process.cwd(), 'private_uploads')
const AVATAR_DIR = path.join(UPLOAD_ROOT, 'avatars')
const DOCUMENT_DIR = path.join(UPLOAD_ROOT, 'documents')
const PROJECT_DIR = path.join(UPLOAD_ROOT, 'projects')

export const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/zip',
  'application/x-zip-compressed',
]
export const MAX_AVATAR_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_PROJECT_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_PROJECT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']

async function ensureDir(dir: string) {
  if (!existsSync(dir)) await mkdir(dir, { recursive: true })
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200)
}

// Avatars & documents still use filesystem (private, small, not critical for homepage)
// Project images are now stored durably in Neon as data URLs — no filesystem, no Vercel Blob needed
export async function saveAvatar(buffer: Buffer, originalName: string, mimeType: string): Promise<{ storedName: string; storageKey: string }> {
  await ensureDir(AVATAR_DIR)
  const ext = path.extname(originalName) || mimeExtension(mimeType) || '.bin'
  const storedName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
  const fullPath = path.join(AVATAR_DIR, storedName)
  await writeFile(fullPath, buffer)
  return { storedName, storageKey: fullPath }
}

export async function saveDocument(buffer: Buffer, originalName: string): Promise<{ storedName: string; storageKey: string }> {
  await ensureDir(DOCUMENT_DIR)
  const ext = path.extname(originalName) || '.bin'
  const base = sanitizeFilename(path.basename(originalName, ext))
  const storedName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}${ext}`
  const fullPath = path.join(DOCUMENT_DIR, storedName)
  await writeFile(fullPath, buffer)
  return { storedName, storageKey: fullPath }
}

export async function saveProjectImage(buffer: Buffer, originalName: string): Promise<{ storedName: string; storageKey: string; publicUrl: string }> {
  // Durable Neon storage: optimize to webp and return data URL
  // This URL lives entirely in DB (projects.image TEXT), survives any Vercel deploy, zero external service
  let outBuffer = buffer
  try {
    const sharp = (await import('sharp')).default
    outBuffer = await sharp(buffer).rotate().resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 82, effort: 4 }).toBuffer()
  } catch {
    outBuffer = buffer
  }
  const base64 = outBuffer.toString('base64')
  const publicUrl = `data:image/webp;base64,${base64}`
  // For local dev convenience, also write a cached file (not used in prod)
  try {
    await ensureDir(PROJECT_DIR)
    const base = sanitizeFilename(path.basename(originalName, path.extname(originalName)) || 'project')
    const storedName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}.webp`
    const fullPath = path.join(PROJECT_DIR, storedName)
    await writeFile(fullPath, outBuffer)
    return { storedName, storageKey: fullPath, publicUrl }
  } catch {
    return { storedName: 'neon-data-url', storageKey: 'neon', publicUrl }
  }
}

export function getProjectImagePath(storedName: string): string {
  return path.join(PROJECT_DIR, path.basename(storedName))
}

export async function deleteFile(storageKey: string): Promise<void> {
  try {
    if (existsSync(storageKey)) await unlink(storageKey)
  } catch {}
}

export async function readStoredFile(storageKey: string): Promise<Buffer | null> {
  try {
    if (!existsSync(storageKey)) return null
    return await readFile(storageKey)
  } catch {
    return null
  }
}

export async function fileExists(storageKey: string): Promise<boolean> {
  try {
    await stat(storageKey)
    return true
  } catch {
    return false
  }
}

function mimeExtension(mime: string): string | null {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
  }
  return map[mime] || null
}

export function validateAvatarFile(mimeType: string, size: number): string | null {
  if (!ALLOWED_AVATAR_TYPES.includes(mimeType)) return `Avatar type not allowed. Allowed: ${ALLOWED_AVATAR_TYPES.join(', ')}`
  if (size > MAX_AVATAR_SIZE) return `Avatar too large. Max ${MAX_AVATAR_SIZE / 1024 / 1024}MB`
  return null
}

export function validateDocumentFile(mimeType: string, size: number): string | null {
  if (size > MAX_DOCUMENT_SIZE) return `File too large. Max ${MAX_DOCUMENT_SIZE / 1024 / 1024}MB`
  return null
}

export function validateProjectFile(mimeType: string, size: number): string | null {
  if (size > MAX_PROJECT_SIZE) return `Image too large. Max ${MAX_PROJECT_SIZE / 1024 / 1024}MB`
  if (mimeType && !ALLOWED_PROJECT_TYPES.includes(mimeType)) return `Image type not allowed. Allowed: ${ALLOWED_PROJECT_TYPES.join(', ')}`
  return null
}

export function isStoredProjectImageUrl(url: string | null | undefined): boolean {
  if (!url) return false
  return url.startsWith('/api/projects/images/') || url.startsWith('data:image/')
}

export function isBlobUrl(url: string): boolean {
  return url.startsWith('https://') && url.includes('blob.vercel-storage.com')
}

export function isDataUrl(url: string | null | undefined): boolean {
  return !!url && url.startsWith('data:image/')
}

export function storedNameFromProjectUrl(url: string): string | null {
  if (!url) return null
  if (url.startsWith('data:image/')) return null
  try {
    const u = new URL(url, 'http://localhost')
    return path.basename(u.pathname)
  } catch {
    return path.basename(url)
  }
}

export function getAvatarPublicPath(storageKey: string): string {
  return storageKey
}

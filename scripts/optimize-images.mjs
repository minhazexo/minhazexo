/**
 * Image Optimization Script
 * Converts all JPG/PNG images in public/ to WebP format.
 * Run: node scripts/optimize-images.mjs
 */

import sharp from 'sharp'
import { readdirSync, mkdirSync, existsSync } from 'fs'
import { stat } from 'fs/promises'
import { join, extname, parse } from 'path'

const publicDir = 'public'
const outDir = join(publicDir, 'webp')

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true })
  console.log(`Created directory: ${outDir}`)
}

const files = readdirSync(publicDir).filter((f) =>
  /\.(png|jpg|jpeg)$/i.test(f)
)

if (files.length === 0) {
  console.log('No JPG or PNG files found in public/')
  process.exit(0)
}

let successCount = 0
let errorCount = 0

for (const file of files) {
  const input = join(publicDir, file)
  const output = join(outDir, `${parse(file).name}.webp`)

  try {
    await sharp(input).webp({ quality: 80, effort: 6 }).toFile(output)
    const originalSize = existsSync(input) ? `${(await stat(input)).size / 1024}`.slice(0, 5) : '?'
    const newSize = `${(await stat(output)).size / 1024}`.slice(0, 5)
    console.log(`✓ ${file} (${originalSize}KB) → webp/${parse(file).name}.webp (${newSize}KB)`)
    successCount++
  } catch (err) {
    console.error(`✗ Failed to convert ${file}:`, err)
    errorCount++
  }
}

console.log(`\nDone: ${successCount} converted, ${errorCount} failed`)

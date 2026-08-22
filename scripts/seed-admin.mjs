import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { sql } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { readFileSync, existsSync } from 'fs'

// Load .env.local manually
const envPath = new URL('../.env.local', import.meta.url)
const envContent = existsSync(envPath) ? readFileSync(envPath, 'utf-8') : ''
const envVars = Object.fromEntries(
  envContent.split('\n').filter(l => l.includes('=')).map(l => {
    const [k, ...v] = l.split('=')
    return [k.trim(), v.join('=').trim()]
  })
)

const DATABASE_URL = envVars.DATABASE_URL || process.env.DATABASE_URL
if (!DATABASE_URL) { console.error('DATABASE_URL not found'); process.exit(1) }

const sqlClient = neon(DATABASE_URL)
const db = drizzle(sqlClient)

async function seed() {
  console.log('Creating tables...')

  // Create admin_users table
  await sqlClient`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `
  // Ensure profile columns exist (idempotent for existing DBs)
  await sqlClient`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS display_name VARCHAR(150)`
  await sqlClient`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500)`
  await sqlClient`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS bio TEXT`
  await sqlClient`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS phone VARCHAR(50)`
  await sqlClient`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS location VARCHAR(255)`
  await sqlClient`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS title VARCHAR(255)`
  await sqlClient`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0`

  // Create projects table
  await sqlClient`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      image VARCHAR(500) NOT NULL,
      tech TEXT[] NOT NULL,
      category VARCHAR(100) NOT NULL,
      github VARCHAR(500) NOT NULL DEFAULT '#',
      demo VARCHAR(500) NOT NULL DEFAULT '#',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sqlClient`
    CREATE TABLE IF NOT EXISTS skills (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      category VARCHAR(100) NOT NULL,
      level INTEGER NOT NULL DEFAULT 0,
      color VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sqlClient`
    CREATE TABLE IF NOT EXISTS experience (
      id SERIAL PRIMARY KEY,
      role VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      period VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      highlights TEXT[] NOT NULL DEFAULT '{}',
      tech TEXT[] NOT NULL DEFAULT '{}',
      color VARCHAR(50) NOT NULL DEFAULT '#00E5FF',
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sqlClient`
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      avatar VARCHAR(500) NOT NULL DEFAULT '/webp/profile.webp',
      content TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      color VARCHAR(50) NOT NULL DEFAULT '#00E5FF',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sqlClient`
    CREATE TABLE IF NOT EXISTS admin_documents (
      id SERIAL PRIMARY KEY,
      admin_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      original_name VARCHAR(255) NOT NULL,
      stored_name VARCHAR(255) NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      size INTEGER NOT NULL,
      category VARCHAR(50) NOT NULL DEFAULT 'document',
      description TEXT,
      storage_key VARCHAR(500) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `
  await sqlClient`CREATE INDEX IF NOT EXISTS idx_admin_documents_admin_id ON admin_documents(admin_id)`

  console.log('Tables created successfully!')

  // Check if admin user exists
  const [existing] = await sqlClient`SELECT id FROM admin_users WHERE username = 'admin'`
  if (existing) {
    console.log('Admin user already exists. Skipping seed.')
    process.exit(0)
  }

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 12)
  await sqlClient`
    INSERT INTO admin_users (username, email, password_hash)
    VALUES ('admin', 'mehrabhossain7102@gmail.com', ${passwordHash})
  `

  console.log('Admin user created!')
  console.log('Username: admin')
  console.log('Password: admin123')
  console.log('⚠ IMPORTANT: Change the password after first login!')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})

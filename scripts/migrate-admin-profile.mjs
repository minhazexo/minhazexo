import { neon } from '@neondatabase/serverless'
import { readFileSync, existsSync } from 'fs'

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

const sql = neon(DATABASE_URL)

async function migrate() {
  console.log('Migrating admin_users - adding profile columns...')
  await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS display_name VARCHAR(150)`
  await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500)`
  await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS bio TEXT`
  await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS phone VARCHAR(50)`
  await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS location VARCHAR(255)`
  await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS title VARCHAR(255)`
  await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0`
  console.log('admin_users migrated.')

  console.log('Creating admin_documents table...')
  await sql`
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
  await sql`CREATE INDEX IF NOT EXISTS idx_admin_documents_admin_id ON admin_documents(admin_id)`
  console.log('admin_documents ready.')

  // Verify
  const cols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name='admin_users' ORDER BY ordinal_position`
  console.log('admin_users columns:', cols.map(c=>c.column_name).join(', '))
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name='admin_documents'`
  console.log('admin_documents exists:', tables.length>0)

  console.log('Migration completed successfully.')
}

migrate().catch(e=>{ console.error(e); process.exit(1) })

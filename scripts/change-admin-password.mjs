import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'
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

const newPassword = process.argv[2] || 'portfolio123'
const sqlClient = neon(DATABASE_URL)

async function changePassword() {
  const [user] = await sqlClient`SELECT id, token_version FROM admin_users WHERE username = 'admin'`
  if (!user) { console.error('Admin user not found'); process.exit(1) }

  const passwordHash = await bcrypt.hash(newPassword, 12)
  const nextVersion = (user.token_version ?? 0) + 1

  await sqlClient`UPDATE admin_users SET password_hash = ${passwordHash}, token_version = ${nextVersion}, updated_at = NOW() WHERE username = 'admin'`

  console.log('✅ Admin password updated successfully!')
  console.log('⚠ IMPORTANT: You will need to log in again. All other sessions have been invalidated.')
}

changePassword().catch(err => { console.error('Failed:', err); process.exit(1) })

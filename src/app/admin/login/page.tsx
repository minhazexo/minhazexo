'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }
      router.push('/admin')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05070A', padding: 16 }}>
      <style>{`@media (max-width: 480px) { .admin-login-form { padding: 24px !important; } }`}</style>
      <form onSubmit={handleSubmit} className="admin-login-form" style={{
        width: '100%', maxWidth: 400, padding: 40,
        borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(12,16,23,0.95)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Admin Login</h1>
          <p style={{ fontSize: 14, color: '#6b7280' }}>Sign in to manage your portfolio</p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,75,75,0.1)', border: '1px solid rgba(255,75,75,0.2)', color: '#FF4B4B', fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 6, letterSpacing: '0.05em' }}>USERNAME</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%', height: 44, padding: '0 14px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
              color: '#fff', fontSize: 14, outline: 'none',
            }}
            required
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 6, letterSpacing: '0.05em' }}>PASSWORD</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%', height: 44, padding: '0 14px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
              color: '#fff', fontSize: 14, outline: 'none',
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', height: 48, borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

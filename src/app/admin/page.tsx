'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type Tab = 'projects' | 'skills' | 'experience' | 'testimonials'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('projects')
  const [data, setData] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetch('/api/admin/me')
      .then((res) => { if (!res.ok) { router.push('/admin/login'); return null }; return res.json() })
      .then((d) => { if (d) setUser(d.username) })
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false))
  }, [router])

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/admin/${tab}`)
    if (res.ok) setData(await res.json())
  }, [tab])

  useEffect(() => { if (user) fetchData() }, [user, fetchData])

  if (loading) return <div style={{ minHeight: '100vh', background: '#05070A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>Loading...</div>
  if (!user) return null

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this item?')) return
    const res = await fetch(`/api/admin/${tab}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) fetchData()
  }

  const handleSave = async (formData: any) => {
    const method = formData.id ? 'PUT' : 'POST'
    const res = await fetch(`/api/admin/${tab}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    if (res.ok) { setShowForm(false); setEditing(null); fetchData() }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#05070A', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>Portfolio Admin</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#6b7280' }}>{user}</span>
          <button onClick={handleLogout} style={{ fontSize: 13, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: 0 }}>
        <nav style={{ width: 200, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '16px 0', flexShrink: 0 }}>
          {(['projects', 'skills', 'experience', 'testimonials'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setShowForm(false); setEditing(null) }}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '10px 20px',
                fontSize: 14, color: tab === t ? '#818cf8' : '#9ca3af',
                background: tab === t ? 'rgba(99,102,241,0.08)' : 'transparent',
                border: 'none', cursor: 'pointer', textTransform: 'capitalize',
                borderRight: tab === t ? '2px solid #818cf8' : '2px solid transparent',
              }}
            >
              {t}
            </button>
          ))}
        </nav>

        <main style={{ flex: 1, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, textTransform: 'capitalize' }}>{tab}</h2>
            <button
              onClick={() => { setEditing({}); setShowForm(true) }}
              style={{
                padding: '8px 16px', borderRadius: 8, border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              + Add {tab.slice(0, -1)}
            </button>
          </div>

          {showForm && (
            <ItemForm tab={tab} item={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null) }} />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.map((item: any) => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{item.title || item.name || item.role}</span>
                  <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 12 }}>
                    {item.category || item.company || item.company || ''}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => { setEditing(item); setShowForm(true) }}
                    style={{ fontSize: 12, color: '#818cf8', background: 'none', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ fontSize: 12, color: '#ef4444', background: 'none', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {data.length === 0 && (
              <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', padding: 40 }}>No {tab} found. Add your first one!</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function ItemForm({ tab, item, onSave, onCancel }: { tab: Tab; item: any; onSave: (d: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState(item || {})

  const handleChange = (key: string, value: any) => setForm((prev: any) => ({ ...prev, [key]: value }))

  const handleArray = (key: string, value: string) => handleChange(key, value.split(',').map((s: string) => s.trim()).filter(Boolean))

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(form) }

  const inputStyle = {
    width: '100%', height: 38, padding: '0 12px', borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
    color: '#fff', fontSize: 13, outline: 'none', marginTop: 4,
  }

  const labelStyle = { display: 'block', fontSize: 11, color: '#9ca3af', letterSpacing: '0.05em', marginBottom: 16 }

  return (
    <form onSubmit={handleSubmit} style={{
      padding: 20, borderRadius: 12, marginBottom: 24,
      border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.04)',
    }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
        {item?.id ? 'Edit' : 'Add'} {tab.slice(0, -1)}
      </h3>

      {tab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {['title', 'description', 'image', 'category', 'github', 'demo'].map((f) => (
            <div key={f} style={{ gridColumn: ['description'].includes(f) ? '1 / -1' : undefined }}>
              <label style={labelStyle}>
                {f.toUpperCase()}
                {f === 'tech' ? ' (comma separated)' : ''}
                <input style={inputStyle} value={form[f] || ''}
                  onChange={(e) => f === 'tech' ? handleArray(f, e.target.value) : handleChange(f, e.target.value)}
                  placeholder={f} />
              </label>
            </div>
          ))}
        </div>
      )}

      {tab === 'skills' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {['name', 'category', 'level', 'color'].map((f) => (
            <div key={f}>
              <label style={labelStyle}>
                {f.toUpperCase()}
                <input style={inputStyle} type={f === 'level' ? 'number' : 'text'} value={form[f] || ''}
                  onChange={(e) => handleChange(f, e.target.value)} placeholder={f} />
              </label>
            </div>
          ))}
        </div>
      )}

      {tab === 'experience' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['role', 'company', 'period', 'color', 'sortOrder'].map((f) => (
            <div key={f}>
              <label style={labelStyle}>
                {f.toUpperCase()}
                <input style={inputStyle} type={f === 'sortOrder' ? 'number' : 'text'} value={form[f] || ''}
                  onChange={(e) => handleChange(f, e.target.value)} placeholder={f} />
              </label>
            </div>
          ))}
          <div>
            <label style={labelStyle}>
              DESCRIPTION
              <textarea style={{ ...inputStyle, height: 80, padding: '8px 12px', resize: 'vertical' }} value={form.description || ''}
                onChange={(e) => handleChange('description', e.target.value)} />
            </label>
          </div>
          <div>
            <label style={labelStyle}>
              HIGHLIGHTS (comma separated)
              <input style={inputStyle} value={(form.highlights || []).join(', ')}
                onChange={(e) => handleArray('highlights', e.target.value)} />
            </label>
          </div>
          <div>
            <label style={labelStyle}>
              TECH (comma separated)
              <input style={inputStyle} value={(form.tech || []).join(', ')}
                onChange={(e) => handleArray('tech', e.target.value)} />
            </label>
          </div>
        </div>
      )}

      {tab === 'testimonials' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {['name', 'role', 'company', 'avatar', 'rating', 'color'].map((f) => (
            <div key={f}>
              <label style={labelStyle}>
                {f.toUpperCase()}
                <input style={inputStyle} type={f === 'rating' ? 'number' : 'text'} value={form[f] || ''}
                  onChange={(e) => handleChange(f, e.target.value)} placeholder={f} />
              </label>
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>
              CONTENT
              <textarea style={{ ...inputStyle, height: 80, padding: '8px 12px', resize: 'vertical' }} value={form.content || ''}
                onChange={(e) => handleChange('content', e.target.value)} />
            </label>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button type="submit" style={{
          padding: '8px 20px', borderRadius: 8, border: 'none',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          {item?.id ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} style={{
          padding: '8px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
          background: 'transparent', color: '#9ca3af', fontSize: 13, cursor: 'pointer',
        }}>
          Cancel
        </button>
      </div>
    </form>
  )
}

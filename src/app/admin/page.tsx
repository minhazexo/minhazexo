'use client'

import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import VisibilityToggle from '@/components/admin/VisibilityToggle'

type ContentTab = 'projects' | 'skills' | 'experience' | 'testimonials'
type AdminTab = 'profile' | 'security' | 'documents'
type Tab = ContentTab | AdminTab
type VisibilityFilter = 'all' | 'visible' | 'hidden'

const singular = (t: Tab) => (t === 'experience' ? 'experience' : t === 'profile' ? 'profile' : t === 'security' ? 'security' : t === 'documents' ? 'document' : t.slice(0, -1))
const isContentTab = (t: Tab): t is ContentTab => ['projects', 'skills', 'experience', 'testimonials'].includes(t)

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('projects')
  const [data, setData] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all')
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    fetch('/api/admin/me')
      .then((res) => { if (!res.ok) { router.push('/admin/login'); return null }; return res.json() })
      .then((d) => { if (d) setUser(d.username) })
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false))
  }, [router])

  const fetchData = useCallback(async () => {
    if (!isContentTab(tab)) return
    const res = await fetch(`/api/admin/${tab}`)
    if (res.ok) setData(await res.json())
  }, [tab])

  useEffect(() => { if (user && isContentTab(tab)) fetchData() }, [user, fetchData, tab])

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const handleVisibilityToggle = useCallback((id: number, isVisible: boolean) => {
    setData((prev) => prev.map((item: any) => (item.id === id ? { ...item, isVisible } : item)))
    showToast('success', `Project is now ${isVisible ? 'visible' : 'hidden'} on the public website`)
  }, [showToast])

  const displayedData = useMemo(() => {
    if (tab !== 'projects' || visibilityFilter === 'all') return data
    return data.filter((item: any) => (visibilityFilter === 'visible' ? item.isVisible !== false : item.isVisible === false))
  }, [data, tab, visibilityFilter])

  if (loading) return <div style={{ minHeight: '100vh', background: '#05070A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>Loading...</div>
  if (!user) return null

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const handleDelete = async (id: number) => {
    const isProject = tab === 'projects'
    if (!confirm(isProject ? 'Delete this project and its image? This cannot be undone.' : 'Delete this item?')) return
    const res = await fetch(`/api/admin/${tab}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) { fetchData(); showToast('success', 'Deleted successfully') }
    else {
      const j = await res.json().catch(() => ({}))
      showToast('error', j.error || 'Failed to delete')
    }
  }

  const handleSave = async (formData: any) => {
    const method = formData.id ? 'PUT' : 'POST'
    // If formData contains a File for project image, send as multipart so server can handle upload + replace
    const hasImageFile = formData.imageFile instanceof File
    try {
      let res: Response
      if (hasImageFile && isContentTab(tab) && tab === 'projects') {
        const fd = new FormData()
        // append all fields
        for (const [k, v] of Object.entries(formData)) {
          if (k === 'imageFile') continue
          if (k === 'tech' && Array.isArray(v)) fd.append(k, (v as string[]).join(','))
          else if (v !== undefined && v !== null) fd.append(k, String(v))
        }
        fd.append('imageFile', formData.imageFile)
        res = await fetch(`/api/admin/${tab}`, { method, body: fd })
      } else {
        // strip helper field before JSON send
        const { imageFile, ...clean } = formData
        res = await fetch(`/api/admin/${tab}`, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clean),
        })
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        showToast('error', data.error || `Failed to ${method === 'POST' ? 'create' : 'update'} ${tab.slice(0, -1)}`)
        return
      }
      setShowForm(false); setEditing(null); fetchData()
      showToast('success', `${tab.slice(0, -1)} ${method === 'POST' ? 'created' : 'updated'} successfully`)
    } catch {
      showToast('error', 'Network error. Please try again.')
    }
  }

  const contentTabs: ContentTab[] = ['projects', 'skills', 'experience', 'testimonials']
  const adminTabs: AdminTab[] = ['profile', 'security', 'documents']

  return (
    <div style={{ minHeight: '100vh', background: '#05070A', color: '#fff' }}>
      <style>{`
        @media (max-width: 768px) {
          .admin-layout { flex-direction: column !important; }
          .admin-nav { width: 100% !important; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06); display: ${mobileNavOpen ? 'block' : 'none'} !important; }
          .admin-nav-desktop { display: none !important; }
          .admin-header { padding: 12px 16px !important; }
          .admin-header h1 { font-size: 16px !important; }
          .admin-main { padding: 16px !important; overflow-x: hidden !important; }
          .admin-card { padding: 16px !important; }
          .admin-form { padding: 16px !important; }
          .admin-project-card { flex-direction: column !important; align-items: stretch !important; padding: 12px !important; overflow: hidden !important; }
          .admin-project-card-actions { width: 100% !important; justify-content: flex-start !important; margin-top: 4px !important; }
          .admin-project-card-actions button { flex: 1 1 auto !important; min-height: 36px !important; }
          .admin-visibility-wrap { width: 100% !important; justify-content: flex-start !important; align-items: center !important; flex-wrap: wrap !important; gap: 8px !important; }
          .admin-form-grid-2 { grid-template-columns: 1fr !important; }
          .admin-form-grid-3 { grid-template-columns: 1fr !important; }
          .admin-form-grid-docs { grid-template-columns: 1fr !important; }
          .admin-form-grid-docs-span { grid-column: 1 / -1 !important; }
          .admin-doc-card { flex-direction: column !important; align-items: stretch !important; }
          .admin-doc-card-actions { width: 100% !important; }
          .admin-doc-card-actions button { flex: 1 1 0 !important; min-height: 36px !important; }
          .admin-profile-avatar-row { flex-direction: column !important; align-items: flex-start !important; }
          .admin-toast { left: 12px !important; right: 12px !important; bottom: 12px !important; max-width: none !important; }
          .admin-form input, .admin-form textarea, .admin-form select,
          .admin-card input, .admin-card textarea, .admin-card select { font-size: 16px !important; }
        }
        @media (max-width: 480px) {
          .admin-main { padding: 12px !important; }
          .admin-card { padding: 12px !important; }
          .admin-form { padding: 12px !important; }
          .admin-header { padding: 10px 12px !important; }
          .admin-header h1 { font-size: 15px !important; }
          .admin-mobile-toggle { min-width: 44px !important; min-height: 44px !important; padding: 8px 12px !important; }
          .admin-project-card img { width: 48px !important; height: 48px !important; }
        }
        @media (min-width: 769px) {
          .admin-mobile-toggle { display: none !important; }
          .admin-nav-mobile { display: none !important; }
        }
        @media (max-width: 768px) {
          .admin-nav-mobile { display: block !important; }
        }
      `}</style>

      <header className="admin-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#05070A', zIndex: 20, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <button
            className="admin-mobile-toggle"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 12px', color: '#fff', cursor: 'pointer', fontSize: 18, lineHeight: 1, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            aria-label="Toggle navigation"
            aria-expanded={mobileNavOpen}
          >
            {mobileNavOpen ? '✕' : '☰'}
          </button>
          <h1 style={{ fontSize: 18, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Portfolio Admin</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end', minWidth: 0 }}>
          <span style={{ fontSize: 13, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{user}</span>
          <button onClick={handleLogout} style={{ fontSize: 13, color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Logout</button>
        </div>
      </header>

      <div className="admin-layout" style={{ display: 'flex', gap: 0 }}>
        <nav className="admin-nav admin-nav-desktop" style={{ width: 220, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '16px 0', flexShrink: 0, minHeight: 'calc(100vh - 57px)', position: 'sticky', top: 57, alignSelf: 'flex-start', overflowY: 'auto' }}>
          <NavGroup label="Content" tabs={contentTabs} active={tab} onChange={(t)=>{ setTab(t); setShowForm(false); setEditing(null); setVisibilityFilter('all')}} />
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '12px 16px' }} />
          <NavGroup label="Account" tabs={adminTabs} active={tab} onChange={(t)=>{ setTab(t); setShowForm(false); setEditing(null)}} />
        </nav>

        {/* mobile nav */}
        <nav className="admin-nav admin-nav-mobile" style={{ width: 220, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '12px 0', background: '#0A0E14' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '0 12px' }}>
            {[...contentTabs, ...adminTabs].map(t => (
              <button
                key={t}
                onClick={()=>{ setTab(t as Tab); setMobileNavOpen(false); setShowForm(false); setEditing(null)}}
                style={{
                  padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', minHeight: 36,
                  border: tab===t ? '1px solid rgba(99,102,241,0.6)' : '1px solid rgba(255,255,255,0.08)',
                  background: tab===t ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                  color: tab===t ? '#a5b4fc' : '#9ca3af',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </nav>

        <main className="admin-main" style={{ flex: 1, padding: 24, minWidth: 0, maxWidth: '100%' }}>
          {isContentTab(tab) ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, textTransform: 'capitalize' }}>{tab}</h2>
                <button
                  onClick={() => { setEditing({}); setShowForm(true) }}
                  style={{
                    padding: '8px 16px', borderRadius: 8, border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  + Add {singular(tab)}
                </button>
              </div>

              {showForm && (
                <ItemForm tab={tab} item={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null) }} />
              )}

              {tab === 'projects' && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {(['all', 'visible', 'hidden'] as VisibilityFilter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setVisibilityFilter(f)}
                      style={{
                        padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', textTransform: 'capitalize',
                        border: visibilityFilter === f ? '1px solid rgba(99,102,241,0.6)' : '1px solid rgba(255,255,255,0.1)',
                        background: visibilityFilter === f ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                        color: visibilityFilter === f ? '#a5b4fc' : '#9ca3af',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {f}
                      {f !== 'all' && (
                        <span style={{ opacity: 0.7, marginLeft: 6 }}>
                          {f === 'visible'
                            ? data.filter((i: any) => i.isVisible !== false).length
                            : data.filter((i: any) => i.isVisible === false).length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {displayedData.map((item: any) => (
                  <div key={item.id} className="admin-project-card" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
                    padding: '14px 16px', borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.06)',
                    background: tab === 'projects' && item.isVisible === false ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.02)',
                  }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, minWidth: 0 }}>
                      {tab === 'projects' && item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0, background: 'rgba(255,255,255,0.04)' }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                        />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{item.title || item.name || item.role}</span>
                        <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 12 }}>
                          {item.category || item.company || ''}
                        </span>
                        {tab === 'projects' && item.image && (
                          <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2, wordBreak: 'break-all', maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.image.startsWith('data:image/') ? `Data image • ${Math.round(item.image.length / 1024)} KB` : item.image.length > 60 ? `${item.image.slice(0, 60)}…` : item.image}
                          </div>
                        )}
                        {tab === 'projects' && (
                          <div className="admin-visibility-wrap" style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                            <VisibilityToggle
                              projectId={item.id}
                              isVisible={item.isVisible !== false}
                              onToggle={handleVisibilityToggle}
                              onError={(msg) => showToast('error', msg)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="admin-project-card-actions" style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => { setEditing(item); setShowForm(true) }}
                        style={{ fontSize: 12, color: '#818cf8', background: 'none', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', minHeight: 32 }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{ fontSize: 12, color: '#ef4444', background: 'none', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', minHeight: 32 }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {displayedData.length === 0 && (
                  <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', padding: 40 }}>
                    {data.length === 0 ? `No ${tab} found. Add your first one!` : 'No projects match this filter.'}
                  </p>
                )}
              </div>
            </>
          ) : tab === 'profile' ? (
            <ProfileTab onToast={showToast} />
          ) : tab === 'security' ? (
            <SecurityTab onToast={showToast} />
          ) : (
            <DocumentsTab onToast={showToast} />
          )}
        </main>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            className="admin-toast"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            role="status"
            style={{
              position: 'fixed', bottom: 24, right: 24, zIndex: 100,
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500,
              color: '#fff', maxWidth: 'min(90vw, 380px)',
              background: toast.type === 'success' ? 'rgba(16,185,129,0.95)' : 'rgba(239,68,68,0.95)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', flexShrink: 0 }} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NavGroup({ label, tabs, active, onChange }: { label: string; tabs: Tab[]; active: Tab; onChange: (t: Tab)=>void }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#6b7280', padding: '8px 20px 6px' }}>{label.toUpperCase()}</div>
      {tabs.map(t=>(
        <button
          key={t}
          onClick={()=>onChange(t)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '10px 20px',
            fontSize: 14, color: active===t ? '#a5b4fc' : '#9ca3af',
            background: active===t ? 'rgba(99,102,241,0.08)' : 'transparent',
            border: 'none', cursor: 'pointer', textTransform: 'capitalize',
            borderRight: active===t ? '2px solid #818cf8' : '2px solid transparent',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: active===t ? '#818cf8' : 'rgba(255,255,255,0.12)', flexShrink: 0 }} />
          {t}
        </button>
      ))}
    </div>
  )
}

// ---------------- Profile Tab ----------------
function ProfileTab({ onToast }: { onToast: (t:'success'|'error', m:string)=>void }) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarCacheBust, setAvatarCacheBust] = useState(Date.now())
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ username:'', email:'', displayName:'', title:'', phone:'', location:'', bio:'' })

  const fetchProfile = useCallback(async ()=>{
    setLoading(true)
    try {
      const res = await fetch('/api/admin/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
        setForm({
          username: data.username || '',
          email: data.email || '',
          displayName: data.displayName || '',
          title: data.title || '',
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || '',
        })
        if (data.avatarUrl) setAvatarPreview(`/api/admin/profile/avatar?t=${Date.now()}`)
      } else {
        const j = await res.json().catch(()=>({}))
        onToast('error', j.error || 'Failed to load profile')
      }
    } catch { onToast('error','Failed to load profile') }
    finally { setLoading(false) }
  },[onToast])

  useEffect(()=>{ fetchProfile() },[fetchProfile])

  const handleChange = (k:string, v:string)=> setForm(p=>({...p,[k]:v}))

  const handleSave = async (e: React.FormEvent)=>{
    e.preventDefault()
    setSaving(true)
    try{
      const res = await fetch('/api/admin/profile',{ method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)})
      const j = await res.json()
      if(!res.ok){ onToast('error', j.error || 'Failed to save'); return}
      setProfile(j)
      onToast('success', 'Profile updated successfully')
    }catch{ onToast('error','Network error')}
    finally{ setSaving(false)}
  }

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>)=>{
    const f = e.target.files?.[0]
    if(!f) return
    if(f.size > 5*1024*1024){ onToast('error','Avatar must be ≤5MB'); return}
    if(!['image/jpeg','image/png','image/webp','image/gif'].includes(f.type)){ onToast('error','Only JPG/PNG/WEBP/GIF allowed'); return}
    setAvatarUploading(true)
    try{
      const fd = new FormData()
      fd.append('avatar', f)
      const res = await fetch('/api/admin/profile/avatar',{ method:'POST', body: fd})
      const j = await res.json()
      if(!res.ok){ onToast('error', j.error || 'Avatar upload failed'); return}
      setAvatarPreview(`/api/admin/profile/avatar?t=${Date.now()}`)
      setAvatarCacheBust(Date.now())
      onToast('success','Avatar updated')
    }catch{ onToast('error','Upload failed')}
    finally{ setAvatarUploading(false); if(fileRef.current) fileRef.current.value='' }
  }

  const handleRemoveAvatar = async ()=>{
    if(!confirm('Remove avatar?')) return
    try{
      const res = await fetch('/api/admin/profile/avatar',{ method:'DELETE'})
      if(!res.ok){ const j=await res.json().catch(()=>({})); onToast('error', j.error||'Failed'); return}
      setAvatarPreview(null)
      onToast('success','Avatar removed')
    }catch{ onToast('error','Failed to remove')}
  }

  if(loading) return <div style={{color:'#6b7280', padding:40, textAlign:'center'}}>Loading profile…</div>

  const inputStyle: React.CSSProperties = { width:'100%', height:42, padding:'0 12px', borderRadius:10, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.04)', color:'#fff', fontSize:14, outline:'none' }
  const labelStyle: React.CSSProperties = { display:'block', fontSize:11, fontWeight:600, color:'#9ca3af', letterSpacing:'0.06em', marginBottom:6 }
  const cardStyle: React.CSSProperties = { background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:24 }

  return (
    <div style={{ maxWidth: 760 }}>
      <h2 style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>Profile</h2>
      <p style={{ fontSize:13, color:'#6b7280', marginBottom:24 }}>Manage your public admin identity. This information is tied to your login account.</p>

      <div className="admin-card" style={cardStyle}>
        {/* Avatar */}
        <div className="admin-profile-avatar-row" style={{ display:'flex', alignItems:'center', gap:20, marginBottom:28, flexWrap:'wrap' }}>
          <div style={{ position:'relative', width:96, height:96, borderRadius:'50%', overflow:'hidden', background:'rgba(255,255,255,0.06)', border:'2px solid rgba(99,102,241,0.3)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {avatarPreview ? (
              <img key={avatarCacheBust} src={avatarPreview} alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            ) : (
              <span style={{ fontSize:32, color:'#9ca3af' }}>{(form.displayName || form.username || 'A').charAt(0).toUpperCase()}</span>
            )}
            {avatarUploading && (
              <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ width:20, height:20, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} />
              </div>
            )}
          </div>
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>Profile photo</div>
            <div style={{ fontSize:12, color:'#6b7280', marginBottom:12 }}>JPG, PNG, WEBP or GIF. Max 5MB. Private — only visible when logged in.</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleAvatar} style={{ display:'none' }} />
              <button onClick={()=>fileRef.current?.click()} disabled={avatarUploading} style={{ padding:'7px 14px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer', opacity:avatarUploading?0.6:1 }}>
                {avatarUploading ? 'Uploading…' : 'Upload new'}
              </button>
              {avatarPreview && (
                <button onClick={handleRemoveAvatar} style={{ padding:'7px 14px', borderRadius:8, border:'1px solid rgba(239,68,68,0.3)', background:'transparent', color:'#f87171', fontSize:12, fontWeight:600, cursor:'pointer' }}>Remove</button>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16 }}>
            <div>
              <label style={labelStyle}>USERNAME *</label>
              <input value={form.username} onChange={e=>handleChange('username', e.target.value)} required minLength={3} style={inputStyle} placeholder="admin" />
            </div>
            <div>
              <label style={labelStyle}>EMAIL *</label>
              <input value={form.email} onChange={e=>handleChange('email', e.target.value)} required type="email" style={inputStyle} placeholder="you@example.com" />
            </div>
            <div>
              <label style={labelStyle}>DISPLAY NAME</label>
              <input value={form.displayName} onChange={e=>handleChange('displayName', e.target.value)} style={inputStyle} placeholder="MD Mehrab Hossain" />
            </div>
            <div>
              <label style={labelStyle}>TITLE / ROLE</label>
              <input value={form.title} onChange={e=>handleChange('title', e.target.value)} style={inputStyle} placeholder="Full Stack Developer" />
            </div>
            <div>
              <label style={labelStyle}>PHONE</label>
              <input value={form.phone} onChange={e=>handleChange('phone', e.target.value)} style={inputStyle} placeholder="+880..." />
            </div>
            <div>
              <label style={labelStyle}>LOCATION</label>
              <input value={form.location} onChange={e=>handleChange('location', e.target.value)} style={inputStyle} placeholder="Dhaka, Bangladesh" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>BIO / ABOUT</label>
            <textarea value={form.bio} onChange={e=>handleChange('bio', e.target.value)} rows={4} maxLength={5000} placeholder="Short bio displayed on your portfolio or admin profile…" style={{ ...inputStyle, height:96, padding:'10px 12px', resize:'vertical' }} />
            <div style={{ fontSize:11, color:'#6b7280', marginTop:4, textAlign:'right' }}>{form.bio.length}/5000</div>
          </div>

          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button type="submit" disabled={saving} style={{ padding:'10px 22px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', opacity:saving?0.6:1 }}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button type="button" onClick={fetchProfile} style={{ padding:'10px 18px', borderRadius:10, border:'1px solid rgba(255,255,255,0.08)', background:'transparent', color:'#9ca3af', fontSize:13, cursor:'pointer' }}>Reset</button>
          </div>
        </form>
      </div>

      <div style={{ marginTop:16, padding:'12px 16px', borderRadius:10, background:'rgba(99,102,241,0.06)', border:'1px solid rgba(99,102,241,0.12)', fontSize:12, color:'#9ca3af', lineHeight:1.6 }}>
        <strong style={{ color:'#a5b4fc' }}>Note:</strong> Profile is linked to your login identity — no duplicate accounts are created. Username & email must be unique. Avatar and files are stored privately and require authentication to access.
      </div>
    </div>
  )
}

// ---------------- Security Tab ----------------
function SecurityTab({ onToast }: { onToast: (t:'success'|'error', m:string)=>void }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState({ cur:false, nxt:false, cnf:false })
  const [loading, setLoading] = useState(false)

  const checks = useMemo(()=>({
    len: next.length >= 8,
    upper: /[A-Z]/.test(next),
    lower: /[a-z]/.test(next),
    num: /[0-9]/.test(next),
    match: next && next===confirm,
    different: current && next && current!==next,
  }),[next, confirm, current])

  const strength = useMemo(()=>{
    let s=0
    if(checks.len) s++
    if(checks.upper) s++
    if(checks.lower) s++
    if(checks.num) s++
    if(next.length>=12) s++
    return s
  },[checks, next])

  const strengthLabel = ['Very weak','Weak','Fair','Good','Strong','Very strong'][Math.min(strength,5)]
  const strengthColor = ['#ef4444','#f97316','#eab308','#22c55e','#10b981','#06b6d4'][Math.min(strength,5)]

  const handleSubmit = async (e: React.FormEvent)=>{
    e.preventDefault()
    if(!checks.len) return onToast('error','Password must be at least 8 characters')
    if(!checks.upper || !checks.lower || !checks.num) return onToast('error','Password must include uppercase, lowercase and a number')
    if(next!==confirm) return onToast('error','Passwords do not match')
    if(current===next) return onToast('error','New password must be different')
    setLoading(true)
    try{
      const res = await fetch('/api/admin/change-password',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ currentPassword: current, newPassword: next, confirmPassword: confirm })})
      const j = await res.json()
      if(!res.ok){ onToast('error', j.error || 'Failed to change password'); return}
      onToast('success','Password changed successfully. Other sessions have been invalidated.')
      setCurrent(''); setNext(''); setConfirm('')
    }catch{ onToast('error','Network error')}
    finally{ setLoading(false)}
  }

  const inputWrap: React.CSSProperties = { position:'relative', display:'flex', alignItems:'center' }
  const inputStyle: React.CSSProperties = { width:'100%', height:44, padding:'0 44px 0 14px', borderRadius:10, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.04)', color:'#fff', fontSize:14, outline:'none' }

  return (
    <div style={{ maxWidth:560 }}>
      <h2 style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>Security</h2>
      <p style={{ fontSize:13, color:'#6b7280', marginBottom:24 }}>Change your password securely. You must confirm your current password. All other sessions will be invalidated after a successful change.</p>

      <form className="admin-card" onSubmit={handleSubmit} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:24, display:'flex', flexDirection:'column', gap:18 }}>
        {[
          { label:'CURRENT PASSWORD', value:current, setter:setCurrent, key:'cur' as const },
          { label:'NEW PASSWORD', value:next, setter:setNext, key:'nxt' as const },
          { label:'CONFIRM NEW PASSWORD', value:confirm, setter:setConfirm, key:'cnf' as const },
        ].map(f=>(
          <div key={f.key}>
            <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#9ca3af', letterSpacing:'0.06em', marginBottom:6 }}>{f.label}</label>
            <div style={inputWrap}>
              <input type={show[f.key] ? 'text':'password'} value={f.value} onChange={e=>f.setter(e.target.value)} required style={inputStyle} placeholder="••••••••" />
              <button type="button" onClick={()=>setShow(p=>({...p,[f.key]:!p[f.key]}))} style={{ position:'absolute', right:8, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'6px 8px', color:'#9ca3af', cursor:'pointer', fontSize:11, fontWeight:700 }}>
                {show[f.key] ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>
        ))}

        {/* strength meter */}
        {next && (
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <span style={{ fontSize:12, fontWeight:600, color:'#9ca3af' }}>Password strength</span>
              <span style={{ fontSize:12, fontWeight:700, color: strengthColor }}>{strengthLabel}</span>
            </div>
            <div style={{ height:6, borderRadius:999, background:'rgba(255,255,255,0.08)', overflow:'hidden', display:'flex', gap:3 }}>
              {Array.from({length:5}).map((_,i)=>(
                <div key={i} style={{ flex:1, background: i < strength ? strengthColor : 'transparent', borderRadius:999, transition:'background 0.2s' }} />
              ))}
            </div>
            <ul style={{ margin:'10px 0 0', padding:0, listStyle:'none', display:'grid', gap:4 }}>
              {[
                { ok:checks.len, label:'At least 8 characters' },
                { ok:checks.upper, label:'One uppercase letter' },
                { ok:checks.lower, label:'One lowercase letter' },
                { ok:checks.num, label:'One number' },
                { ok:checks.match, label:'Passwords match' },
                { ok:checks.different, label:'Different from current' },
              ].map((c,i)=>(
                <li key={i} style={{ fontSize:12, color: c.ok ? '#34d399' : '#6b7280', display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ width:14, height:14, borderRadius:'50%', background: c.ok ? 'rgba(16,185,129,0.15)':'rgba(255,255,255,0.06)', border:`1px solid ${c.ok ? 'rgba(16,185,129,0.4)':'rgba(255,255,255,0.08)'}`, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:9 }}>{c.ok ? '✓' : '·'}</span>
                  {c.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" disabled={loading} style={{ height:46, borderRadius:10, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Updating…' : 'Change password'}
        </button>

        <p style={{ fontSize:11, color:'#6b7280', lineHeight:1.6, margin:0 }}>
          Your password is hashed with bcrypt before storage and never stored in plain text. After changing, you will remain logged in on this device, but all other browsers/sessions will be logged out automatically.
        </p>
      </form>
    </div>
  )
}

// ---------------- Documents Tab ----------------
function DocumentsTab({ onToast }: { onToast: (t:'success'|'error', m:string)=>void }) {
  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [category, setCategory] = useState('document')
  const [description, setDescription] = useState('')
  const [filter, setFilter] = useState('all')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [editingDesc, setEditingDesc] = useState<Record<number,string>>({})

  const fetchDocs = useCallback(async ()=>{
    setLoading(true)
    try{
      const url = filter==='all' ? '/api/admin/documents' : `/api/admin/documents?category=${filter}`
      const res = await fetch(url)
      if(res.ok) setDocs(await res.json())
      else setDocs([])
    }catch{ setDocs([])}
    finally{ setLoading(false)}
  },[filter])

  useEffect(()=>{ fetchDocs() },[fetchDocs])

  const doUpload = async (file: File)=>{
    if(!file) return
    if(file.size > 10*1024*1024){ onToast('error','File too large (max 10MB)'); return}
    setUploading(true)
    try{
      const fd = new FormData()
      fd.append('file', file)
      fd.append('category', category)
      if(description.trim()) fd.append('description', description.trim())
      const res = await fetch('/api/admin/documents',{ method:'POST', body: fd})
      const j = await res.json()
      if(!res.ok){ onToast('error', j.error || 'Upload failed'); return}
      onToast('success', 'File uploaded')
      setDescription('')
      fetchDocs()
    }catch{ onToast('error','Upload failed')}
    finally{ setUploading(false); if(fileRef.current) fileRef.current.value='' }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const f = e.target.files?.[0]
    if(f) doUpload(f)
  }

  const handleDrop = (e: React.DragEvent)=>{
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if(f) doUpload(f)
  }

  const handleDownload = async (doc: any)=>{
    try{
      const res = await fetch(`/api/admin/documents/${doc.id}?download=1`)
      if(!res.ok){ const j=await res.json().catch(()=>({})); onToast('error', j.error||'Download failed'); return}
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = doc.originalName; document.body.appendChild(a); a.click()
      a.remove(); URL.revokeObjectURL(url)
    }catch{ onToast('error','Download failed')}
  }

  const handleDelete = async (id:number)=>{
    if(!confirm('Delete this file? This cannot be undone.')) return
    try{
      const res = await fetch(`/api/admin/documents/${id}`,{ method:'DELETE'})
      if(!res.ok){ const j=await res.json().catch(()=>({})); onToast('error', j.error||'Delete failed'); return}
      onToast('success','File deleted')
      fetchDocs()
    }catch{ onToast('error','Delete failed')}
  }

  const handleUpdateMeta = async (doc: any)=>{
    const newDesc = editingDesc[doc.id]
    if(newDesc===undefined) return
    try{
      const res = await fetch(`/api/admin/documents/${doc.id}`,{ method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ description: newDesc })})
      if(!res.ok){ const j=await res.json().catch(()=>({})); onToast('error', j.error||'Update failed'); return}
      onToast('success','Updated')
      fetchDocs()
    }catch{ onToast('error','Update failed')}
  }

  const formatSize = (b:number)=>{
    if(b<1024) return `${b} B`
    if(b<1024*1024) return `${(b/1024).toFixed(1)} KB`
    return `${(b/1024/1024).toFixed(2)} MB`
  }
  const formatDate = (s:string)=> new Date(s).toLocaleDateString('en-US',{ year:'numeric', month:'short', day:'numeric' })

  const cats = ['all','cv','resume','certificate','document','other']

  return (
    <div style={{ maxWidth: 860 }}>
      <h2 style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>Documents & Files</h2>
      <p style={{ fontSize:13, color:'#6b7280', marginBottom:20 }}>Private storage for your CV, certificates and other important files. Files are stored securely and require authentication to download.</p>

      {/* upload card */}
      <div className="admin-card" style={{ background:'rgba(255,255,255,0.02)', border:`1px solid ${dragOver ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.06)'}`, borderRadius:16, padding:20, marginBottom:20, transition:'border-color 0.2s' }}
        onDragOver={e=>{e.preventDefault(); setDragOver(true)}}
        onDragLeave={()=>setDragOver(false)}
        onDrop={handleDrop}
      >
        <div
          onClick={()=>fileRef.current?.click()}
          style={{
            border:'1.5px dashed rgba(99,102,241,0.35)', borderRadius:12, padding:'22px 16px', textAlign:'center', cursor:'pointer',
            background: dragOver ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.03)', transition:'background 0.2s'
          }}
        >
          <div style={{ fontSize:28, marginBottom:8 }}>📁</div>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>{uploading ? 'Uploading…' : 'Click to upload or drag & drop'}</div>
          <div style={{ fontSize:12, color:'#6b7280' }}>PDF, DOCX, XLSX, images, ZIP up to 10MB. Stored privately.</div>
          <input ref={fileRef} type="file" onChange={handleFileChange} style={{ display:'none' }} />
        </div>

        <div className="admin-form-grid-docs" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px,1fr))', gap:12, marginTop:16 }}>
          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#9ca3af', letterSpacing:'0.06em', marginBottom:6 }}>CATEGORY</label>
            <select value={category} onChange={e=>setCategory(e.target.value)} style={{ width:'100%', height:38, borderRadius:8, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.04)', color:'#fff', fontSize:13, padding:'0 10px' }}>
              <option value="document" style={{color:'#000'}}>Document</option>
              <option value="cv" style={{color:'#000'}}>CV / Resume</option>
              <option value="resume" style={{color:'#000'}}>Resume</option>
              <option value="certificate" style={{color:'#000'}}>Certificate</option>
              <option value="other" style={{color:'#000'}}>Other</option>
            </select>
          </div>
          <div className="admin-form-grid-docs-span" style={{ gridColumn:'span 2' }}>
            <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#9ca3af', letterSpacing:'0.06em', marginBottom:6 }}>DESCRIPTION (OPTIONAL)</label>
            <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="e.g., Updated CV - Jan 2026" maxLength={2000} style={{ width:'100%', height:38, borderRadius:8, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.04)', color:'#fff', fontSize:13, padding:'0 12px' }} />
          </div>
        </div>
      </div>

      {/* filters */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setFilter(c)} style={{
            padding:'6px 14px', borderRadius:999, fontSize:12, fontWeight:600, cursor:'pointer', textTransform:'capitalize',
            border: filter===c ? '1px solid rgba(99,102,241,0.6)' : '1px solid rgba(255,255,255,0.1)',
            background: filter===c ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
            color: filter===c ? '#a5b4fc' : '#9ca3af',
          }}>
            {c}
          </button>
        ))}
        <span style={{ marginLeft:'auto', fontSize:12, color:'#6b7280', alignSelf:'center' }}>{docs.length} file{docs.length!==1?'s':''}</span>
      </div>

      {/* list */}
      {loading ? (
        <div style={{ color:'#6b7280', textAlign:'center', padding:40 }}>Loading documents…</div>
      ) : docs.length===0 ? (
        <div style={{ border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:40, textAlign:'center', background:'rgba(255,255,255,0.02)' }}>
          <div style={{ fontSize:36, marginBottom:12 }}>📄</div>
          <div style={{ fontSize:16, fontWeight:600, marginBottom:6 }}>No documents yet</div>
          <div style={{ fontSize:13, color:'#6b7280', marginBottom:16 }}>Upload your CV, certificates or other private files. They will appear here and are only accessible when logged in.</div>
          <button onClick={()=>fileRef.current?.click()} style={{ padding:'8px 16px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>Upload first file</button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {docs.map((d:any)=>(
            <div key={d.id} className="admin-doc-card" style={{ display:'flex', gap:14, padding:16, borderRadius:12, border:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)', flexWrap:'wrap', alignItems:'center' }}>
              <div style={{ width:44, height:44, borderRadius:10, background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                {d.category==='cv' || d.category==='resume' ? '📄' : d.category==='certificate' ? '🏅' : d.mimeType?.includes('image') ? '🖼️' : d.mimeType?.includes('pdf') ? '📕' : '📦'}
              </div>
              <div style={{ flex:1, minWidth:200 }}>
                <div style={{ fontSize:14, fontWeight:600, wordBreak:'break-all' }}>{d.originalName}</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', marginTop:4 }}>
                  <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.04em', padding:'2px 8px', borderRadius:999, background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.25)', color:'#a5b4fc', textTransform:'uppercase' }}>{d.category}</span>
                  <span style={{ fontSize:11, color:'#6b7280' }}>{formatSize(d.size)} • {formatDate(d.createdAt)}</span>
                </div>
                {d.description && <div style={{ fontSize:12, color:'#9ca3af', marginTop:6, lineHeight:1.5 }}>{d.description}</div>}
                {/* inline description edit */}
                <div style={{ marginTop:8, display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' }}>
                  <input
                    value={editingDesc[d.id] ?? d.description ?? ''}
                    onChange={e=>setEditingDesc(p=>({...p, [d.id]: e.target.value}))}
                    placeholder="Edit description…"
                    style={{ flex:'1 1 160px', minWidth:140, height:32, borderRadius:8, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.04)', color:'#fff', fontSize:12, padding:'0 10px' }}
                  />
                  <button onClick={()=>handleUpdateMeta(d)} style={{ height:32, padding:'0 12px', borderRadius:8, border:'1px solid rgba(99,102,241,0.3)', background:'rgba(99,102,241,0.12)', color:'#a5b4fc', fontSize:12, fontWeight:600, cursor:'pointer' }}>Save</button>
                </div>
              </div>
              <div className="admin-doc-card-actions" style={{ display:'flex', gap:8, flexShrink:0 }}>
                <button onClick={()=>handleDownload(d)} style={{ padding:'7px 14px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer', minHeight: 36 }}>Download</button>
                <button onClick={()=>handleDelete(d.id)} style={{ padding:'7px 12px', borderRadius:8, border:'1px solid rgba(239,68,68,0.3)', background:'transparent', color:'#f87171', fontSize:12, fontWeight:600, cursor:'pointer', minHeight: 36 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop:16, padding:'12px 16px', borderRadius:10, background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.15)', fontSize:11, color:'#9ca3af', lineHeight:1.6 }}>
        <strong style={{ color:'#fbbf24' }}>Privacy:</strong> All files are private. Download requires an authenticated admin session — unauthenticated users receive 401. Files are stored in <code style={{ background:'rgba(255,255,255,0.06)', padding:'1px 6px', borderRadius:4 }}>private_uploads/</code> (or <code style={{ background:'rgba(255,255,255,0.06)', padding:'1px 6px', borderRadius:4 }}>/tmp/uploads</code> on Vercel) with metadata in Neon Postgres. For durable production storage, optionally configure Vercel Blob or S3 via <code style={{ background:'rgba(255,255,255,0.06)', padding:'1px 6px', borderRadius:4 }}>BLOB_READ_WRITE_TOKEN</code>.
      </div>
    </div>
  )
}

function ItemForm({ tab, item, onSave, onCancel }: { tab: ContentTab; item: any; onSave: (d: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState(item || {})
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleChange = (key: string, value: any) => setForm((prev: any) => ({ ...prev, [key]: value }))

  const handleArray = (key: string, value: string) => handleChange(key, value.split(',').map((s: string) => s.trim()).filter(Boolean))

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(form) }

  const handleProjectImage = async (file: File) => {
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { setImageError('Image must be ≤10MB'); return }
    if (!['image/jpeg','image/png','image/webp','image/avif','image/gif'].includes(file.type)) { setImageError('Only JPG/PNG/WEBP/AVIF/GIF allowed'); return }
    setImageError(null); setImageUploading(true)
    try {
      // Try direct upload endpoint first for instant preview (also works via final save, but this gives immediate URL)
      const fd = new FormData()
      fd.append('image', file)
      const res = await fetch('/api/admin/projects/images', { method: 'POST', body: fd })
      const j = await res.json()
      if (!res.ok) { setImageError(j.error || 'Upload failed'); return }
      handleChange('image', j.url)
      // keep file for multipart fallback? clear imageFile if we already uploaded via URL
      setForm((prev: any) => { const { imageFile, ...rest } = prev; return { ...rest, image: j.url } })
    } catch { setImageError('Upload failed') }
    finally { setImageUploading(false); if (fileRef.current) fileRef.current.value = '' }
  }

  // Alternative path: keep file for final multipart submit (if direct upload not desired, user can just set imageFile)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleProjectImage(f)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleProjectImage(f)
  }

  const handleRemoveImage = () => {
    if (!confirm('Remove this image? You can upload a replacement.')) return
    handleChange('image', '')
    setForm((prev: any) => { const { imageFile, ...rest } = prev; return rest })
    setImageError(null)
  }

  const inputStyle = {
    width: '100%', height: 38, padding: '0 12px', borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
    color: '#fff', fontSize: 13, outline: 'none', marginTop: 4,
  } as const

  const labelStyle = { display: 'block', fontSize: 11, color: '#9ca3af', letterSpacing: '0.05em', marginBottom: 16 } as const

  return (
    <form className="admin-form" onSubmit={handleSubmit} style={{
      padding: 20, borderRadius: 12, marginBottom: 24,
      border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.04)',
    }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
        {item?.id ? 'Edit' : 'Add'} {singular(tab)}
      </h3>

      {tab === 'projects' && (
        <>
          {/* Image management — upload / replace / delete / preview */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              border: `1.5px dashed ${dragOver ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 12, padding: 16, marginBottom: 16,
              background: dragOver ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: '#9ca3af', marginBottom: 10 }}>PROJECT IMAGE *</div>
            {form.image ? (
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <img src={form.image} alt="Preview" style={{ width: 140, height: 90, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 12, color: '#9ca3af', wordBreak: 'break-all', marginBottom: 8, maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {form.image?.startsWith('data:image/') ? `Data image • ${Math.round(form.image.length / 1024)} KB • stored in DB` : form.image}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={handleFileSelect} style={{ display: 'none' }} />
                    <button type="button" onClick={() => fileRef.current?.click()} disabled={imageUploading} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: imageUploading ? 0.6 : 1 }}>
                      {imageUploading ? 'Uploading…' : 'Replace image'}
                    </button>
                    <button type="button" onClick={handleRemoveImage} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#f87171', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Remove</button>
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 6 }}>JPG/PNG/WEBP/AVIF/GIF — max 10MB — auto-optimized to WEBP (1280px)</div>
                </div>
              </div>
            ) : (
              <div onClick={() => fileRef.current?.click()} style={{ textAlign: 'center', cursor: 'pointer', padding: '12px 0' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{imageUploading ? '⏳' : '🖼️'}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{imageUploading ? 'Uploading…' : 'Click to upload or drag & drop'}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>Upload from your computer — stored via DB &amp; public API</div>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={handleFileSelect} style={{ display: 'none' }} />
              </div>
            )}
            {imageError && <div style={{ marginTop: 8, color: '#f87171', fontSize: 12 }}>{imageError}</div>}
            {/* Fallback URL input for external paste — hide when data URL is present to avoid 100KB input */}
            {form.image?.startsWith('data:image/') ? (
              <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', fontSize: 12, color: '#6ee7b7' }}>
                ✓ Image stored in Neon DB ({Math.round(form.image.length / 1024)} KB) — will survive Vercel redeploys.
              </div>
            ) : (
              <div style={{ marginTop: 12 }}>
                <label style={{ display: 'block', fontSize: 10, color: '#6b7280', letterSpacing: '0.05em' }}>OR PASTE IMAGE URL</label>
                <input style={{ ...inputStyle, marginTop: 6 }} value={form.image || ''} onChange={(e) => handleChange('image', e.target.value)} placeholder="https://... or leave empty and upload" />
              </div>
            )}
          </div>

          <div className="admin-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {['title', 'category', 'github', 'demo'].map((f) => (
              <div key={f}>
                <label style={labelStyle}>
                  {f.toUpperCase()}
                  <input style={inputStyle} value={form[f] || ''} onChange={(e) => handleChange(f, e.target.value)} placeholder={f} />
                </label>
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>
                DESCRIPTION
                <textarea style={{ ...inputStyle, height: 80, padding: '8px 12px', resize: 'vertical' as const }} value={form.description || ''} onChange={(e) => handleChange('description', e.target.value)} placeholder="description" />
              </label>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>
                TECH (comma separated)
                <input style={inputStyle} value={(form.tech || []).join(', ')} onChange={(e) => handleArray('tech', e.target.value)} placeholder="React, Next.js" />
              </label>
            </div>
          </div>
        </>
      )}

      {tab === 'skills' && (
        <div className="admin-form-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
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
        <div className="admin-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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

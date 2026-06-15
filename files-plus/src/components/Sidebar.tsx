import { useState, useRef, useEffect } from 'react'

type Category = {
  id: number
  name: string
  color: string
}

const PRESETS = ['#378ADD', '#1D9E75', '#D85A30', '#D4537E', '#7F77DD', '#BA7517', '#639922', '#888780']

export default function Sidebar() {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories')
    return saved ? JSON.parse(saved) : []
  })
  const [active, setActive] = useState<number | 'all'>('all')
  const [forming, setForming] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PRESETS[0])
  const [showPicker, setShowPicker] = useState(false)
  const [menuOpen, setMenuOpen] = useState<number | null>(null)
  const [renaming, setRenaming] = useState<number | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [recoloring, setRecoloring] = useState<number | null>(null)
  const [recolorValue, setRecolorValue] = useState('')
  const [showRecolorPicker, setShowRecolorPicker] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories))
  }, [categories])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const addCategory = () => {
    if (!newName.trim()) return
    setCategories([...categories, { id: Date.now(), name: newName.trim(), color: newColor }])
    setNewName('')
    setNewColor(PRESETS[0])
    setForming(false)
    setShowPicker(false)
  }

  const deleteCategory = (id: number) => {
    setCategories(categories.filter(c => c.id !== id))
    if (active === id) setActive('all')
    setConfirmDelete(null)
    setMenuOpen(null)
  }

  const startRename = (cat: Category) => {
    setRenameValue(cat.name)
    setRenaming(cat.id)
    setMenuOpen(null)
  }

  const confirmRename = (id: number) => {
    if (!renameValue.trim()) return
    setCategories(categories.map(c => c.id === id ? { ...c, name: renameValue.trim() } : c))
    setRenaming(null)
  }

  const startRecolor = (cat: Category) => {
    setRecolorValue(cat.color)
    setRecoloring(cat.id)
    setShowRecolorPicker(false)
    setMenuOpen(null)
  }

  const confirmRecolor = (id: number) => {
    setCategories(categories.map(c => c.id === id ? { ...c, color: recolorValue } : c))
    setRecoloring(null)
    setShowRecolorPicker(false)
  }

  const openMenu = (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    e.stopPropagation()
    setMenuOpen(menuOpen === id ? null : id)
  }

  return (
    <>
      <div style={{ width: 200, background: 'var(--color-bg-primary, var(--bg-secondary))', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '16px 12px', gap: 2 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px 6px' }}>Categories</span>

        <div onClick={() => setActive('all')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: active === 'all' ? 500 : 400, background: active === 'all' ? 'var(--bg-primary)' : 'transparent' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--text-secondary)', flexShrink: 0 }} />
          All files
        </div>

        {categories.map(cat => (
          <div key={cat.id} style={{ position: 'relative' }}>
            {renaming === cat.id ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px' }}>
                <input
                  autoFocus
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') confirmRename(cat.id); if (e.key === 'Escape') setRenaming(null) }}
                  style={{ flex: 1, padding: '4px 6px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, outline: 'none', fontFamily: 'inherit', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                />
                <button onClick={() => setRenaming(null)} className="btn btn-cancel">Cancel</button>
                <button onClick={() => confirmRename(cat.id)} className="btn btn-confirm">OK</button>
              </div>
            ) : recoloring === cat.id ? (
              <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {PRESETS.map(color => (
                    <div key={color} onClick={() => setRecolorValue(color)} style={{ width: 18, height: 18, borderRadius: '50%', background: color, cursor: 'pointer', outline: recolorValue === color ? '2px solid var(--text-primary)' : 'none', outlineOffset: 2 }} />
                  ))}
                </div>
                {showRecolorPicker && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="color" value={recolorValue} onChange={e => setRecolorValue(e.target.value)} style={{ width: 28, height: 28, border: '1px solid var(--border)', borderRadius: 6, padding: 2, cursor: 'pointer' }} />
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Custom color</span>
                  </div>
                )}
                <span onClick={() => setShowRecolorPicker(!showRecolorPicker)} style={{ fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>
                  {showRecolorPicker ? '− hide picker' : '+ more colors'}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => { setRecoloring(null); setShowRecolorPicker(false) }} className="btn btn-cancel" style={{ flex: 1 }}>Cancel</button>
                  <button onClick={() => confirmRecolor(cat.id)} className="btn btn-confirm" style={{ flex: 1 }}>OK</button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setActive(cat.id)}
                onContextMenu={e => openMenu(e, cat.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: active === cat.id ? 500 : 400, background: active === cat.id ? 'var(--bg-primary)' : 'transparent' }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.name}</span>
                <span
                  onClick={e => openMenu(e, cat.id)}
                  style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1, padding: '0 2px', borderRadius: 4, cursor: 'pointer' }}
                  className="cat-menu-btn"
                >
                  ···
                </span>
              </div>
            )}

            {menuOpen === cat.id && (
              <div ref={menuRef} style={{ position: 'absolute', right: 0, top: '100%', zIndex: 100, background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, padding: 4, minWidth: 120, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                {[
                  { label: 'Rename', action: () => startRename(cat), color: 'var(--text-primary)' },
                  { label: 'Recolor', action: () => startRecolor(cat), color: 'var(--text-primary)' },
                  { label: 'Delete', action: () => { setConfirmDelete(cat); setMenuOpen(null) }, color: '#e05a5a' },
                ].map(item => (
                  <div
                    key={item.label}
                    onClick={item.action}
                    style={{ padding: '7px 10px', borderRadius: 6, fontSize: 13, cursor: 'pointer', color: item.color }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div style={{ flex: 1 }} />

        {forming ? (
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCategory()}
              placeholder="Category name"
              style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, outline: 'none', fontFamily: 'inherit', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {PRESETS.map(color => (
                <div key={color} onClick={() => setNewColor(color)} style={{ width: 18, height: 18, borderRadius: '50%', background: color, cursor: 'pointer', outline: newColor === color ? '2px solid var(--text-primary)' : 'none', outlineOffset: 2 }} />
              ))}
            </div>
            {showPicker ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} style={{ width: 28, height: 28, border: '1px solid var(--border)', borderRadius: 6, padding: 2, cursor: 'pointer' }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Custom color</span>
              </div>
            ) : null}
            <span onClick={() => setShowPicker(!showPicker)} style={{ fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>
              {showPicker ? '− hide picker' : '+ more colors'}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => { setForming(false); setShowPicker(false) }} className="btn btn-cancel" style={{ flex: 1 }}>Cancel</button>
              <button onClick={addCategory} className="btn btn-confirm" style={{ flex: 1 }}>Add</button>
            </div>
          </div>
        ) : (
          <div onClick={() => setForming(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)' }}>
            + New category
          </div>
        )}
      </div>

      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 12, padding: 28, width: 320, fontFamily: 'system-ui, sans-serif', color: 'var(--text-primary)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Delete "{confirmDelete.name}"?</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.5 }}>
              This will permanently delete the category. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setConfirmDelete(null)} className="btn btn-cancel" style={{ flex: 1 }}>Cancel</button>
              <button onClick={() => deleteCategory(confirmDelete.id)} className="btn btn-danger" style={{ flex: 1 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
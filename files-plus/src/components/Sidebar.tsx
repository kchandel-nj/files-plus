import { useState } from 'react'

type Category = {
  id: number
  name: string
  color: string
}

const PRESETS = ['#378ADD', '#1D9E75', '#D85A30', '#D4537E', '#7F77DD', '#BA7517', '#639922', '#888780']

export default function Sidebar() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Work', color: '#378ADD' },
    { id: 2, name: 'Personal', color: '#1D9E75' },
  ])
  const [active, setActive] = useState<number | 'all'>('all')
  const [forming, setForming] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PRESETS[0])
  const [showPicker, setShowPicker] = useState(false)

  const addCategory = () => {
    if (!newName.trim()) return
    setCategories([...categories, { id: Date.now(), name: newName.trim(), color: newColor }])
    setNewName('')
    setNewColor(PRESETS[0])
    setForming(false)
    setShowPicker(false)
  }

  return (
    <div style={{ width: 200, background: 'var(--color-bg-primary, var(--bg-secondary))', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '16px 12px', gap: 2 }}>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px 6px' }}>Categories</span>

      <div onClick={() => setActive('all')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: active === 'all' ? 500 : 400, background: active === 'all' ? 'var(--bg-primary)' : 'transparent' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--text-secondary)', flexShrink: 0 }} />
        All files
      </div>

      {categories.map(cat => (
        <div key={cat.id} onClick={() => setActive(cat.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: active === cat.id ? 500 : 400, background: active === cat.id ? 'var(--bg-primary)' : 'transparent' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
          {cat.name}
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
            style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
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
            <button onClick={() => { setForming(false); setShowPicker(false) }} style={{ flex: 1, padding: 5, fontSize: 12, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={addCategory} style={{ flex: 1, padding: 5, fontSize: 12, borderRadius: 6, border: 'none', background: '#222', color: 'var(--bg-primary)', cursor: 'pointer', fontFamily: 'inherit' }}>Add</button>
          </div>
        </div>
      ) : (
        <div onClick={() => setForming(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)' }}>
          + New category
        </div>
      )}
    </div>
  )
}
export default function TopBar() {
  return (
    <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 15, fontWeight: 500, marginRight: 8 }}>Files+</span>
      <div style={{ flex: 1, position: 'relative' }}>
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 16 }}>🔍</span>
        <input
          type="text"
          placeholder="Search files..."
          style={{ width: '100%', padding: '7px 12px 7px 34px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
        />
      </div>
    </div>
  )
}
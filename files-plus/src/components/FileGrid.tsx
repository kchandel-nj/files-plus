export default function FileGrid() {
  return (
    <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Recent files</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No files yet.</div>
    </div>
  )
}
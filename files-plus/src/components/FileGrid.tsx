export default function FileGrid() {
  const files = [
    { id: 1, name: 'vacation.jpg', time: '2 min ago' },
    { id: 2, name: 'report.pdf', time: '1 hr ago' },
    { id: 3, name: 'demo.mp4', time: 'Yesterday' },
    { id: 4, name: 'archive.zip', time: '2 days ago' },
    { id: 5, name: 'notes.docx', time: '3 days ago' },
    { id: 6, name: 'screenshot.png', time: '4 days ago' },
  ]

  return (
    <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Recent files</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
        {files.map(file => (
          <div key={file.id} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 12px', cursor: 'pointer' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, fontSize: 17 }}>📄</div>
            <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{file.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
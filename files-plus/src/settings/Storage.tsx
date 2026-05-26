import { useEffect, useState } from 'react'
import { whenIpcReady } from '../utils/ipc'

function formatBytes(bytes: number) {
  const gb = bytes / (1024 ** 3)
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / (1024 ** 2)).toFixed(0)} MB`
}

export default function Storage() {
  const [disk, setDisk] = useState<{ total: number; used: number; free: number } | null>(null)
  const [folder, setFolder] = useState<string>(() => localStorage.getItem('storage-location') ?? '')

  useEffect(() => {
    whenIpcReady(() => {
      window.ipcRenderer.invoke('get-disk-usage').then(setDisk)
    })
  }, [])

  const pickFolder = async () => {
    if (!window.ipcRenderer) return
    const picked = await window.ipcRenderer.invoke('pick-folder')
    if (picked) {
      setFolder(picked)
      localStorage.setItem('storage-location', picked)
    }
  }

  const usedPct = disk ? (disk.used / disk.total) * 100 : 0

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', color: 'var(--text-primary)', background: 'var(--bg-primary)', height: '100vh' }}>
      <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 20 }}>Storage</h2>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Disk Usage</p>
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '12px 14px', border: '1px solid var(--border)', marginBottom: 24 }}>
        {disk ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10 }}>
              <span>{formatBytes(disk.used)} used</span>
              <span style={{ color: 'var(--text-muted)' }}>{formatBytes(disk.free)} free of {formatBytes(disk.total)}</span>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${usedPct}%`, borderRadius: 999, background: 'var(--text-primary)', transition: 'width 0.3s ease' }} />
            </div>
          </>
        ) : (
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading...</span>
        )}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>File Storage Location</p>
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 14px', border: '1px solid var(--border)', marginBottom: 12, fontSize: 13, color: folder ? 'var(--text-primary)' : 'var(--text-muted)' }}>
        {folder || 'No location selected'}
      </div>
      <button onClick={pickFolder} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
        Choose Folder
      </button>
    </div>
  )
}
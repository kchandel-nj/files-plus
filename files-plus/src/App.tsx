import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import FileGrid from './components/FileGrid'
import './App.css'

function App() {
  const [storageLocation, setStorageLocation] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('storage-location')
    if (saved) {
      setStorageLocation(saved)
    }
    setReady(true)
  }, [])

  const pickFolder = async () => {
    const picked = await window.ipcRenderer.invoke('pick-folder')
    if (picked) {
      localStorage.setItem('storage-location', picked)
      setStorageLocation(picked)
    }
  }

  if (!ready) return null

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />
        <FileGrid />
      </div>

      {!storageLocation && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 12, padding: 28, width: 340, fontFamily: 'system-ui, sans-serif', color: 'var(--text-primary)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Choose a storage location</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.5 }}>
              Files+ needs a folder to manage your files. This can be changed later in Storage settings.
            </p>
            <button
              onClick={pickFolder}
              style={{ width: '100%', padding: '9px 0', borderRadius: 8, border: 'none', background: 'var(--text-primary)', color: 'var(--bg-primary)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Choose Folder
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
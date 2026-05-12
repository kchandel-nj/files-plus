import { useState } from 'react'
import { applyTheme, saveTheme } from '../utils/theme'

const BUILT_IN_THEMES = [
  { name: 'Light', file: 'themes/light.css' },
  { name: 'Dark', file: 'themes/dark.css' },
  { name: 'High Contrast', file: 'themes/high-contrast.css' },
]

export default function Appearance() {
  const [active, setActive] = useState<string | null>(null)
  const [pendingCSS, setPendingCSS] = useState<string | null>(null)
  const [imported, setImported] = useState<{ name: string; css: string }[]>([])
  const [saved, setSaved] = useState(false)

  const selectBuiltIn = async (file: string, name: string) => {
    const res = await fetch(file)
    const css = await res.text()
    setPendingCSS(css)
    applyTheme(css)
    setActive(name)
    setSaved(false)
  }

  const selectImported = (css: string, name: string) => {
    setPendingCSS(css)
    applyTheme(css)
    setActive(name)
    setSaved(false)
  }

  const importCSS = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.css'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const css = await file.text()
      const name = file.name.replace('.css', '')
      setImported(prev => [...prev.filter(t => t.name !== name), { name, css }])
      setPendingCSS(css)
      applyTheme(css)
      setActive(name)
      setSaved(false)
    }
    input.click()
  }

  const applyToAll = () => {
    if (!pendingCSS) return
    saveTheme(pendingCSS)
    try {
      window.ipcRenderer.send('apply-theme', pendingCSS)
    } catch (e) {
      console.error('ipcRenderer.send failed:', e)
    }
    setSaved(true)
  }

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', color: 'var(--text-primary)', background: 'var(--bg-primary)', height: '100vh' }}>
      <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 20 }}>Appearance</h2>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Built-in themes</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {BUILT_IN_THEMES.map(theme => (
          <div key={theme.name} onClick={() => selectBuiltIn(theme.file, theme.name)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, border: `1px solid ${active === theme.name ? 'var(--text-primary)' : 'var(--border)'}`, cursor: 'pointer', background: 'var(--bg-secondary)' }}>
            <span style={{ fontSize: 13 }}>{theme.name}</span>
            {active === theme.name && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Active</span>}
          </div>
        ))}
      </div>

      {imported.length > 0 && (
        <>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Imported themes</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {imported.map(theme => (
              <div key={theme.name} onClick={() => selectImported(theme.css, theme.name)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, border: `1px solid ${active === theme.name ? 'var(--text-primary)' : 'var(--border)'}`, cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: 13 }}>{theme.name}</span>
                {active === theme.name && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Active</span>}
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
        <button onClick={importCSS} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          + Import CSS theme
        </button>
        <button onClick={applyToAll} disabled={!pendingCSS} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: pendingCSS ? 'var(--text-primary)' : 'var(--border)', color: pendingCSS ? 'var(--bg-primary)' : 'var(--text-muted)', fontSize: 13, cursor: pendingCSS ? 'pointer' : 'default', fontFamily: 'inherit' }}>
          OK
        </button>
        <span style={{ fontSize: 12, color: '#940000', visibility: saved ? 'visible' : 'hidden' }}>
          Restart to update appearance!
        </span>
      </div>
    </div>
  )
}
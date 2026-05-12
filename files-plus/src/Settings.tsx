import { useState } from 'react'

const sections = ['General', 'Appearance', 'Storage', 'About']

export default function Settings() {
  const [active, setActive] = useState('General')

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div style={{ width: 160, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px 12px' }}>Settings</div>
        {sections.map(s => (
          <div key={s} onClick={() => setActive(s)} style={{ padding: '7px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: active === s ? 500 : 400, background: active === s ? 'var(--bg-primary)' : 'transparent', color: active === s ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            {s}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: 24 }}>
        {active === 'General' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>General</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>General settings coming soon.</p>
          </div>
        )}
        {active === 'Appearance' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>Appearance</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Appearance settings coming soon.</p>
          </div>
        )}
        {active === 'Storage' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>Storage</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Storage settings coming soon.</p>
          </div>
        )}
        {active === 'About' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>About</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Files+ — a file manager built with Electron + React.</p>
          </div>
        )}
      </div>
    </div>
  )
}
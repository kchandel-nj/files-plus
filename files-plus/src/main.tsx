import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import General from './settings/General.tsx'
import Appearance from './settings/Appearance.tsx'
import Storage from './settings/Storage.tsx'
import About from './settings/About.tsx'
import './index.css'
import { loadSavedTheme, listenForTheme } from './utils/theme'

loadSavedTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/settings/general" element={<General />} />
        <Route path="/settings/appearance" element={<Appearance />} />
        <Route path="/settings/storage" element={<Storage />} />
        <Route path="/settings/about" element={<About />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)

window.addEventListener('DOMContentLoaded', () => {
  listenForTheme()
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
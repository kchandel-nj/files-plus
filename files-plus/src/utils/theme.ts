export function applyTheme(cssText: string) {
  let styleEl = document.getElementById('app-theme') as HTMLStyleElement
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'app-theme'
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = cssText
}

export function saveTheme(cssText: string) {
  localStorage.setItem('app-theme', cssText)
}

export function loadSavedTheme() {
  const saved = localStorage.getItem('app-theme')
  if (saved) applyTheme(saved)
}

export function listenForTheme() {
  if (!window.ipcRenderer) {
    console.warn('ipcRenderer not available — skipping theme listener')
    return
  }
  window.ipcRenderer.on('apply-theme', (_event: any, css: string) => {
    applyTheme(css)
  })
}
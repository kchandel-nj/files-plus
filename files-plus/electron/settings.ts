import { BrowserWindow } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { VITE_DEV_SERVER_URL, RENDERER_DIST } from './main'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const settingsWindows: Record<string, BrowserWindow> = {}

export function openSettingsWindow(section: string) {
  if (settingsWindows[section]) {
    settingsWindows[section].focus()
    return
  }

  const win = new BrowserWindow({
    width: 600,
    height: 450,
    resizable: false,
    minimizable: false,
    maximizable: false,
    title: section.charAt(0).toUpperCase() + section.slice(1),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(`${VITE_DEV_SERVER_URL}#settings/${section}`)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'), { hash: `settings/${section}` })
  }

  settingsWindows[section] = win

  win.on('closed', () => {
    delete settingsWindows[section]
  })
}
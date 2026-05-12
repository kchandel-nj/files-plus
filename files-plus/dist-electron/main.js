import { BrowserWindow, Menu, app, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const settingsWindows = {};
function openSettingsWindow(section) {
  if (settingsWindows[section]) {
    settingsWindows[section].focus();
    return;
  }
  const win2 = new BrowserWindow({
    width: 600,
    height: 450,
    resizable: false,
    minimizable: false,
    maximizable: false,
    title: section.charAt(0).toUpperCase() + section.slice(1),
    webPreferences: {
      preload: path.join(path.dirname(new URL(import.meta.url).pathname), "preload.mjs")
    }
  });
  if (VITE_DEV_SERVER_URL) {
    win2.loadURL(`${VITE_DEV_SERVER_URL}#settings/${section}`);
  } else {
    win2.loadFile(path.join(RENDERER_DIST, "index.html"), { hash: `settings/${section}` });
  }
  settingsWindows[section] = win2;
  win2.on("closed", () => {
    delete settingsWindows[section];
  });
}
createRequire(import.meta.url);
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    title: "Files+",
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.on("closed", () => {
    BrowserWindow.getAllWindows().forEach((w) => w.close());
    win = null;
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
const menu = Menu.buildFromTemplate([
  {
    label: "File",
    submenu: [{ role: "quit" }]
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" }
    ]
  },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "togglefullscreen" }
    ]
  },
  {
    label: "Window",
    submenu: [{ role: "minimize" }, { role: "close" }]
  },
  {
    label: "Settings",
    submenu: [
      { label: "General", click: () => openSettingsWindow("general") },
      { label: "Appearance", click: () => openSettingsWindow("appearance") },
      { label: "Storage", click: () => openSettingsWindow("storage") },
      { label: "About", click: () => openSettingsWindow("about") }
    ]
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = await import("electron");
          shell.openExternal("https://electronjs.org");
        }
      }
    ]
  }
]);
Menu.setApplicationMenu(menu);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.on("apply-theme", (_event, css) => {
  BrowserWindow.getAllWindows().forEach((win2) => {
    win2.webContents.send("apply-theme", css);
  });
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};

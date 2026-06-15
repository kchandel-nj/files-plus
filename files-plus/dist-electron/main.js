import { BrowserWindow, Menu, app, ipcMain, dialog } from "electron";
import { statfs } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname$2 = path.dirname(fileURLToPath(import.meta.url));
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
    autoHideMenuBar: true,
    title: section.charAt(0).toUpperCase() + section.slice(1),
    icon: path.join(process.env.VITE_PUBLIC, "fpicon.png"),
    webPreferences: {
      preload: path.join(__dirname$2, "preload.mjs")
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
    icon: path.join(process.env.VITE_PUBLIC, "fpicon.png"),
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
    submenu: [
      { label: "Import", accelerator: "CmdOrCtrl+I", click: () => {
      } },
      { type: "separator" },
      { role: "quit" }
    ]
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
    submenu: [
      { role: "minimize", accelerator: "CmdOrCtrl+M" },
      {
        label: "Toggle Maximize",
        accelerator: "F11",
        click: () => {
          const win2 = BrowserWindow.getFocusedWindow();
          if (win2) win2.isMaximized() ? win2.unmaximize() : win2.maximize();
        }
      },
      { role: "close", accelerator: "CmdOrCtrl+W" }
    ]
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
        label: "How to Use",
        click: async () => {
          const { shell } = await import("electron");
          shell.openExternal("https://github.com/kchandel-nj/files-plus/wiki/Instructions");
        }
      },
      {
        label: "Report a Bug",
        click: async () => {
          const { shell } = await import("electron");
          shell.openExternal("https://github.com/kchandel-nj/files-plus/issues/new");
        }
      },
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
ipcMain.handle("get-disk-usage", async () => {
  console.log("get-disk-usage called");
  try {
    const { bfree, bsize, blocks } = await statfs(app.getPath("home"));
    const total = blocks * bsize;
    const free = bfree * bsize;
    const used = total - free;
    console.log("disk result:", { total, used, free });
    return { total, used, free };
  } catch (e) {
    console.error("get-disk-usage error:", e);
    return null;
  }
});
ipcMain.handle("pick-folder", async () => {
  console.log("pick-folder called");
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"]
  });
  console.log("pick-folder result:", result);
  return result.canceled ? null : result.filePaths[0];
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};

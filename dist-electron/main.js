import { ipcMain, app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
const config = {
  /** Absolute path to the snapshot image file to display. Edit to match your environment. */
  imagePath: "/Users/sigma.l/snapshot.png"
};
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
const IMAGE_MIME_TYPES = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  svg: "image/svg+xml"
};
function expandHome(p) {
  return p.startsWith("~") ? path.join(os.homedir(), p.slice(1)) : p;
}
ipcMain.handle("image:load", async () => {
  const imagePath = expandHome(config.imagePath);
  try {
    await fs.stat(imagePath);
    const buffer = await fs.readFile(imagePath);
    const ext = path.extname(imagePath).slice(1).toLowerCase();
    const mime = IMAGE_MIME_TYPES[ext] ?? "application/octet-stream";
    return {
      exists: true,
      dataUrl: `data:${mime};base64,${buffer.toString("base64")}`
    };
  } catch (err) {
    console.error("[image:load] failed to read", imagePath, err);
    return { exists: false };
  }
});
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs"),
      // Keep the video-only livestream decoding/playing when the window is
      // minimized or unfocused, instead of Chromium auto-pausing it to save power.
      backgroundThrottling: false
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  setTimeout(() => {
    win == null ? void 0 : win.webContents.executeJavaScript(`document.querySelector('.load-image-button').click()`);
  }, 500);
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
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
app.on("before-quit", () => {
});
app.whenReady().then(() => {
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};

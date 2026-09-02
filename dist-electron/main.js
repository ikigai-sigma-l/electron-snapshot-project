import { ipcMain, app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
const config = {
  /** Absolute path to the snapshot image file to display. Edit to match your environment. */
  imagePath: "/Users/sigma.l/snapshot.png",
  /** How often (ms) to check imagePath for existence/updates. */
  imageCheckIntervalMs: 2e3,
  /** FLV/RTC stream URL the Crystal Player loads into the video container. */
  videoStreamUrl: "http://192.168.20.22:8889/idp/view/whep",
  /**
   * Max tolerated latency (sec) before the player's watchdog ends playback.
   * Default is 2s; this pull endpoint's frame timecode routinely lags the
   * local clock by just over that, which was tripping the watchdog and
   * ending playback right after the first frame rendered.
   */
  videoMaxLatencySec: 10
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
ipcMain.handle("image:poll", async () => {
  try {
    const stat = await fs.stat(config.imagePath);
    const buffer = await fs.readFile(config.imagePath);
    const ext = path.extname(config.imagePath).slice(1).toLowerCase();
    const mime = IMAGE_MIME_TYPES[ext] ?? "application/octet-stream";
    return {
      exists: true,
      mtimeMs: stat.mtimeMs,
      dataUrl: `data:${mime};base64,${buffer.toString("base64")}`
    };
  } catch {
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

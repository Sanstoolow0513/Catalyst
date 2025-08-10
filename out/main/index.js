"use strict";
const electron = require("electron");
const path = require("path");
const child_process = require("child_process");
const IPC_EVENTS = {
  MIHOMO_START: "mihomo:start",
  MIHOMO_STOP: "mihomo:stop",
  MIHOMO_STATUS: "mihomo:status"
};
class MihomoService {
  static instance;
  mihomoProcess = null;
  constructor() {
  }
  static getInstance() {
    if (!MihomoService.instance) {
      MihomoService.instance = new MihomoService();
    }
    return MihomoService.instance;
  }
  start() {
    return new Promise((resolve, reject) => {
      if (this.mihomoProcess) {
        console.log("Mihomo is already running.");
        return resolve();
      }
      const mihomoPath = path.join(electron.app.getAppPath(), "..", "resources", "mihomo.exe");
      console.log(`Starting mihomo from: ${mihomoPath}`);
      this.mihomoProcess = child_process.spawn(mihomoPath, [
        // '-d', '/path/to/config/dir' // 根据需要添加 mihomo 的启动参数
      ]);
      this.mihomoProcess.stdout?.on("data", (data) => {
        console.log(`mihomo stdout: ${data}`);
      });
      this.mihomoProcess.stderr?.on("data", (data) => {
        console.error(`mihomo stderr: ${data}`);
      });
      this.mihomoProcess.on("close", (code) => {
        console.log(`Mihomo process exited with code ${code}`);
        this.mihomoProcess = null;
      });
      this.mihomoProcess.on("error", (err) => {
        console.error("Failed to start Mihomo process.", err);
        this.mihomoProcess = null;
        reject(err);
      });
      setTimeout(() => {
        console.log("Mihomo service started.");
        resolve();
      }, 2e3);
    });
  }
  stop() {
    return new Promise((resolve) => {
      if (this.mihomoProcess) {
        this.mihomoProcess.kill();
        this.mihomoProcess = null;
        console.log("Mihomo service stopped.");
      }
      resolve();
    });
  }
  isRunning() {
    return this.mihomoProcess !== null;
  }
}
const mihomoService = MihomoService.getInstance();
function registerMihomoIpcHandlers() {
  electron.ipcMain.handle(IPC_EVENTS.MIHOMO_START, async () => {
    try {
      await mihomoService.start();
      return { success: true };
    } catch (error) {
      console.error("Failed to start Mihomo:", error);
      return { success: false, error: error.message };
    }
  });
  electron.ipcMain.handle(IPC_EVENTS.MIHOMO_STOP, async () => {
    try {
      await mihomoService.stop();
      return { success: true };
    } catch (error) {
      console.error("Failed to stop Mihomo:", error);
      return { success: false, error: error.message };
    }
  });
  electron.ipcMain.handle(IPC_EVENTS.MIHOMO_STATUS, () => {
    return { isRunning: mihomoService.isRunning() };
  });
}
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.loadURL("http://localhost:5173");
}
electron.app.whenReady().then(() => {
  createWindow();
  registerMihomoIpcHandlers();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});

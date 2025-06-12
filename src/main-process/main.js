/* 模块导入 */
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import ClashMS from "./service/clashservice.js";
import { config } from "process";
// parameters:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROXY_SERVER = "127.0.0.1:7890";
const PROXY_OVERRIDE =
  "localhost;127.*;10.*;172.16.*;172.17.*;172.18.*;172.19.*;172.20.*;172.21.*;172.22.*;172.23.*;172.24.*;172.25.*;172.26.*;172.27.*;172.28.*;172.29.*;172.30.*;172.31.*;192.168.*";
const urlFilePath = path.join(__dirname, "service", "url.txt");
const configUpPath = path.join(__dirname, "service");
const clashCorePath = path.join(
  __dirname,
  "service",
  "mihomo-windows-amd64.exe"
);
const options = {
  urlFilePath: urlFilePath,
  configFilePath: configUpPath,
  clashCorePath: clashCorePath,
  PROXY_SERVER: PROXY_SERVER,
  PROXY_OVERRIDE: PROXY_OVERRIDE,
};

/**
 * todos: clashconfig_core_download->load config->mihomo status
 */
const clash = new ClashMS(options);
clash.initialize();
// clash.fetchConfig()

let mainWindow; // 主窗口实例
function createWindow() {
  /* 创建主窗口 */
  mainWindow = new BrowserWindow({
    width: 850, // 窗口宽度
    height: 750, // 窗口高度
    webPreferences: {
      nodeIntegration: true, // 启用Node.js集成
      contextIsolation: false, // 安全警告：真实应用应启用上下文隔离
      devTools: true, // 默认启用开发者工具
    },
  });

  /* 加载渲染器进程HTML文件 */
  mainWindow.loadFile(path.join(__dirname, "../renderer-process/index.html"));

  /* 打开开发者工具 */
  // mainWindow.webContents.openDevTools();

  /* 窗口关闭事件处理 */
  mainWindow.on("closed", () => {
    mainWindow = null; // 清空窗口引用
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", async () => {
  console.log("Application is about to quit. Stopping Clash...");
  if (clashStarted) {
    try {
      await clashManager.stopClash();
      clashStarted = false;
      console.log("Clash stopped due to app quit.");
    } catch (error) {
      console.error("Failed to stop Clash during app quit:", error);
    }
  }
});

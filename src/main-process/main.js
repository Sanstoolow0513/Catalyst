/* 模块导入 */
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
// const { fileURLToPath } = require("url"); // Not needed in CJS
// import { spawn } from "child_process"; // spawn is now used within ClashMS
const ClashMS = require("./service/clashservice.js");


const PROXY_SERVER = "127.0.0.1:7890";
const PROXY_OVERRIDE =
  "localhost;127.*;10.*;172.16.*;172.17.*;172.18.*;172.19.*;172.20.*;172.21.*;172.22.*;172.23.*;172.24.*;172.25.*;172.26.*;172.27.*;172.28.*;172.29.*;172.30.*;172.31.*;192.168.*";
const urlFilePath = path.join(__dirname, "service", "url.txt");
const configBaseDir = path.join(__dirname, "service"); // Renamed configUpPath to configBaseDir
const clashCorePath = path.join(
  __dirname,
  "service",
  "mihomo-windows-amd64.exe" // Assuming Windows executable name
);
const options = {
  urlFilePath: urlFilePath,
  configBaseDir: configBaseDir, // Use the new name
  clashCorePath: clashCorePath,
  PROXY_SERVER: PROXY_SERVER,
  PROXY_OVERRIDE: PROXY_OVERRIDE,
};

const clashService = new ClashMS(options); // Renamed clash to clashService

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

  mainWindow.loadFile(path.join(__dirname, "../renderer-process/index.html"));

  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null; // 清空窗口引用
  });
}

app.whenReady().then(async () => { // Added async
  createWindow();

  ipcMain.on('start-clash', async () => {
    try {
      await clashService.initialize();
      await clashService.startMihomo();
      const proxySetSuccess = await clashService.setSystemProxy();
      if (!proxySetSuccess) {
        mainWindow.webContents.send("clash-error", "系统代理设置失败");
      } else {
        mainWindow.webContents.send("clash-started");
      }
    } catch (error) {
      mainWindow.webContents.send("clash-error", `启动Clash失败: ${error.message}`);
    }
  });

  ipcMain.on('stop-clash', async () => {
    try {
      await clashService.stopMihomo();
      await clashService.clearSystemProxy();
      mainWindow.webContents.send("clash-stopped");
    } catch (error) {
      mainWindow.webContents.send("clash-error", `停止Clash失败: ${error.message}`);
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
});

app.on("before-quit", async (event) => { // Added event parameter
  // Prevent default quit behavior until cleanup is done
  event.preventDefault();

  try {
    // Stop Mihomo process
    await clashService.stopMihomo();

    // Clear system proxy
    await clashService.clearSystemProxy();

    // Now quit the application
    app.quit();

  } catch (error) {
    // Even if cleanup fails, attempt to quit
    app.quit();
  }
});


ipcMain.on("hello-from-renderer",(event, arg)=>{
  event.reply("hello-from-main","渲染进程你好");
})
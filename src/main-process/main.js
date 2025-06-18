/* 模块导入 */
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
// import { spawn } from "child_process"; // spawn is now used within ClashMS
import ClashMS from "./service/clashservice.js";
import { logger } from "./logger.js";

// 设置进程编码为UTF-8解决中文乱码
if (process.platform === "win32") {
  process.env.CHCP = "65001";
}

// parameters:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

  /* 加载渲染器进程HTML文件 */
  mainWindow.loadFile(path.join(__dirname, "../renderer-process/index.html"));

  /* 打开开发者工具 */
  // mainWindow.webContents.openDevTools();

  /* 窗口关闭事件处理 */
  mainWindow.on("closed", () => {
    mainWindow = null; // 清空窗口引用
  });
}

app.whenReady().then(async () => { // Added async
  logger.info("应用程序启动", "main.js");
  createWindow();

  try {
    // Initialize Clash service (downloads core and config)
    await clashService.initialize();
    logger.info("Clash 服务初始化完成", "main.js");

    // Start Mihomo process
    await clashService.startMihomo();
    logger.info("Mihomo 进程已启动", "main.js");

    // Set system proxy
    const proxySetSuccess = await clashService.setSystemProxy();
    if (proxySetSuccess) {
      logger.info("系统代理设置成功", "main.js");
    } else {
      logger.error("系统代理设置失败", "main.js");
    }

    // TODO: Add logic to interact with Clash service (e.g., get proxy list, switch proxy)
    // This might involve IPC communication with the renderer process.

  } catch (error) {
    logger.error(`启动 Clash 服务时发生错误: ${error.message}`, "main.js");
    // Depending on the error, you might want to show an error message to the user
  }


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

app.on("before-quit", async (event) => { // Added event parameter
  logger.info("应用程序即将退出，正在停止Clash服务并清除代理...", "main.js");
  // Prevent default quit behavior until cleanup is done
  event.preventDefault();

  try {
    // Stop Mihomo process
    await clashService.stopMihomo();
    logger.info("Mihomo 进程已停止", "main.js");

    // Clear system proxy
    await clashService.clearSystemProxy();
    logger.info("系统代理已清除", "main.js");

    // Now quit the application
    app.quit();

  } catch (error) {
    logger.error(`退出时停止Clash服务或清除代理出错: ${error.message}`, "main.js");
    // Even if cleanup fails, attempt to quit
    app.quit();
  }
});

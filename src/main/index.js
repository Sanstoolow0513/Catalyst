/* 模块导入 */
const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("path");
const { execFile } = require("child_process");
const fs = require("fs");
const https = require("https");
const os = require("os");
const si = require("systeminformation");

// 导入自定义模块
const { createMainWindow } = require("./window");
const { ConfigManager } = require("./services/config-manager");
const { registerClashIPCHandlers } = require("./ipc-handlers/clash-ipc");
const { registerLLMIPCHandlers } = require("./ipc-handlers/llm-ipc");
const logger = require("./utils/logger");

// 从配置管理器加载应用配置
let appConfig = null;
let clashService = null;

// 实例化服务
let mainWindow;

app.whenReady().then(async () => {
  // 创建主窗口
  mainWindow = createMainWindow();

  try {
    // 加载应用配置
    const configManager = new ConfigManager({
      appDataPath: path.join(__dirname, '../../Appdata'),
      configDir: path.join(__dirname, '../../Appdata/config')
    });
    appConfig = await configManager.loadAppConfig();
    logger.info('应用配置加载成功', { appConfig });

    // 实例化ClashService
    clashService = new (require('./services/clash/clash-service'))({
      configBaseDir: path.join(__dirname, '../../Appdata/config/configs'),
      clashCorePath: path.join(__dirname, '../../core/clash/clash-core.exe'),
      PROXY_SERVER: appConfig.PROXY_SERVER,
      PROXY_OVERRIDE: appConfig.PROXY_OVERRIDE
    }, mainWindow);

    // 初始化ClashService
    await clashService.initialize();
    logger.info('ClashService初始化完成');

    // 注册IPC处理器
    registerClashIPCHandlers(clashService);
    registerLLMIPCHandlers(mainWindow);
    logger.info('IPC处理器注册完成');

  } catch (error) {
    logger.error('应用初始化失败', { error: error.message, stack: error.stack });
    if (mainWindow) {
      mainWindow.webContents.send('app-init-error', error.message);
    }
  }

  // 应用激活事件处理
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
    }
  });
});

// 窗口控制事件处理
ipcMain.on("minimize-window", () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on("maximize-window", () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on("close-window", () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

// 应用退出处理
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", async (event) => {
  if (clashService) {
    try {
      logger.info('正在停止Clash服务...');
      await clashService.stopMihomo();
      await clashService.clearSystemProxy();
    } catch (error) {
      logger.error('退出时清理失败', { error: error.message, stack: error.stack });
    }
  }
  logger.info('清理完成，退出应用');
});

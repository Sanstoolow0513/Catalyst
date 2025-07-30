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
const logger = require("./utils/logger");

// 从配置管理器加载应用配置
let appConfig = null;
let clashService = null;

// 实例化服务
let mainWindow;

app.whenReady().then(async () => {
  mainWindow = createMainWindow();

  try {
    // 加载应用配置
    const configManager = new ConfigManager({
      appDataPath: path.join(__dirname, '../../Appdata'),
      configDir: path.join(__dirname, '../../Appdata/config')
    });
    appConfig = await configManager.loadAppConfig();
    logger.info('应用配置加载成功', { appConfig });

    // 实例化ClashService，它会内部管理Core、Config和Proxy
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
    logger.info('IPC处理器注册完成');

  } catch (error) {
    logger.error('应用初始化失败', { error: error.message, stack: error.stack });
    // 可以选择在此处显示一个错误通知或对话框
    if (mainWindow) {
      mainWindow.webContents.send('app-init-error', error.message);
    }
    // 注意：这里不退出应用，允许用户在部分功能不可用的情况下继续使用
  }

  // 系统信息事件处理
  ipcMain.on("get-system-info", async (event) => {
    try {
      const [cpu, baseboard, mem, osInfo, diskLayout] = await Promise.all([
        si.cpu(),
        si.baseboard(),
        si.mem(),
        si.osInfo(),
        si.diskLayout(),
      ]);

      event.sender.send("system-info-data", {
        cpu,
        baseboard,
        mem,
        osInfo,
        diskLayout,
      });
    } catch (error) {
      console.error("[main.js] Error getting system info:", error);
      event.sender.send("system-info-error", error.message);
    }
  });

  const sendClashStatus = (status, message = "") => {
    if (mainWindow) {
      mainWindow.webContents.send("clash-status-update", { status, message });
    }
  };

  const showNotification = (title, body) => {
    new Notification({ title, body }).show();
  };

  // 旧的IPC事件处理器已被新的handle模式替代，因此可以安全移除
  // 保留系统信息和窗口控制事件

  // 软件安装事件处理
  ipcMain.on("install-software", async (event, software) => {
    const { id, name, url, installer_args } = software;
    const tempDir = path.join(os.tmpdir(), "QMR-Toolkit-Downloads");
    const fileName = path.basename(new URL(url).pathname);
    const filePath = path.join(tempDir, fileName);

    try {
      // 1. 确保临时目录存在
      await fs.promises.mkdir(tempDir, { recursive: true });

      // 2. 下载安装程序
      event.sender.send("installation-status", { id, status: "downloading" });
      console.log(`[main] Downloading ${name} from ${url}...`);

      const fileStream = fs.createWriteStream(filePath);

      // Promise-based download with redirect handling
      await new Promise((resolve, reject) => {
        const request = (downloadUrl) => {
          https
            .get(downloadUrl, (response) => {
              // 处理重定向
              if (
                response.statusCode >= 300 &&
                response.statusCode < 400 &&
                response.headers.location
              ) {
                console.log(
                  `[main] Redirected to ${response.headers.location}`
                );
                // 跟随重定向
                request(response.headers.location);
                return; // 停止处理此响应
              }

              if (response.statusCode !== 200) {
                reject(
                  new Error(
                    `Download failed with status code: ${response.statusCode}`
                  )
                );
                return;
              }

              response.pipe(fileStream);
              fileStream.on("finish", () => {
                fileStream.close(resolve);
              });
            })
            .on("error", (err) => {
              fs.unlink(filePath, () => {}); // 清理损坏的文件
              reject(err);
            });
        };
        request(url); // 初始请求
      });

      console.log(`[main] Downloaded ${name} to ${filePath}`);

      // 3. 运行安装程序
      event.sender.send("installation-status", { id, status: "installing" });
      console.log(`[main] Installing ${name} with args: ${installer_args}`);

      await new Promise((resolve, reject) => {
        // 使用shell: true以获得更好的兼容性
        execFile(
          filePath,
          installer_args ? installer_args.split(" ") : [],
          { shell: true },
          (error, stdout, stderr) => {
            if (error) {
              if (stderr) {
                console.warn(
                  `[main] Installation for ${name} produced stderr: ${stderr}`
                );
              }
              return reject(error);
            }
            console.log(`[main] Installation stdout: ${stdout}`);
            resolve();
          }
        );
      });

      event.sender.send("installation-status", { id, status: "success" });
      console.log(`[main] Successfully installed ${name}`);
    } catch (error) {
      console.error(`[main] Error installing ${name}:`, error);
      event.sender.send("installation-status", {
        id,
        status: "error",
        message: error.message,
      });
    }
  });

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

let isQuitting = false;

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", async (event) => {
  if (isQuitting) {
    return;
  }
  isQuitting = true;
  event.preventDefault(); // 阻止应用立即退出

  logger.info('before-quit: 开始清理...');

  try {
    if (clashService) {
      logger.info('正在停止Clash服务...');
      await clashService.stopMihomo();
      await clashService.clearSystemProxy();
    }
  } catch (error) {
    logger.error('退出时清理失败', { error: error.message, stack: error.stack });
  } finally {
    logger.info('清理完成，强制退出。');
    // 清理完成后，绕过事件监听器强制退出
    app.exit();
  }
});

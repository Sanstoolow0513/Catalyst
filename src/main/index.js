/* 模块导入 */
const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("path");
const { execFile } = require("child_process");
const fs = require("fs");
const https = require("https");
const os = require("os");
const si = require("systeminformation");
const axios = require("axios");

// 导入自定义模块
const { createMainWindow } = require("./window");
const ClashCoreService = require("./services/clash/clash-core-service");
const ClashConfigService = require("./services/clash/clash-config-service");
const ProxyService = require("./services/clash/proxy-service");
const { PROXY_SERVER, PROXY_OVERRIDE } = require("../shared/config/app-config");

// Clash服务配置
const clashCoreServiceConfig = {
  clashCorePath: path.join(
    __dirname,
    "../../resources/clash/core/mihomo-windows-amd64.exe"
  ),
};

const clashConfigServiceConfig = {
  configBaseDir: path.join(__dirname, "../../resources/clash/configs"),
  configDir: path.join(__dirname, "../Appdata"),
};

const proxyServiceConfig = {
  PROXY_SERVER,
  PROXY_OVERRIDE,
};

// 实例化服务
let clashCoreService;
let clashConfigService;
let proxyService;
let mainWindow;

app.whenReady().then(async () => {
  mainWindow = createMainWindow();

  // 在主窗口创建后实例化服务
  clashCoreService = new ClashCoreService(clashCoreServiceConfig);
  clashConfigService = new ClashConfigService(clashConfigServiceConfig);
  proxyService = new ProxyService(proxyServiceConfig);

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

  // Clash，config相关事件处理
  ipcMain.on("start-clash", async () => {
    try {
      sendClashStatus("starting");
      await clashCoreService.checkAndDownloadCore();
      await clashConfigService.downloadConfigFromUrl();
      const configPath = clashConfigService.getCurrentConfigPath();
      await clashCoreService.startMihomo(configPath);
      const proxySetSuccess = await proxyService.setSystemProxy();
      if (!proxySetSuccess) {
        sendClashStatus("error", "系统代理设置失败");
        showNotification("Clash 错误", "设置系统代理失败。");
      } else {
        sendClashStatus("running");
        showNotification("Clash 已启动", "代理服务已成功启动并设置系统代理。");
      }
    } catch (error) {
      const errorMessage = `启动Clash失败: ${error.message}`;
      sendClashStatus("error", errorMessage);
      showNotification("Clash 错误", errorMessage);
    }
  });

  ipcMain.on("stop-clash", async () => {
    try {
      sendClashStatus("stopping");
      await clashCoreService.stopMihomo();
      await proxyService.clearSystemProxy();
      sendClashStatus("stopped");
      showNotification("Clash 已停止", "代理服务已安全停止。");
    } catch (error) {
      const errorMessage = `停止Clash失败: ${error.message}`;
      sendClashStatus("error", errorMessage);
      showNotification("Clash 错误", errorMessage);
    }
  });

  ipcMain.on("get-proxy-list", async (event) => {
    try {
      if (!clashCoreService || !clashConfigService) {
        throw new Error("Clash services not initialized.");
      }
      
      // 确保配置已加载
      const configPath = clashConfigService.getCurrentConfigPath();
      if (!configPath) {
        await clashConfigService.downloadConfigFromUrl();
      }
      
      const config = await clashConfigService.loadConfig(clashConfigService.getCurrentConfigPath());
      const proxyGroups = config["proxy-groups"];
      
      if (!proxyGroups || !Array.isArray(proxyGroups)) {
        event.sender.send("proxy-list-update", []);
        return;
      }

      const result = proxyGroups
        .filter((group) => group.type === "select" || group.type === "selector")
        .map((group) => ({
          name: group.name,
          type: group.type,
          current: group.proxies ? group.proxies[0] || "" : "",
          options: group.proxies || [],
        }));

      // 如果Clash正在运行，尝试获取实时代理信息
      // 这里需要获取外部控制器地址
      const externalController = config["external-controller"];
      if (clashCoreService.clashProcess && externalController) {
        try {
          const url = `http://${externalController}/proxies`;
          const response = await axios.get(url, { timeout: 2000 });
          const liveProxies = response.data.proxies;

          for (const group of result) {
            if (liveProxies[group.name] && liveProxies[group.name].now) {
              group.current = liveProxies[group.name].now;
            }
          }
        } catch (e) {
          console.error("获取实时代理信息失败:", e);
        }
      }

      event.sender.send("proxy-list-update", result);
    } catch (error) {
      console.error(`[main.js] 获取代理列表失败: ${error.message}`);
      // 将错误发送到前端，以便在UI上显示
      mainWindow.webContents.send(
        "clash-service-error",
        `获取节点列表失败: ${error.message}`
      );
    }
  });

  // 代理切换事件处理
  ipcMain.on("switch-proxy", async (event, { groupName, proxyName }) => {
    try {
      if (!clashCoreService || !clashConfigService) {
        throw new Error("Clash services not initialized.");
      }
      
      // 确保配置已加载
      const configPath = clashConfigService.getCurrentConfigPath();
      if (!configPath) {
        throw new Error("配置未加载");
      }
      
      const config = await clashConfigService.loadConfig(configPath);
      const externalController = config["external-controller"];
      
      if (!externalController) {
        throw new Error("未配置外部控制器地址");
      }

      const url = `http://${externalController}/proxies/${encodeURIComponent(groupName)}`;
      await axios.put(url, { name: proxyName });
      
      // 发送成功消息
      event.sender.send("proxy-switched", { groupName, proxyName });
    } catch (error) {
      console.error(`[main.js] 切换代理失败: ${error.message}`);
      event.sender.send("proxy-switch-error", error.message);
    }
  });

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

  console.log("[main.js] before-quit: 开始清理...");

  try {
    if (clashCoreService) {
      console.log("[main.js] 正在停止Clash服务...");
      await clashCoreService.stopMihomo();
    }
    
    if (proxyService) {
      console.log("[main.js] 正在清除系统代理...");
      await proxyService.clearSystemProxy();
    }
  } catch (error) {
    console.error("[main.js] 退出时清理失败:", error);
  } finally {
    console.log("[main.js] 清理完成，强制退出。");
    // 清理完成后，绕过事件监听器强制退出
    app.exit();
  }
});

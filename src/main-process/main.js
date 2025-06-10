/* 模块导入 */
import { app, BrowserWindow, ipcMain, dialog, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import ConfigManager from './managers/ConfigManager.js';
import ClashService from './services/ClashService.js';

// 初始化配置管理器
const configManager = new ConfigManager();

// 初始化服务
const clashService = new ClashService({
  proxyServer: configManager.get('proxy.server'),
  proxyOverride: configManager.get('proxy.override')
});

// 文件路径处理
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* 全局状态 */
let mainWindow; // 主窗口实例
let clashStarted = false; // Clash运行状态标志

function createWindow() {
  /* 创建主窗口 */
  mainWindow = new BrowserWindow({
    width: 850,  // 窗口宽度
    height: 750, // 窗口高度
    webPreferences: {
      nodeIntegration: true, // 启用Node.js集成
      contextIsolation: false, // 安全警告：真实应用应启用上下文隔离
      devTools: true, // 默认启用开发者工具
    },
  });

  /* 加载渲染器进程HTML文件 */
  mainWindow.loadFile(path.join(__dirname, '../renderer-process/index.html'));

  /* 打开开发者工具 */
  mainWindow.webContents.openDevTools(); // 可通过菜单手动打开

  /* 窗口关闭事件处理 */
  mainWindow.on("closed", () => {
    mainWindow = null; // 清空窗口引用
  });

  // 注释掉的自动启动Clash功能
  // try {
  //   startClash(); // 启动Clash代理
  //   clashStarted = true;
  //   mainWindow.webContents.send('clash-status-changed', clashStarted);
  //   mainWindow.webContents.send('clash-message', 'Clash 已在启动时自动启动');
  // } catch (error) {
  //   console.error('启动时启动Clash失败:', error);
  //   mainWindow.webContents.send('clash-message', `启动 Clash 失败: ${error.message}`);
  // }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// IPC handler to start Clas=、

/* IPC处理：启动Clash代理 */
ipcMain.on("start-clash", async (event) => {
    if (!clashStarted) {
        try {
            // 获取可用URL
            const urls = await clashService.getAvailableUrls();
            if (urls.length === 0) {
                throw new Error("没有可用的配置文件URL");
            }
            
            // 使用第一个URL启动Clash
            const result = await clashService.startClash(urls[0]);
            if (result.success) {
                clashStarted = true;
                console.log("Clash process started.");
                event.reply("clash-status-changed", clashStarted);
                mainWindow.webContents.send("clash-message", "Clash 已启动");
            } else {
                clashStarted = false;
                event.reply("clash-status-changed", clashStarted);
                mainWindow.webContents.send(
                    "clash-message",
                    `启动 Clash 失败: ${result.message}`
                );
            }
        } catch (error) {
            console.error("启动Clash失败:", error);
            clashStarted = false;
            event.reply("clash-status-changed", clashStarted);
            mainWindow.webContents.send(
                "clash-message",
                `启动 Clash 失败: ${error.message}`
            );
        }
    } else {
        mainWindow.webContents.send("clash-message", "Clash 未运行");
    }
});

// IPC处理：停止Clash代理
ipcMain.on("stop-clash", async (event) => {
    if (clashStarted) {
        try {
            const result = await clashService.stopClash();
            if (result.success) {
                clashStarted = false;
                console.log("Clash process stopped.");
                event.reply("clash-status-changed", clashStarted);
                mainWindow.webContents.send("clash-message", "Clash 已停止");
            } else {
                event.reply("clash-status-changed", clashStarted);
                mainWindow.webContents.send(
                    "clash-message",
                    `停止 Clash 失败: ${result.message}`
                );
            }
        } catch (error) {
            console.error("Failed to stop Clash:", error);
            event.reply("clash-status-changed", clashStarted);
            mainWindow.webContents.send(
                "clash-message",
                `停止 Clash 失败: ${error.message}`
            );
        }
    } else {
        mainWindow.webContents.send("clash-message", "Clash 未运行");
    }
});

// IPC handler to get current Clash status
ipcMain.on("get-clash-status", (event) => {
  event.reply("clash-status-changed", clashStarted);
});

// 新增：获取可用URL列表
ipcMain.handle('get-available-urls', async () => {
  return clashService.getAvailableUrls();
});

// 新增：获取节点列表
ipcMain.handle('get-node-list', async () => {
  return clashService.getNodeList();
});

// 新增：测试节点延迟
ipcMain.handle('test-node-latency', async (event, nodeName) => {
  return clashService.testNodeLatency(nodeName);
});

// 新增：切换节点
ipcMain.handle('switch-node', async (event, nodeName) => {
  return clashService.switchNode(nodeName);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("download-files", (event, filesToDownload) => {
  if (!filesToDownload || filesToDownload.length === 0) {
    return;
  }

  // Ask for download directory once for all files in this batch
  const downloadDirectory = dialog.showSaveDialogSync(mainWindow, {
    title: "选择下载文件夹",
    defaultPath: app.getPath("downloads"),
    properties: ["openDirectory", "createDirectory"],
  });

  if (!downloadDirectory) {
    console.log("用户取消了下载位置选择。");
    filesToDownload.forEach((file) => {
      event.sender.send("download-error", {
        id: file.id,
        name: file.name,
        error: "用户取消选择下载位置",
      });
    });
    return;
  }

  filesToDownload.forEach((file) => {
    const filePath = path.join(downloadDirectory, file.name);
    const fileStream = fs.createWriteStream(filePath);
    const protocol = file.url.startsWith("https") ? https : http;

    console.log(`开始下载: ${file.name} 从 ${file.url} 到 ${filePath}`);

    const request = protocol
      .get(file.url, (response) => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          const errorMsg = `服务器错误 ${response.statusCode}`;
          console.error(`下载 ${file.name} 失败: ${errorMsg}`);
          event.sender.send("download-error", {
            id: file.id,
            name: file.name,
            error: errorMsg,
          });
          fs.unlink(filePath, (err) => {
            if (err) console.error("清理失败文件时出错:", err);
          });
          return;
        }

        const totalBytes = parseInt(response.headers["content-length"], 10);
        let downloadedBytes = 0;

        response.on("data", (chunk) => {
          downloadedBytes += chunk.length;
          if (totalBytes) {
            const progress = (downloadedBytes / totalBytes) * 100;
            event.sender.send("download-progress", {
              id: file.id,
              name: file.name,
              progress,
            });
          }
        });

        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close(() => {
            console.log(`${file.name} 下载完成.`);
            event.sender.send("download-complete", {
              id: file.id,
              name: file.name,
              localPath: filePath,
            });
          });
        });

        fileStream.on("error", (err) => {
          // Handle stream write errors
          console.error(`写入文件 ${file.name} 时发生错误:`, err.message);
          event.sender.send("download-error", {
            id: file.id,
            name: file.name,
            error: "文件写入错误",
          });
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error("清理失败文件时出错:", unlinkErr);
          });
        });
      })
      .on("error", (err) => {
        console.error(`下载 ${file.name} 时发生网络错误:`, err.message);
        event.sender.send("download-error", {
          id: file.id,
          name: file.name,
          error: "网络错误",
        });
        // Attempt to clean up partially downloaded file if it exists
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error("清理失败文件时出错:", unlinkErr);
          });
        }
      });

    request.setTimeout(60000, () => {
      // 60 seconds timeout
      request.destroy(new Error("Download timed out")); // Destroy with an error to trigger 'error' event
    });
  });
});

// Theme handling (optional, but good for modern apps)
ipcMain.handle("dark-mode:toggle", () => {
  const newTheme = nativeTheme.themeSource === "dark" ? "light" : "dark";
  nativeTheme.themeSource = newTheme;
  return newTheme;
});

ipcMain.handle("dark-mode:system", () => {
  nativeTheme.themeSource = "system";
});

/* IPC处理：开发工具安装 */
ipcMain.on("install-dev-tool", (event, tool) => {
  try {
    // 伪代码：实际安装逻辑需要实现
    let installCommand;
    // 工具类型判断
    switch(tool) {
      case 'vc':
        installCommand = '安装Visual C++运行库的命令'; // Windows运行库安装
        break;
      case 'node':
        installCommand = '安装Node.js的命令'; // Node.js运行环境安装
        break;
      case 'jdk':
        installCommand = '安装Java JDK的命令'; // Java开发工具包安装
        break;
      default:
        // 未知工具抛出异常
        throw new Error(`未知的开发工具: ${tool}`);
    }
    
    // 执行安装命令（当前为模拟）
    const result = '安装成功'; // 实际应执行命令并获取真实结果
    
    // 发送安装状态给渲染进程
    event.sender.send("install-status", {
      type: 'tool', // 工具类型
      name: tool, // 工具名称
      status: 'success', // 安装状态
      message: result // 安装结果信息
    });
  } catch (error) {
    // 错误处理
    event.sender.send("install-status", {
      type: 'tool',
      name: tool,
      status: 'error',
      message: error.message
    });
  }
});

// IDE安装处理
ipcMain.on("install-ide", (event, ide) => {
  try {
    // 伪代码：实际安装逻辑
    let installCommand;
    switch(ide) {
      case 'vscode':
        installCommand = '安装VSCode的命令';
        break;
      case 'clion':
        installCommand = '安装CLion的命令';
        break;
      case 'vs':
        installCommand = '安装Visual Studio的命令';
        break;
      default:
        throw new Error(`未知的IDE: ${ide}`);
    }
    
    // 执行安装命令
    const result = '安装成功'; // 实际应执行命令并检查结果
    
    event.sender.send("install-status", {
      type: 'ide',
      name: ide,
      status: 'success',
      message: result
    });
  } catch (error) {
    event.sender.send("install-status", {
      type: 'ide',
      name: ide,
      status: 'error',
      message: error.message
    });
  }
});

/* IPC处理：获取系统信息 */
ipcMain.handle("get-system-info", async () => {
  return {
    os: process.platform, // 操作系统类型
    platform: process.arch, // 系统架构
    cpu: 'Intel Core i7', // CPU型号（模拟数据）
    cores: 8, // CPU核心数（模拟数据）
    gpu: 'NVIDIA GeForce RTX 3080', // GPU型号（模拟数据）
    totalMem: 32 // 总内存（模拟数据）
  };
});

// 资源使用情况获取
ipcMain.handle("get-resource-usage", async () => {
  return {
    cpu: Math.floor(Math.random() * 100),
    mem: Math.floor(Math.random() * 100),
    gpu: Math.floor(Math.random() * 100)
  };
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

app.on("ready", () => {
  // Send initial theme to renderer
  if (mainWindow) {
    mainWindow.webContents.send(
      "theme-updated",
      nativeTheme.shouldUseDarkColors ? "dark" : "light"
    );
  }
  nativeTheme.on("updated", () => {
    if (mainWindow) {
      mainWindow.webContents.send(
        "theme-updated",
        nativeTheme.shouldUseDarkColors ? "dark" : "light"
      );
    }
  });
});

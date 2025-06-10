/* 模块导入 */
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

// parameters:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clash_initPath = path.join(__dirname, "clash", "clash_init.js");

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
  mainWindow.webContents.openDevTools(); // 可通过菜单手动打开

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

// IPC handler to start Clas=、
/**
 * ! clash-message: 用于发送Clash相关消息到渲染进程
 * ! clash-error: 用于发送Clash相关错误到渲染进程
 */
ipcMain.on("start-clash", async (event) => {
  const clashProcess = spawn("node", [clash_initPath]);
  // clashProcess.stdout.on("data", (data) => {
  //   event.sender.send("clash-message", data.toString());
  // });
  // clashProcess.stderr.on("data", (data) => {
  //   event.sender.send("clash-error", `error: ${data.toString()}`);
  // });
  // // 监听进程关闭事件
  // clashProcess.on("close", (code) => {
  //   event.sender.send("clash-log", `Clash 初始化进程已退出，退出码: ${code}`);
  // });
  clashProcess.stdout.on("data", (data) => {
    mainWindow.webContents.send("clash-message", data.toString());
  });
  clashProcess.stderr.on("data", (data) => {
    mainWindow.webContents.send("clash-error", `error: ${data.toString()}`);
  });
  clashProcess.on("close", (code) => {
    mainWindow.webContents.send(
      "clash-log",
      `Clash 初始化进程已退出，退出码: ${code}`
    );
  });
});

// IPC处理：停止Clash代理
ipcMain.on("stop-clash", async (event) => {});

// 新增：获取可用URL列表
ipcMain.handle("get-available-urls", async () => {
  return clashService.getAvailableUrls();
});

// 新增：获取节点列表
ipcMain.handle("get-node-list", async () => {
  return clashService.getNodeList();
});

// 新增：测试节点延迟
ipcMain.handle("test-node-latency", async (event, nodeName) => {
  return clashService.testNodeLatency(nodeName);
});

// 新增：切换节点
ipcMain.handle("switch-node", async (event, nodeName) => {
  return clashService.switchNode(nodeName);
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

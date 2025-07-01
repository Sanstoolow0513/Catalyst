const { BrowserWindow } = require('electron');
const path = require('path');

/**
 * 创建主窗口
 */
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 850,
    height: 750,
    frame: false, // 创建无边框窗口
    titleBarStyle: 'hidden', // 在macOS上隐藏标题栏但保留红绿灯
    webPreferences: {
      nodeIntegration: true, // 启用Node.js集成
      contextIsolation: false, // 安全警告：真实应用应启用上下文隔离
      webviewTag: true, // 启用 webview 标签
      devTools: true, // 启用开发者工具
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // 开发环境下自动打开开发者工具
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
  
  return mainWindow;
}

module.exports = { createMainWindow }; 
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { registerMihomoIpcHandlers } from './ipc-handlers/mihomo-ipc'
import { registerLlmIpcHandlers } from './ipc-handlers/llm-ipc'
import { registerDevEnvironmentIpcHandlers } from './ipc-handlers/dev-environment-ipc'
import { registerConfigIpcHandlers } from './ipc-handlers/config-ipc'
import { IPC_EVENTS } from '../shared/ipc-events'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  const mainScreen = require('electron').screen.getPrimaryDisplay()
  const dimensions = mainScreen.workAreaSize

  mainWindow = new BrowserWindow({
    width: dimensions.width,
    height: dimensions.height,
    frame: false, // 禁用默认标题栏
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.cjs'), // 修正为正确的 preload 文件名
      contextIsolation: true,
    },
  })

  // Vite dev server URL
  mainWindow.loadURL('http://localhost:5173')
  
  // 默认打开开发者工具
  mainWindow.webContents.openDevTools()
  
  // 注册窗口控制IPC处理器
  ipcMain.on(IPC_EVENTS.WINDOW_MINIMIZE, () => {
    console.log('Received WINDOW_MINIMIZE event');
    if (mainWindow) {
      console.log('Minimizing window');
      mainWindow.minimize();
    } else {
      console.error('Main window is null, cannot minimize');
    }
  })

  ipcMain.on(IPC_EVENTS.WINDOW_MAXIMIZE, () => {
    console.log('Received WINDOW_MAXIMIZE event');
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        console.log('Unmaximizing window');
        mainWindow.unmaximize();
      } else {
        console.log('Maximizing window');
        mainWindow.maximize();
      }
    } else {
      console.error('Main window is null, cannot maximize/unmaximize');
    }
  })

  ipcMain.on(IPC_EVENTS.WINDOW_CLOSE, () => {
    console.log('Received WINDOW_CLOSE event');
    if (mainWindow) {
      console.log('Closing window');
      mainWindow.close();
    } else {
      console.error('Main window is null, cannot close');
    }
  })
}

app.whenReady().then(() => {
  createWindow()

  registerMihomoIpcHandlers()
  registerLlmIpcHandlers()
  registerDevEnvironmentIpcHandlers()
  registerConfigIpcHandlers()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

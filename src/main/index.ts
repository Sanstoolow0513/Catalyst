import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { registerMihomoIpcHandlers } from './ipc-handlers/mihomo-ipc'
import { registerLlmIpcHandlers } from './ipc-handlers/llm-ipc'
import { registerDevEnvironmentIpcHandlers } from './ipc-handlers/dev-environment-ipc'
import { IPC_EVENTS } from '../shared/ipc-events'

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  const mainScreen = require('electron').screen.getPrimaryDisplay();
  const dimensions = mainScreen.workAreaSize;

  mainWindow = new BrowserWindow({
    width: dimensions.width,
    height: dimensions.height,
    frame: false, // 禁用默认标题栏
    webPreferences: {
      preload: process.env.ELECTRON_VITE_PRELOAD,
      sandbox: false
    }
  })

  // Vite dev server URL
  mainWindow.loadURL('http://localhost:5173')
}

app.whenReady().then(() => {
  createWindow()

  registerMihomoIpcHandlers()
  registerLlmIpcHandlers()
  registerDevEnvironmentIpcHandlers()
  
  // 注册窗口控制IPC处理器
  if (mainWindow) {
    ipcMain.on(IPC_EVENTS.WINDOW_MINIMIZE, () => {
      mainWindow?.minimize()
    })
    
    ipcMain.on(IPC_EVENTS.WINDOW_MAXIMIZE, () => {
      if (mainWindow?.isMaximized()) {
        mainWindow.unmaximize()
      } else {
        mainWindow?.maximize()
      }
    })
    
    ipcMain.on(IPC_EVENTS.WINDOW_CLOSE, () => {
      mainWindow?.close()
    })
  }

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { ClashService } from './services/clash-service'
import { WindowManager } from './managers/window-manager'
import { IPCChannels } from '@shared/ipc-channels'

class ElectronApp {
  private mainWindow: BrowserWindow | null = null
  private clashService: ClashService
  private windowManager: WindowManager

  constructor() {
    this.clashService = new ClashService()
    this.windowManager = new WindowManager()
  }

  async initialize() {
    await this.setupElectron()
    this.setupIPC()
    this.setupEventHandlers()
  }

  private async setupElectron() {
    await app.whenReady()
    
    electronApp.setAppUserModelId('com.catalyst.app')
    
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    this.createWindow()
  }

  private createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      show: false,
      autoHideMenuBar: true,
      titleBarStyle: 'hiddenInset',
      trafficLightPosition: { x: 15, y: 15 },
      webPreferences: {
        preload: join(__dirname, '../preload/preload.js'),
        sandbox: false,
        contextIsolation: true,
        nodeIntegration: false
      }
    })

    this.mainWindow.on('ready-to-show', () => {
      this.mainWindow?.show()
    })

    this.mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
  }

  private setupIPC() {
    // Clash服务相关IPC
    ipcMain.handle(IPCChannels.CLASH_START, async () => {
      try {
        return await this.clashService.start()
      } catch (error) {
        throw new Error(`Failed to start Clash: ${error}`)
      }
    })

    ipcMain.handle(IPCChannels.CLASH_STOP, async () => {
      try {
        return await this.clashService.stop()
      } catch (error) {
        throw new Error(`Failed to stop Clash: ${error}`)
      }
    })

    ipcMain.handle(IPCChannels.CLASH_STATUS, async () => {
      return await this.clashService.getStatus()
    })

    ipcMain.handle(IPCChannels.PROXY_LIST, async () => {
      return await this.clashService.getProxyList()
    })

    ipcMain.handle(IPCChannels.PROXY_SWITCH, async (_, groupName: string, proxyName: string) => {
      return await this.clashService.switchProxy(groupName, proxyName)
    })

    // 窗口控制IPC
    ipcMain.handle(IPCChannels.WINDOW_MINIMIZE, () => {
      this.mainWindow?.minimize()
    })

    ipcMain.handle(IPCChannels.WINDOW_MAXIMIZE, () => {
      if (this.mainWindow?.isMaximized()) {
        this.mainWindow.unmaximize()
      } else {
        this.mainWindow?.maximize()
      }
    })

    ipcMain.handle(IPCChannels.WINDOW_CLOSE, () => {
      this.mainWindow?.close()
    })
  }

  private setupEventHandlers() {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow()
      }
    })

    app.on('before-quit', async () => {
      await this.clashService.cleanup()
    })
  }
}

const electronAppInstance = new ElectronApp()
electronAppInstance.initialize().catch(console.error)
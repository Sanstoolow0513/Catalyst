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

  // 根据环境加载不同的URL
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    // 开发环境默认打开开发者工具
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
    // 生产环境也打开开发者工具用于调试
    mainWindow.webContents.openDevTools()
  }
  
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
  
  // 注册测试页面IPC处理器
  ipcMain.handle(IPC_EVENTS.TEST_RUN_INSTALLER, async (event, relativeInstallerPath) => {
    try {
      const { exec } = require('child_process');
      const path = require('path');
      
      // 判断当前是开发环境还是生产环境
      const isDev = !app.isPackaged;

      // 根据环境确定资源目录的根路径
      // 在开发环境中，'resources' 文件夹位于项目根目录
      // 在生产环境中，对于portable应用，使用app.getAppPath()获取应用目录
      let resourcesRoot;
      if (isDev) {
        resourcesRoot = path.join(app.getAppPath(), 'resources');
      } else {
        // 对于portable应用，resources文件夹在应用目录下
        resourcesRoot = path.join(app.getAppPath(), 'resources');
      }
      
      // 将资源根路径和从渲染进程传来的相对路径拼接成最终的绝对路径
      // 注意：在生产环境中，资源文件应该直接放在 resources 目录下，而不是在 app.asar 中
      let absoluteInstallerPath;
      if (isDev) {
        absoluteInstallerPath = path.join(resourcesRoot, relativeInstallerPath);
      } else {
        // 在生产环境中，资源文件被复制到 resources/resources 目录
        absoluteInstallerPath = path.join(process.resourcesPath, 'resources', relativeInstallerPath);
      }
      
      console.log(`[TEST_RUN_INSTALLER] Environment: ${isDev ? 'development' : 'production'}`);
      console.log(`[TEST_RUN_INSTALLER] Resources root: ${resourcesRoot}`);
      console.log(`[TEST_RUN_INSTALLER] Relative path: ${relativeInstallerPath}`);
      console.log(`[TEST_RUN_INSTALLER] Absolute path: ${absoluteInstallerPath}`);
      console.log(`[TEST_RUN_INSTALLER] Process resources path: ${process.resourcesPath}`);
      
      // 检查文件是否存在
      const fs = require('fs');
      if (!fs.existsSync(absoluteInstallerPath)) {
        console.error(`[TEST_RUN_INSTALLER] File not found: ${absoluteInstallerPath}`);
        return { success: false, error: `安装程序文件不存在: ${absoluteInstallerPath}` };
      }
      
      return new Promise((resolve, reject) => {
        exec(`"${absoluteInstallerPath}"`, (error: any, _stdout: string, _stderr: string) => {
          if (error) {
            console.error(`[TEST_RUN_INSTALLER] Exec error:`, error);
            reject(error);
          } else {
            console.log(`[TEST_RUN_INSTALLER] Installation started successfully`);
            resolve({ success: true, message: '安装程序已启动' });
          }
        });
      });
    } catch (err) {
      console.error(`[TEST_RUN_INSTALLER] Error:`, err);
      return { success: false, error: err };
    }
  })

  // 注册 winget 安装处理器
  ipcMain.handle(IPC_EVENTS.TEST_INSTALL_WINGET, async () => {
    try {
      const { exec } = require('child_process');
      const path = require('path');
      const fs = require('fs');
      
      console.log('[TEST_INSTALL_WINGET] Starting winget installation...');
      
      // 判断当前是开发环境还是生产环境
      const isDev = !app.isPackaged;
      
      // 根据环境确定资源目录的根路径
      let resourcesRoot;
      if (isDev) {
        resourcesRoot = path.join(app.getAppPath(), 'resources');
      } else {
        resourcesRoot = path.join(process.resourcesPath, 'resources');
      }
      
      // winget 相关文件路径
      const vclibsPath = path.join(resourcesRoot, 'apps', 'vclib', 'VC_redist.x64.exe');
      const wingetPath = path.join(resourcesRoot, 'apps', 'Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle');
      
      console.log(`[TEST_INSTALL_WINGET] Environment: ${isDev ? 'development' : 'production'}`);
      console.log(`[TEST_INSTALL_WINGET] Resources root: ${resourcesRoot}`);
      console.log(`[TEST_INSTALL_WINGET] VCLibs path: ${vclibsPath}`);
      console.log(`[TEST_INSTALL_WINGET] Winget path: ${wingetPath}`);
      
      // 检查文件是否存在
      if (!fs.existsSync(wingetPath)) {
        console.error(`[TEST_INSTALL_WINGET] Winget file not found: ${wingetPath}`);
        return { success: false, error: `Winget 安装包不存在: ${wingetPath}` };
      }
      
      return new Promise((resolve, reject) => {
        // 使用 PowerShell 以管理员权限安装 winget
        const powershellCommand = `
          try {
            # 检查是否已安装 winget
            $wingetCheck = Get-Command winget -ErrorAction SilentlyContinue
            if ($wingetCheck) {
              Write-Output "Winget 已经安装"
              exit 0
            }
            
            # 直接安装 winget msixbundle
            Add-AppxPackage -Path "${wingetPath.replace(/\\/g, '\\\\')}"
            
            Write-Output "Winget 安装成功"
            exit 0
          }
          catch {
            Write-Error "安装失败: $($_.Exception.Message)"
            exit 1
          }
        `;
        
        exec(`powershell -Command "${powershellCommand.replace(/"/g, '\\"')}"`, { 
          windowsHide: true,
          shell: true
        }, (error: any, stdout: string, _stderr: string) => {
          if (error) {
            console.error('[TEST_INSTALL_WINGET] Installation error:', error);
            reject(error);
          } else {
            console.log('[TEST_INSTALL_WINGET] Installation output:', stdout);
            resolve({ success: true, message: stdout.trim() });
          }
        });
      });
    } catch (err) {
      console.error('[TEST_INSTALL_WINGET] Error:', err);
      return { success: false, error: err };
    }
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/* 模块导入 */
const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const { execFile } = require('child_process');
const fs = require('fs');
const https = require('https');
const os = require('os');
const si = require('systeminformation');

// 导入自定义模块
const { createMainWindow } = require('./window');
const ClashService = require('./services/clash/clash-service');
const { PROXY_SERVER, PROXY_OVERRIDE } = require('../shared/config/app-config');

// Clash服务配置
const clashServiceConfig = {
  configBaseDir: path.join(__dirname, '../../resources/clash/configs'),
  clashCorePath: path.join(__dirname, '../../resources/clash/core/mihomo-windows-amd64.exe'),
  PROXY_SERVER,
  PROXY_OVERRIDE,
};


const ConfigService = require("./services/config-manager");






















// 实例化Clash服务
let clashService; // 声明变量
let mainWindow;

app.whenReady().then(async () => {
  mainWindow = createMainWindow();

  // 在主窗口创建后实例化服务，并传入引用
  clashService = new ClashService(clashServiceConfig, mainWindow);

  // 系统信息事件处理
  ipcMain.on('get-system-info', async (event) => {
    try {
      const [cpu, baseboard, mem, osInfo, diskLayout] = await Promise.all([
        si.cpu(),
        si.baseboard(),
        si.mem(),
        si.osInfo(),
        si.diskLayout(),
      ]);

      event.sender.send('system-info-data', {
        cpu,
        baseboard,
        mem,
        osInfo,
        diskLayout,
      });
    } catch (error) {
      console.error('[main.js] Error getting system info:', error);
      event.sender.send('system-info-error', error.message);
    }
  });

  const sendClashStatus = (status, message = '') => {
    if (mainWindow) {
      mainWindow.webContents.send('clash-status-update', { status, message });
    }
  };

  const showNotification = (title, body) => {
    new Notification({ title, body }).show();
  };

  // Clash相关事件处理
  ipcMain.on('start-clash', async () => {
    try {
      sendClashStatus('starting');
      await clashService.initialize();
      await clashService.startMihomo();
      const proxySetSuccess = await clashService.setSystemProxy();
      if (!proxySetSuccess) {
        sendClashStatus('error', '系统代理设置失败');
        showNotification('Clash 错误', '设置系统代理失败。');
      } else {
        sendClashStatus('running');
        showNotification('Clash 已启动', '代理服务已成功启动并设置系统代理。');
      }
    } catch (error) {
      const errorMessage = `启动Clash失败: ${error.message}`;
      sendClashStatus('error', errorMessage);
      showNotification('Clash 错误', errorMessage);
    }
  });

  ipcMain.on('stop-clash', async () => {
    try {
      sendClashStatus('stopping');
      await clashService.stopMihomo();
      await clashService.clearSystemProxy();
      sendClashStatus('stopped');
      showNotification('Clash 已停止', '代理服务已安全停止。');
    } catch (error) {
      const errorMessage = `停止Clash失败: ${error.message}`;
      sendClashStatus('error', errorMessage);
      showNotification('Clash 错误', errorMessage);
    }
  });

  ipcMain.on('get-proxy-list', async (event) => {
    try {
      if (!clashService) {
        throw new Error('Clash service not initialized.');
      }
      const proxyList = await clashService.getProxyList();
      event.sender.send('proxy-list-update', proxyList);
    } catch (error) {
      console.error(`[main.js] 获取代理列表失败: ${error.message}`);
      // 将错误发送到前端，以便在UI上显示
      mainWindow.webContents.send('clash-service-error', `获取节点列表失败: ${error.message}`);
    }
  });

  // 软件安装事件处理
  ipcMain.on('install-software', async (event, software) => {
    const { id, name, url, installer_args } = software;
    const tempDir = path.join(os.tmpdir(), 'QMR-Toolkit-Downloads');
    const fileName = path.basename(new URL(url).pathname);
    const filePath = path.join(tempDir, fileName);

    try {
      // 1. 确保临时目录存在
      await fs.promises.mkdir(tempDir, { recursive: true });

      // 2. 下载安装程序
      event.sender.send('installation-status', { id, status: 'downloading' });
      console.log(`[main] Downloading ${name} from ${url}...`);

      const fileStream = fs.createWriteStream(filePath);

      // Promise-based download with redirect handling
      await new Promise((resolve, reject) => {
        const request = (downloadUrl) => {
          https.get(downloadUrl, (response) => {
              // 处理重定向
              if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                console.log(`[main] Redirected to ${response.headers.location}`);
                // 跟随重定向
                request(response.headers.location);
                return; // 停止处理此响应
              }

              if (response.statusCode !== 200) {
                reject(new Error(`Download failed with status code: ${response.statusCode}`));
                return;
              }

              response.pipe(fileStream);
              fileStream.on('finish', () => {
                fileStream.close(resolve);
              });
            })
            .on('error', (err) => {
              fs.unlink(filePath, () => {}); // 清理损坏的文件
              reject(err);
            });
        };
        request(url); // 初始请求
      });

      console.log(`[main] Downloaded ${name} to ${filePath}`);

      // 3. 运行安装程序
      event.sender.send('installation-status', { id, status: 'installing' });
      console.log(`[main] Installing ${name} with args: ${installer_args}`);

      await new Promise((resolve, reject) => {
        // 使用shell: true以获得更好的兼容性
        execFile(filePath, installer_args ? installer_args.split(' ') : [], { shell: true }, (error, stdout, stderr) => {
          if (error) {
            if (stderr) {
              console.warn(`[main] Installation for ${name} produced stderr: ${stderr}`);
            }
            return reject(error);
          }
          console.log(`[main] Installation stdout: ${stdout}`);
          resolve();
        });
      });

      event.sender.send('installation-status', { id, status: 'success' });
      console.log(`[main] Successfully installed ${name}`);
    } catch (error) {
      console.error(`[main] Error installing ${name}:`, error);
      event.sender.send('installation-status', { id, status: 'error', message: error.message });
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
    }
  });
});

// 窗口控制事件处理
ipcMain.on('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on('maximize-window', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

let isQuitting = false;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async (event) => {
  if (isQuitting) {
    return;
  }
  isQuitting = true;
  event.preventDefault(); // 阻止应用立即退出

  console.log('[main.js] before-quit: 开始清理...');

  try {
    if (clashService) {
      console.log('[main.js] 正在停止Clash服务...');
      await clashService.stopMihomo();
      
      console.log('[main.js] 正在清除系统代理...');
      await clashService.clearSystemProxy();
    }
  } catch (error) {
    console.error('[main.js] 退出时清理失败:', error);
  } finally {
    console.log('[main.js] 清理完成，强制退出。');
    // 清理完成后，绕过事件监听器强制退出
    app.exit();
  }
}); 
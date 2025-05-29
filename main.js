const { app, BrowserWindow, ipcMain, dialog, nativeTheme } = require('electron');
const { startClash, stopClash } = require('./clash_init'); // Import Clash functions
const fs = require('fs');
const path = require('path');
const https = require('https'); // For HTTPS URLs
const http = require('http');  // For HTTP URLs

let mainWindow;
let clashStarted = false;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 850,
        height: 750,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // In a real app, consider true + preload script for security
            devTools: true // Enable DevTools by default for easier debugging
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.webContents.openDevTools(); // Can be opened manually or via View menu

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Start Clash on app startup (optional)
    // try {
    //   startClash();
    //   clashStarted = true;
    //   mainWindow.webContents.send('clash-status-changed', clashStarted);
    //   mainWindow.webContents.send('clash-message', 'Clash 已在启动时自动启动');
    // } catch (error) {
    //   console.error('Failed to start Clash on startup:', error);
    //   mainWindow.webContents.send('clash-message', `启动 Clash 失败: ${error.message}`);
    // }
}

app.whenReady().then(
    () => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    }
}
);

// IPC handler to start Clash
ipcMain.on('start-clash', (event) => {
  if (!clashStarted) {
    try {
      startClash();
      clashStarted = true;
      console.log('Clash process started.');
      event.reply('clash-status-changed', clashStarted);
      mainWindow.webContents.send('clash-message', 'Clash 已启动');
    } catch (error) {
      console.error('Failed to start Clash:', error);
      clashStarted = false;
      event.reply('clash-status-changed', clashStarted);
      mainWindow.webContents.send('clash-message', `启动 Clash 失败: ${error.message}`);
    }
  } else {
    mainWindow.webContents.send('clash-message', 'Clash 已在运行中');
  }
});

// IPC handler to stop Clash
ipcMain.on('stop-clash', (event) => {
  if (clashStarted) {
    try {
      stopClash();
      clashStarted = false;
      console.log('Clash process stopped.');
      event.reply('clash-status-changed', clashStarted);
      mainWindow.webContents.send('clash-message', 'Clash 已停止');
    } catch (error) {
      console.error('Failed to stop Clash:', error);
      event.reply('clash-status-changed', clashStarted); // Send current status
      mainWindow.webContents.send('clash-message', `停止 Clash 失败: ${error.message}`);
    }
  } else {
    mainWindow.webContents.send('clash-message', 'Clash 未运行');
  }
});

// IPC handler to get current Clash status
ipcMain.on('get-clash-status', (event) => {
  event.reply('clash-status-changed', clashStarted);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('download-files', (event, filesToDownload) => {
    if (!filesToDownload || filesToDownload.length === 0) {
        return;
    }

    // Ask for download directory once for all files in this batch
    const downloadDirectory = dialog.showSaveDialogSync(mainWindow, {
        title: '选择下载文件夹',
        defaultPath: app.getPath('downloads'),
        properties: ['openDirectory', 'createDirectory']
    });

    if (!downloadDirectory) {
        console.log('用户取消了下载位置选择。');
        filesToDownload.forEach(file => {
            event.sender.send('download-error', { id: file.id, name: file.name, error: '用户取消选择下载位置' });
        });
        return;
    }

    filesToDownload.forEach(file => {
        const filePath = path.join(downloadDirectory, file.name);
        const fileStream = fs.createWriteStream(filePath);
        const protocol = file.url.startsWith('https') ? https : http;

        console.log(`开始下载: ${file.name} 从 ${file.url} 到 ${filePath}`);

        const request = protocol.get(file.url, (response) => {
            if (response.statusCode < 200 || response.statusCode >= 300) {
                const errorMsg = `服务器错误 ${response.statusCode}`;
                console.error(`下载 ${file.name} 失败: ${errorMsg}`);
                event.sender.send('download-error', { id: file.id, name: file.name, error: errorMsg });
                fs.unlink(filePath, (err) => { if (err) console.error('清理失败文件时出错:', err); });
                return;
            }

            const totalBytes = parseInt(response.headers['content-length'], 10);
            let downloadedBytes = 0;

            response.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                if (totalBytes) {
                    const progress = (downloadedBytes / totalBytes) * 100;
                    event.sender.send('download-progress', { id: file.id, name: file.name, progress });
                }
            });

            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close(() => {
                    console.log(`${file.name} 下载完成.`);
                    event.sender.send('download-complete', { id: file.id, name: file.name, localPath: filePath });
                });
            });

            fileStream.on('error', (err) => { // Handle stream write errors
                console.error(`写入文件 ${file.name} 时发生错误:`, err.message);
                event.sender.send('download-error', { id: file.id, name: file.name, error: '文件写入错误' });
                fs.unlink(filePath, (unlinkErr) => { if (unlinkErr) console.error('清理失败文件时出错:', unlinkErr); });
            });

        }).on('error', (err) => {
            console.error(`下载 ${file.name} 时发生网络错误:`, err.message);
            event.sender.send('download-error', { id: file.id, name: file.name, error: '网络错误' });
            // Attempt to clean up partially downloaded file if it exists
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (unlinkErr) => { if (unlinkErr) console.error('清理失败文件时出错:', unlinkErr); });
            }
        });

        request.setTimeout(60000, () => { // 60 seconds timeout
            request.destroy(new Error('Download timed out')); // Destroy with an error to trigger 'error' event
        });
    });
});

// Theme handling (optional, but good for modern apps)
ipcMain.handle('dark-mode:toggle', () => {
    const newTheme = nativeTheme.themeSource === 'dark' ? 'light' : 'dark';
    nativeTheme.themeSource = newTheme;
    return newTheme;
});

ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system';
});

app.on('before-quit', () => {
  console.log('Application is about to quit. Stopping Clash...');
  if (clashStarted) {
    try {
      stopClash();
      clashStarted = false;
      console.log('Clash stopped due to app quit.');
    } catch (error) {
      console.error('Failed to stop Clash during app quit:', error);
    }
  }
});

app.on('ready', () => {
    // Send initial theme to renderer
    if (mainWindow) {
        mainWindow.webContents.send('theme-updated', nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
    }
    nativeTheme.on('updated', () => {
        if (mainWindow) {
            mainWindow.webContents.send('theme-updated', nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
        }
    });
});
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import https from 'https';
import os from 'os';

const execPromise = promisify(exec);

class DevEnvironmentService {
  private static instance: DevEnvironmentService;
  private downloadDir: string;

  private constructor() {
    this.downloadDir = path.join(app.getPath('userData'), 'downloads');
    // 确保下载目录存在
    if (!fs.existsSync(this.downloadDir)) {
      fs.mkdirSync(this.downloadDir, { recursive: true });
    }
  }

  public static getInstance(): DevEnvironmentService {
    if (!DevEnvironmentService.instance) {
      DevEnvironmentService.instance = new DevEnvironmentService();
    }
    return DevEnvironmentService.instance;
  }

  /**
   * 下载文件
   */
  private async downloadFile(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest);
      https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (err) => {
        fs.unlink(dest, () => {}); // 删除部分下载的文件
        reject(err);
      });
    });
  }

  /**
   * 安装 Visual Studio Code
   */
  public async installVSCode(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('[DevEnvironmentService] Installing VSCode...');
      
      // 确定平台和下载URL
      let downloadUrl: string;
      let installerPath: string;
      
      if (os.platform() === 'win32') {
        downloadUrl = 'https://code.visualstudio.com/sha/download?build=stable&os=win32-x64';
        installerPath = path.join(this.downloadDir, 'vscode-installer.exe');
      } else if (os.platform() === 'darwin') {
        downloadUrl = 'https://code.visualstudio.com/sha/download?build=stable&os=darwin';
        installerPath = path.join(this.downloadDir, 'vscode-installer.zip');
      } else {
        // Linux
        downloadUrl = 'https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64';
        installerPath = path.join(this.downloadDir, 'vscode-installer.deb');
      }
      
      // 下载安装程序
      console.log(`[DevEnvironmentService] Downloading VSCode from ${downloadUrl}`);
      await this.downloadFile(downloadUrl, installerPath);
      console.log('[DevEnvironmentService] VSCode downloaded successfully');
      
      // 执行安装程序
      if (os.platform() === 'win32') {
        console.log('[DevEnvironmentService] Installing VSCode on Windows');
        const { stdout, stderr } = await execPromise(`"${installerPath}" /S`);
        console.log('[DevEnvironmentService] VSCode installation stdout:', stdout);
        if (stderr) {
          console.error('[DevEnvironmentService] VSCode installation stderr:', stderr);
        }
      } else if (os.platform() === 'darwin') {
        console.log('[DevEnvironmentService] Installing VSCode on macOS');
        // macOS 安装逻辑会更复杂，这里简化处理
        const { stdout, stderr } = await execPromise(`unzip "${installerPath}" -d /Applications`);
        console.log('[DevEnvironmentService] VSCode installation stdout:', stdout);
        if (stderr) {
          console.error('[DevEnvironmentService] VSCode installation stderr:', stderr);
        }
      } else {
        console.log('[DevEnvironmentService] Installing VSCode on Linux');
        const { stdout, stderr } = await execPromise(`sudo dpkg -i "${installerPath}"`);
        console.log('[DevEnvironmentService] VSCode installation stdout:', stdout);
        if (stderr) {
          console.error('[DevEnvironmentService] VSCode installation stderr:', stderr);
        }
      }
      
      // 清理下载的安装程序
      fs.unlinkSync(installerPath);
      
      console.log('[DevEnvironmentService] VSCode installed successfully');
      return { success: true };
    } catch (error) {
      console.error('[DevEnvironmentService] Failed to install VSCode:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * 安装 Node.js
   */
  public async installNodeJS(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('[DevEnvironmentService] Installing Node.js...');
      
      // 确定平台和下载URL
      let downloadUrl: string;
      let installerPath: string;
      
      if (os.platform() === 'win32') {
        downloadUrl = 'https://nodejs.org/dist/latest/node-v20.10.0-win-x64.msi'; // 示例URL，实际应获取最新版本
        installerPath = path.join(this.downloadDir, 'nodejs-installer.msi');
      } else if (os.platform() === 'darwin') {
        downloadUrl = 'https://nodejs.org/dist/latest/node-v20.10.0.pkg'; // 示例URL，实际应获取最新版本
        installerPath = path.join(this.downloadDir, 'nodejs-installer.pkg');
      } else {
        // Linux
        downloadUrl = 'https://nodejs.org/dist/latest/node-v20.10.0-linux-x64.tar.xz'; // 示例URL，实际应获取最新版本
        installerPath = path.join(this.downloadDir, 'nodejs-installer.tar.xz');
      }
      
      // 下载安装程序
      console.log(`[DevEnvironmentService] Downloading Node.js from ${downloadUrl}`);
      await this.downloadFile(downloadUrl, installerPath);
      console.log('[DevEnvironmentService] Node.js downloaded successfully');
      
      // 执行安装程序
      if (os.platform() === 'win32') {
        console.log('[DevEnvironmentService] Installing Node.js on Windows');
        const { stdout, stderr } = await execPromise(`msiexec /i "${installerPath}" /quiet`);
        console.log('[DevEnvironmentService] Node.js installation stdout:', stdout);
        if (stderr) {
          console.error('[DevEnvironmentService] Node.js installation stderr:', stderr);
        }
      } else if (os.platform() === 'darwin') {
        console.log('[DevEnvironmentService] Installing Node.js on macOS');
        const { stdout, stderr } = await execPromise(`sudo installer -pkg "${installerPath}" -target /`);
        console.log('[DevEnvironmentService] Node.js installation stdout:', stdout);
        if (stderr) {
          console.error('[DevEnvironmentService] Node.js installation stderr:', stderr);
        }
      } else {
        console.log('[DevEnvironmentService] Installing Node.js on Linux');
        // Linux 安装逻辑会更复杂，这里简化处理
        const extractDir = path.join(this.downloadDir, 'nodejs');
        const { stdout, stderr } = await execPromise(`tar -xf "${installerPath}" -C ${extractDir}`);
        console.log('[DevEnvironmentService] Node.js extraction stdout:', stdout);
        if (stderr) {
          console.error('[DevEnvironmentService] Node.js extraction stderr:', stderr);
        }
        // 这里需要将 Node.js 添加到 PATH，实际实现会更复杂
      }
      
      // 清理下载的安装程序
      fs.unlinkSync(installerPath);
      
      console.log('[DevEnvironmentService] Node.js installed successfully');
      return { success: true };
    } catch (error) {
      console.error('[DevEnvironmentService] Failed to install Node.js:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * 安装 Python
   */
  public async installPython(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('[DevEnvironmentService] Installing Python...');
      
      // 确定平台和下载URL
      let downloadUrl: string;
      let installerPath: string;
      
      if (os.platform() === 'win32') {
        downloadUrl = 'https://www.python.org/ftp/python/3.12.0/python-3.12.0-amd64.exe'; // 示例URL，实际应获取最新版本
        installerPath = path.join(this.downloadDir, 'python-installer.exe');
      } else if (os.platform() === 'darwin') {
        downloadUrl = 'https://www.python.org/ftp/python/3.12.0/python-3.12.0-macos11.pkg'; // 示例URL，实际应获取最新版本
        installerPath = path.join(this.downloadDir, 'python-installer.pkg');
      } else {
        // Linux - 通常通过包管理器安装
        console.log('[DevEnvironmentService] Installing Python on Linux via package manager');
        const { stdout, stderr } = await execPromise('sudo apt update && sudo apt install -y python3 python3-pip');
        console.log('[DevEnvironmentService] Python installation stdout:', stdout);
        if (stderr) {
          console.error('[DevEnvironmentService] Python installation stderr:', stderr);
        }
        console.log('[DevEnvironmentService] Python installed successfully');
        return { success: true };
      }
      
      // 下载安装程序
      console.log(`[DevEnvironmentService] Downloading Python from ${downloadUrl}`);
      await this.downloadFile(downloadUrl, installerPath);
      console.log('[DevEnvironmentService] Python downloaded successfully');
      
      // 执行安装程序
      if (os.platform() === 'win32') {
        console.log('[DevEnvironmentService] Installing Python on Windows');
        const { stdout, stderr } = await execPromise(`"${installerPath}" /quiet InstallAllUsers=1 PrependPath=1`);
        console.log('[DevEnvironmentService] Python installation stdout:', stdout);
        if (stderr) {
          console.error('[DevEnvironmentService] Python installation stderr:', stderr);
        }
      } else if (os.platform() === 'darwin') {
        console.log('[DevEnvironmentService] Installing Python on macOS');
        const { stdout, stderr } = await execPromise(`sudo installer -pkg "${installerPath}" -target /`);
        console.log('[DevEnvironmentService] Python installation stdout:', stdout);
        if (stderr) {
          console.error('[DevEnvironmentService] Python installation stderr:', stderr);
        }
      }
      
      // 清理下载的安装程序
      fs.unlinkSync(installerPath);
      
      console.log('[DevEnvironmentService] Python installed successfully');
      return { success: true };
    } catch (error) {
      console.error('[DevEnvironmentService] Failed to install Python:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  // 可以添加更多工具的安装方法
}

export const devEnvironmentService = DevEnvironmentService.getInstance();
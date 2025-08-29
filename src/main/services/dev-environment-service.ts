import { app, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import https from 'https';
import os from 'os';
import { createWriteStream, createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import { extract as extractZip } from 'unzipper';
import { extract as extractTar } from 'tar';

const execPromise = promisify(exec);

export interface DownloadTask {
  id: string;
  name: string;
  url: string;
  status: 'pending' | 'downloading' | 'paused' | 'installing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  speed: number;
  eta: number;
  totalSize: number;
  downloadedSize: number;
  filePath: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  installCommand?: string;
  speedHistory?: number[];
  lastSpeedUpdate?: number;
  retryCount?: number;
  maxRetries?: number;
  lastError?: string;
  supportsResume?: boolean;
  tempFilePath?: string;
  finalFilePath?: string;
}

export interface ToolInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  website: string;
  downloadUrl: string;
  installed: boolean;
  version?: string;
  installPath?: string;
}

class DevEnvironmentService {
  private static instance: DevEnvironmentService;
  private downloadDir: string;
  private configPath: string;
  private downloads: Map<string, DownloadTask> = new Map();
  private activeDownloads: Map<string, https.ClientRequest> = new Map();
  private downloadIntervals: Map<string, ReturnType<typeof setInterval>> = new Map();
  private maxConcurrentDownloads: number = 3;
  private downloadQueue: string[] = [];
  private minFreeSpace: number = 1024 * 1024 * 1024; // 1GB 最小剩余空间

  private constructor() {
    this.downloadDir = path.join(app.getPath('userData'), 'downloads');
    this.configPath = path.join(app.getPath('userData'), 'dev-tools-config.json');
    
    // 确保下载目录存在
    if (!fs.existsSync(this.downloadDir)) {
      fs.mkdirSync(this.downloadDir, { recursive: true });
    }
    
    // 加载已保存的下载任务
    this.loadDownloads();
    
    // 启动自动清理定时器
    this.startAutoCleanup();
  }

  public static getInstance(): DevEnvironmentService {
    if (!DevEnvironmentService.instance) {
      DevEnvironmentService.instance = new DevEnvironmentService();
    }
    return DevEnvironmentService.instance;
  }

  /**
   * 检查磁盘空间
   */
  private async checkDiskSpace(requiredSpace: number = 0): Promise<{ success: boolean; error?: string }> {
    try {
      const stats = await fs.promises.statfs(this.downloadDir);
      const freeSpace = stats.bsize * stats.bavail;
      
      const totalRequired = requiredSpace + this.minFreeSpace;
      
      if (freeSpace < totalRequired) {
        const freeGB = Math.floor(freeSpace / (1024 * 1024 * 1024));
        const requiredGB = Math.ceil(totalRequired / (1024 * 1024 * 1024));
        return {
          success: false,
          error: `磁盘空间不足。需要 ${requiredGB}GB，但只有 ${freeGB}GB 可用`
        };
      }
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: `无法检查磁盘空间: ${(error as Error).message}`
      };
    }
  }

  /**
   * 获取当前活动下载数量
   */
  private getActiveDownloadCount(): number {
    return Array.from(this.downloads.values()).filter(
      task => task.status === 'downloading' || task.status === 'installing'
    ).length;
  }

  /**
   * 处理下载队列
   */
  private processDownloadQueue(): void {
    const activeCount = this.getActiveDownloadCount();
    
    if (activeCount >= this.maxConcurrentDownloads) {
      return; // 已达到最大并发数
    }
    
    if (this.downloadQueue.length === 0) {
      return; // 队列为空
    }
    
    const availableSlots = this.maxConcurrentDownloads - activeCount;
    const toStart = this.downloadQueue.splice(0, availableSlots);
    
    toStart.forEach(downloadId => {
      const task = this.downloads.get(downloadId);
      if (task && task.status === 'pending') {
        this.executeDownload(downloadId);
      }
    });
  }

  /**
   * 数据持久化
   */
  private saveDownloads(): void {
    try {
      const data = Array.from(this.downloads.values());
      fs.writeFileSync(this.configPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('[DevEnvironmentService] Failed to save downloads:', error);
    }
  }

  private loadDownloads(): void {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        this.downloads = new Map(data.map((item: DownloadTask) => [item.id, {
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt)
        }]));
      }
    } catch (error) {
      console.error('[DevEnvironmentService] Failed to load downloads:', error);
    }
  }

  /**
   * 启动自动清理定时器
   */
  private startAutoCleanup(): void {
    // 每5分钟执行一次清理
    setInterval(() => {
      this.performAutoCleanup();
    }, 5 * 60 * 1000);
    
    // 立即执行一次清理
    this.performAutoCleanup();
  }

  /**
   * 执行自动清理
   */
  private performAutoCleanup(): void {
    console.log('[DevEnvironmentService] Performing auto cleanup...');
    
    try {
      // 清理失败的下载任务
      this.cleanupFailedDownloads();
      
      // 清理标记的文件
      this.cleanupMarkedFiles();
      
      // 清理孤立的文件
      this.cleanupOrphanedFiles();
      
      console.log('[DevEnvironmentService] Auto cleanup completed');
    } catch (error) {
      console.error('[DevEnvironmentService] Auto cleanup failed:', error);
    }
  }

  /**
   * 清理已失败的下载任务
   */
  private cleanupFailedDownloads(): void {
    const now = Date.now();
    const cleanupThreshold = 5 * 60 * 1000; // 5分钟前的失败任务
    
    let cleanedCount = 0;
    
    for (const [downloadId, task] of this.downloads.entries()) {
      if (task.status === 'failed' && (now - task.updatedAt.getTime()) > cleanupThreshold) {
        console.log(`[DevEnvironmentService] Cleaning up failed download: ${downloadId}`);
        
        // 删除相关文件
        this.deleteDownloadFiles(task);
        
        // 从内存中移除
        this.downloads.delete(downloadId);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`[DevEnvironmentService] Cleaned up ${cleanedCount} failed downloads`);
      this.saveDownloads();
    }
  }

  /**
   * 清理孤立的文件（没有对应下载任务的文件）
   */
  private cleanupOrphanedFiles(): void {
    try {
      if (!fs.existsSync(this.downloadDir)) {
        return;
      }
      
      const files = fs.readdirSync(this.downloadDir);
      const validFileNames = new Set();
      
      // 收集所有有效的文件名
      for (const task of this.downloads.values()) {
        if (task.filePath) {
          validFileNames.add(path.basename(task.filePath));
        }
        if (task.tempFilePath) {
          validFileNames.add(path.basename(task.tempFilePath));
        }
        if (task.finalFilePath) {
          validFileNames.add(path.basename(task.finalFilePath));
        }
      }
      
      let orphanedCount = 0;
      
      // 检查每个文件
      files.forEach(file => {
        const filePath = path.join(this.downloadDir, file);
        const stats = fs.statSync(filePath);
        
        // 只处理文件，不处理目录
        if (stats.isFile()) {
          // 跳过配置文件和清理记录文件
          if (file === 'dev-tools-config.json' || file === 'cleanup_records.json') {
            return;
          }
          
          // 如果文件不在有效文件名列表中，且超过24小时，则删除
          if (!validFileNames.has(file) && (Date.now() - stats.mtime.getTime()) > 24 * 60 * 60 * 1000) {
            try {
              fs.unlinkSync(filePath);
              console.log(`[DevEnvironmentService] Deleted orphaned file: ${file}`);
              orphanedCount++;
            } catch (error) {
              console.warn(`[DevEnvironmentService] Failed to delete orphaned file ${file}:`, error);
            }
          }
        }
      });
      
      if (orphanedCount > 0) {
        console.log(`[DevEnvironmentService] Cleaned up ${orphanedCount} orphaned files`);
      }
    } catch (error) {
      console.error('[DevEnvironmentService] Failed to cleanup orphaned files:', error);
    }
  }

  /**
   * 下载管理核心方法
   */
  public async startDownload(toolId: string, name: string, url: string, category: string): Promise<DownloadTask> {
    const downloadId = `${toolId}_${Date.now()}`;
    const tempFilePath = path.join(this.downloadDir, `${name.replace(/[^a-zA-Z0-9]/g, '_')}_${downloadId}.tmp`);
    const finalFilePath = path.join(this.downloadDir, `${name.replace(/[^a-zA-Z0-9]/g, '_')}_${downloadId}`);
    
    // 清理已失败的下载任务
    this.cleanupFailedDownloads();
    
    // 检查是否已有同名下载
    const existingDownload = Array.from(this.downloads.values()).find(
      task => task.name === name && (task.status === 'downloading' || task.status === 'pending')
    );
    
    if (existingDownload) {
      throw new Error(`已有同名文件正在下载: ${name}`);
    }
    
    const downloadTask: DownloadTask = {
      id: downloadId,
      name,
      url,
      status: 'pending',
      progress: 0,
      speed: 0,
      eta: 0,
      totalSize: 0,
      downloadedSize: 0,
      filePath: finalFilePath,
      tempFilePath,
      createdAt: new Date(),
      updatedAt: new Date(),
      category,
      retryCount: 0,
      maxRetries: 3,
      supportsResume: false
    };

    this.downloads.set(downloadId, downloadTask);
    this.saveDownloads();
    
    // 添加到队列并处理
    this.downloadQueue.push(downloadId);
    this.processDownloadQueue();
    
    return downloadTask;
  }

  private async executeDownload(downloadId: string): Promise<void> {
    const downloadTask = this.downloads.get(downloadId);
    if (!downloadTask) return;

    try {
      // 检查磁盘空间
      const spaceCheck = await this.checkDiskSpace(downloadTask.totalSize || 100 * 1024 * 1024); // 默认假设100MB
      if (!spaceCheck.success) {
        downloadTask.status = 'failed';
        downloadTask.lastError = spaceCheck.error;
        downloadTask.updatedAt = new Date();
        this.saveDownloads();
        this.notifyDownloadUpdate(downloadId);
        return;
      }

      downloadTask.status = 'downloading';
      downloadTask.updatedAt = new Date();
      this.saveDownloads();

      // 检查是否有部分下载的文件
      let downloadedSize = 0;
      let startFrom = 0;
      
      if (fs.existsSync(downloadTask.tempFilePath!)) {
        const stats = fs.statSync(downloadTask.tempFilePath!);
        downloadedSize = stats.size;
        startFrom = downloadedSize;
      }

      // 创建支持断点续传的请求
      const response = await new Promise<https.IncomingMessage>((resolve, reject) => {
        const options: https.RequestOptions = {
          headers: {}
        };
        
        // 如果有部分下载的文件，添加 Range 头
        if (startFrom > 0) {
          options.headers!['Range'] = `bytes=${startFrom}-`;
        }
        
        const req = https.get(downloadTask.url, options, (response) => {
          if (response.statusCode === 302 || response.statusCode === 301) {
            // 处理重定向
            const redirectUrl = response.headers.location;
            if (!redirectUrl) {
              reject(new Error('Redirect response missing Location header'));
              return;
            }
            
            console.log(`[DevEnvironmentService] Following redirect from ${downloadTask.url} to ${redirectUrl}`);
            
            // 检查重定向URL是否指向下载页面而不是实际文件
            if (redirectUrl.includes('/download/') || redirectUrl.includes('/downloads/')) {
              console.warn(`[DevEnvironmentService] Redirect URL appears to be a download page, not direct file: ${redirectUrl}`);
            }
            
            const redirectReq = https.get(redirectUrl, options, (redirectResponse) => {
              resolve(redirectResponse);
            });
            
            redirectReq.on('error', reject);
            redirectReq.setTimeout(30000, () => {
              redirectReq.destroy();
              reject(new Error('Download timeout during redirect'));
            });
            return;
          }
          
          // 检查服务器是否支持断点续传
          if (response.statusCode === 206) {
            downloadTask.supportsResume = true;
            console.log(`[DevEnvironmentService] Server supports resume for ${downloadId}`);
          } else if (startFrom > 0 && response.statusCode === 200) {
            // 服务器不支持断点续传，从头开始下载
            console.log(`[DevEnvironmentService] Server doesn't support resume for ${downloadId}, starting from scratch`);
            startFrom = 0;
            downloadedSize = 0;
          }
          
          resolve(response);
        });
        
        req.on('error', reject);
        req.setTimeout(30000, () => {
          req.destroy();
          reject(new Error('Download timeout'));
        });
      });

      if (response.statusCode !== 200 && response.statusCode !== 206) {
        throw new Error(`HTTP ${response.statusCode}`);
      }

      // 获取文件总大小
      let totalSize = parseInt(response.headers['content-length'] || '0', 10);
      if (response.statusCode === 206) {
        // 对于部分内容响应，总大小可能在 Content-Range 头中
        const contentRange = response.headers['content-range'];
        if (contentRange) {
          const match = contentRange.match(/bytes \d+-\d+\/(\d+)/);
          if (match) {
            totalSize = parseInt(match[1], 10);
          }
        }
      }
      
      // 检查下载的文件类型
      const contentType = response.headers['content-type'] || '';
      const contentLength = response.headers['content-length'] || '0';
      
      console.log(`[DevEnvironmentService] Download info: Content-Type: ${contentType}, Content-Length: ${contentLength}`);
      
      // 如果Content-Type是HTML但文件很大，可能是错误的下载页面
      if (contentType.includes('text/html') && parseInt(contentLength) > 1024 * 100) {
        console.warn(`[DevEnvironmentService] Warning: Downloading HTML file with size ${contentLength} - may not be the expected installer`);
      }
      
      downloadTask.totalSize = totalSize;

      // 以追加模式打开文件（如果支持断点续传）
      const fileStream = createWriteStream(downloadTask.tempFilePath!, {
        flags: startFrom > 0 ? 'a' : 'w'
      });

      let lastTime = Date.now();
      let lastDownloaded = downloadedSize;
      
      // 初始化速度历史记录
      if (!downloadTask.speedHistory) {
        downloadTask.speedHistory = [];
      }
      if (!downloadTask.lastSpeedUpdate) {
        downloadTask.lastSpeedUpdate = Date.now();
      }

      // 监听数据流事件
      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
      });

      const progressInterval = setInterval(() => {
        const currentTime = Date.now();
        const timeDiff = (currentTime - lastTime) / 1000;
        const sizeDiff = downloadedSize - lastDownloaded;
        
        if (timeDiff > 0 && sizeDiff >= 0) {
          // 计算瞬时速度
          const instantSpeed = sizeDiff / timeDiff;
          
          // 使用滑动平均平滑速度
          downloadTask.speedHistory.push(instantSpeed);
          
          // 只保留最近10秒的速度记录
          if (downloadTask.speedHistory.length > 10) {
            downloadTask.speedHistory.shift();
          }
          
          // 计算加权平均速度（最近的权重更高）
          let weightedSpeed = 0;
          let totalWeight = 0;
          downloadTask.speedHistory.forEach((speed, index) => {
            const weight = index + 1; // 线性权重，越近的权重越高
            weightedSpeed += speed * weight;
            totalWeight += weight;
          });
          
          downloadTask.speed = totalWeight > 0 ? weightedSpeed / totalWeight : 0;
          
          // 计算更准确的ETA
          if (downloadTask.speed > 0 && totalSize > 0) {
            const remainingSize = totalSize - downloadedSize;
            downloadTask.eta = remainingSize / downloadTask.speed;
          }
        }
        
        lastTime = currentTime;
        lastDownloaded = downloadedSize;
        
        downloadTask.progress = totalSize > 0 ? (downloadedSize / totalSize) * 100 : 0;
        downloadTask.downloadedSize = downloadedSize;
        downloadTask.lastSpeedUpdate = currentTime;
        downloadTask.updatedAt = new Date();
        
        this.saveDownloads();
        this.notifyDownloadUpdate(downloadId);
      }, 1000);

      this.downloadIntervals.set(downloadId, progressInterval);

      await pipeline(response, fileStream);
      
      clearInterval(progressInterval);
      this.downloadIntervals.delete(downloadId);

      // 下载完成，重命名临时文件
      if (fs.existsSync(downloadTask.tempFilePath!)) {
        fs.renameSync(downloadTask.tempFilePath!, downloadTask.filePath!);
      }

      downloadTask.status = 'installing';
      downloadTask.progress = 100;
      downloadTask.speed = 0;
      downloadTask.eta = 0;
      downloadTask.updatedAt = new Date();
      
      this.saveDownloads();
      this.notifyDownloadUpdate(downloadId);

      // 自动安装/解压
      console.log(`[DevEnvironmentService] Download completed, auto-installing ${downloadTask.name}...`);
      const installResult = await this.autoInstallDownloadedFile(downloadTask);
      
      if (installResult.success) {
        downloadTask.status = 'completed';
        console.log(`[DevEnvironmentService] ${downloadTask.name} installed successfully`);
      } else {
        // 如果安装失败，保持为completed状态但记录错误
        downloadTask.status = 'completed';
        downloadTask.lastError = installResult.error || 'Unknown installation error';
        console.error(`[DevEnvironmentService] Installation failed for ${downloadTask.name}:`, installResult.error);
      }
      
      downloadTask.updatedAt = new Date();
      this.saveDownloads();
      this.notifyDownloadUpdate(downloadId);

      // 下载完成，处理队列中的下一个
      this.processDownloadQueue();

    } catch (error) {
      console.error(`[DevEnvironmentService] Download failed for ${downloadId}:`, error);
      
      downloadTask.lastError = (error as Error).message;
      
      // 检查是否可以重试
      if (downloadTask.retryCount! < downloadTask.maxRetries!) {
        downloadTask.retryCount! += 1;
        downloadTask.status = 'pending';
        downloadTask.speed = 0;
        downloadTask.eta = 0;
        downloadTask.updatedAt = new Date();
        
        this.saveDownloads();
        this.notifyDownloadUpdate(downloadId);
        
        console.log(`[DevEnvironmentService] Retrying download ${downloadId} (attempt ${downloadTask.retryCount} of ${downloadTask.maxRetries})`);
        
        // 延迟重试（指数退避）
        const retryDelay = Math.min(1000 * Math.pow(2, downloadTask.retryCount! - 1), 30000);
        setTimeout(() => {
          this.executeDownload(downloadId);
        }, retryDelay);
      } else {
        // 重试次数用尽，标记为失败
        downloadTask.status = 'failed';
        downloadTask.speed = 0;
        downloadTask.eta = 0;
        downloadTask.updatedAt = new Date();
        
        this.saveDownloads();
        this.notifyDownloadUpdate(downloadId);
        
        console.error(`[DevEnvironmentService] Download ${downloadId} failed after ${downloadTask.retryCount} attempts`);
        
        // 下载失败，处理队列中的下一个
        this.processDownloadQueue();
      }
    }
  }

  private notifyDownloadUpdate(downloadId: string): void {
    const downloadTask = this.downloads.get(downloadId);
    if (downloadTask) {
      // 通知前端更新
      console.log(`[DevEnvironmentService] Notifying download update for ${downloadId}: ${downloadTask.status}`);
      ipcMain.emit('download-update', { 
        downloadId, 
        task: downloadTask,
        timestamp: Date.now()
      });
    } else {
      console.error(`[DevEnvironmentService] Download task not found for notification: ${downloadId}`);
    }
  }

  public pauseDownload(downloadId: string): boolean {
    const interval = this.downloadIntervals.get(downloadId);
    if (interval) {
      clearInterval(interval);
      this.downloadIntervals.delete(downloadId);
    }

    const downloadTask = this.downloads.get(downloadId);
    if (downloadTask && downloadTask.status === 'downloading') {
      downloadTask.status = 'paused';
      downloadTask.updatedAt = new Date();
      this.saveDownloads();
      return true;
    }
    return false;
  }

  public resumeDownload(downloadId: string): boolean {
    const downloadTask = this.downloads.get(downloadId);
    if (downloadTask && downloadTask.status === 'paused') {
      this.executeDownload(downloadId);
      return true;
    }
    return false;
  }

  public retryDownload(downloadId: string): boolean {
    const downloadTask = this.downloads.get(downloadId);
    if (downloadTask && (downloadTask.status === 'failed' || downloadTask.status === 'cancelled')) {
      // 重置重试计数
      downloadTask.retryCount = 0;
      downloadTask.lastError = undefined;
      downloadTask.speed = 0;
      downloadTask.eta = 0;
      downloadTask.progress = 0;
      downloadTask.downloadedSize = 0;
      
      // 删除部分下载的文件
      if (fs.existsSync(downloadTask.filePath)) {
        fs.unlinkSync(downloadTask.filePath);
      }
      
      this.executeDownload(downloadId);
      return true;
    }
    return false;
  }

  public cancelDownload(downloadId: string): boolean {
    const interval = this.downloadIntervals.get(downloadId);
    if (interval) {
      clearInterval(interval);
      this.downloadIntervals.delete(downloadId);
    }

    const downloadTask = this.downloads.get(downloadId);
    if (!downloadTask) {
      console.warn(`[DevEnvironmentService] Download task not found for cancellation: ${downloadId}`);
      return false;
    }

    console.log(`[DevEnvironmentService] Cancelling download: ${downloadId} (${downloadTask.name})`);

    try {
      downloadTask.status = 'cancelled';
      downloadTask.updatedAt = new Date();
      
      // 从队列中移除
      const queueIndex = this.downloadQueue.indexOf(downloadId);
      if (queueIndex > -1) {
        this.downloadQueue.splice(queueIndex, 1);
      }

      // 删除部分下载的文件
      this.deleteDownloadFiles(downloadTask);
      
      this.saveDownloads();
      this.notifyDownloadUpdate(downloadId);
      
      console.log(`[DevEnvironmentService] Successfully cancelled download: ${downloadId}`);
      return true;
    } catch (error) {
      console.error(`[DevEnvironmentService] Failed to cancel download ${downloadId}:`, error);
      return false;
    }
  }

  public removeDownload(downloadId: string): boolean {
    const downloadTask = this.downloads.get(downloadId);
    if (!downloadTask) {
      console.warn(`[DevEnvironmentService] Download task not found for removal: ${downloadId}`);
      return false;
    }

    console.log(`[DevEnvironmentService] Removing download: ${downloadId} (${downloadTask.name})`);

    try {
      // 停止相关的下载间隔器
      const interval = this.downloadIntervals.get(downloadId);
      if (interval) {
        clearInterval(interval);
        this.downloadIntervals.delete(downloadId);
      }

      // 从队列中移除
      const queueIndex = this.downloadQueue.indexOf(downloadId);
      if (queueIndex > -1) {
        this.downloadQueue.splice(queueIndex, 1);
      }

      // 删除所有相关文件
      this.deleteDownloadFiles(downloadTask);

      // 从内存中移除
      this.downloads.delete(downloadId);
      
      // 保存状态
      this.saveDownloads();
      
      console.log(`[DevEnvironmentService] Successfully removed download: ${downloadId}`);
      return true;
    } catch (error) {
      console.error(`[DevEnvironmentService] Failed to remove download ${downloadId}:`, error);
      return false;
    }
  }

  /**
   * 删除下载相关的所有文件
   */
  private deleteDownloadFiles(downloadTask: DownloadTask): void {
    const filesToDelete = [];

    // 添加主要文件路径
    if (downloadTask.filePath) {
      filesToDelete.push(downloadTask.filePath);
    }

    // 添加临时文件路径
    if (downloadTask.tempFilePath) {
      filesToDelete.push(downloadTask.tempFilePath);
    }

    // 添加可能的最终文件路径
    if (downloadTask.finalFilePath) {
      filesToDelete.push(downloadTask.finalFilePath);
    }

    // 尝试删除每个文件
    filesToDelete.forEach(filePath => {
      try {
        if (fs.existsSync(filePath)) {
          // 检查文件是否被占用
          try {
            fs.accessSync(filePath, fs.constants.W_OK);
            fs.unlinkSync(filePath);
            console.log(`[DevEnvironmentService] Deleted file: ${filePath}`);
          } catch {
            console.warn(`[DevEnvironmentService] File may be in use, cannot delete: ${filePath}`);
            // 标记文件以便后续清理
            this.markFileForCleanup(filePath);
          }
        }
      } catch (error) {
        console.error(`[DevEnvironmentService] Failed to delete file ${filePath}:`, error);
      }
    });
  }

  /**
   * 标记文件以便后续清理
   */
  private markFileForCleanup(filePath: string): void {
    // 创建清理记录文件
    const cleanupRecordPath = path.join(this.downloadDir, 'cleanup_records.json');
    let cleanupRecords: string[] = [];

    try {
      if (fs.existsSync(cleanupRecordPath)) {
        const data = fs.readFileSync(cleanupRecordPath, 'utf8');
        cleanupRecords = JSON.parse(data);
      }

      // 添加文件路径到清理记录
      if (!cleanupRecords.includes(filePath)) {
        cleanupRecords.push(filePath);
        fs.writeFileSync(cleanupRecordPath, JSON.stringify(cleanupRecords, null, 2));
        console.log(`[DevEnvironmentService] Marked file for cleanup: ${filePath}`);
      }
    } catch (error) {
      console.error('[DevEnvironmentService] Failed to mark file for cleanup:', error);
    }
  }

  /**
   * 清理标记的文件
   */
  public cleanupMarkedFiles(): void {
    const cleanupRecordPath = path.join(this.downloadDir, 'cleanup_records.json');
    
    try {
      if (fs.existsSync(cleanupRecordPath)) {
        const data = fs.readFileSync(cleanupRecordPath, 'utf8');
        const cleanupRecords: string[] = JSON.parse(data);
        
        const remainingFiles: string[] = [];
        
        cleanupRecords.forEach(filePath => {
          try {
            if (fs.existsSync(filePath)) {
              fs.accessSync(filePath, fs.constants.W_OK);
              fs.unlinkSync(filePath);
              console.log(`[DevEnvironmentService] Cleaned up marked file: ${filePath}`);
            }
          } catch {
            // 文件仍被占用或不存在，保留记录
            remainingFiles.push(filePath);
          }
        });
        
        // 更新清理记录
        if (remainingFiles.length > 0) {
          fs.writeFileSync(cleanupRecordPath, JSON.stringify(remainingFiles, null, 2));
        } else {
          fs.unlinkSync(cleanupRecordPath);
        }
      }
    } catch (error) {
      console.error('[DevEnvironmentService] Failed to cleanup marked files:', error);
    }
  }

  public getDownloads(): DownloadTask[] {
    return Array.from(this.downloads.values()).sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  public getDownloadStats() {
    const downloads = this.getDownloads();
    return {
      total: downloads.length,
      downloading: downloads.filter(d => d.status === 'downloading').length,
      completed: downloads.filter(d => d.status === 'completed').length,
      paused: downloads.filter(d => d.status === 'paused').length,
      failed: downloads.filter(d => d.status === 'failed').length,
      totalSpeed: downloads
        .filter(d => d.status === 'downloading')
        .reduce((sum, d) => sum + d.speed, 0)
    };
  }

  /**
   * 工具管理方法
   */
  public async checkToolInstallation(toolId: string): Promise<boolean> {
    try {
      switch (toolId) {
        case 'nodejs': {
          const { stdout: nodeVersion } = await execPromise('node --version');
          return nodeVersion.trim().startsWith('v');
        }
        
        case 'vscode':
        case 'vscode-insider': {
          const vscodePath = process.env['LOCALAPPDATA'] + '\\Programs\\Microsoft VS Code\\Code.exe';
          return fs.existsSync(vscodePath);
        }
        
        case 'python':
        case 'anaconda': {
          const { stdout: pythonVersion } = await execPromise('python --version');
          return pythonVersion.trim().startsWith('Python');
        }
        
        case 'powershell':
        case 'powershell7': {
          const { stdout: psVersion } = await execPromise('$PSVersionTable.PSVersion.Major');
          return parseInt(psVersion.trim()) >= 7;
        }
        
        case 'windows-terminal': {
          const wtPath = process.env['LOCALAPPDATA'] + '\\Microsoft\\WindowsApps\\wt.exe';
          return fs.existsSync(wtPath);
        }
        
        case 'winget': {
          const { stdout: wingetVersion } = await execPromise('winget --version');
          return wingetVersion.trim().length > 0;
        }
        
        case 'choco': {
          const { stdout: chocoVersion } = await execPromise('choco --version');
          return chocoVersion.trim().length > 0;
        }
        
        default:
          return false;
      }
    } catch {
      return false;
    }
  }

  public async getToolVersion(toolId: string): Promise<string | null> {
    try {
      switch (toolId) {
        case 'nodejs': {
          const { stdout: nodeVersion } = await execPromise('node --version');
          return nodeVersion.trim();
        }
        
        case 'python': {
          const { stdout: pythonVersion } = await execPromise('python --version');
          return pythonVersion.trim();
        }
        
        case 'powershell':
        case 'powershell7': {
          const { stdout: psVersion } = await execPromise('$PSVersionTable.PSVersion.ToString()');
          return psVersion.trim();
        }
        
        case 'winget': {
          const { stdout: wingetVersion } = await execPromise('winget --version');
          return wingetVersion.trim();
        }
        
        case 'choco': {
          const { stdout: chocoVersion } = await execPromise('choco --version');
          return chocoVersion.trim();
        }
        
        default:
          return null;
      }
    } catch {
      return null;
    }
  }

  public async installTool(toolId: string, toolName: string, downloadUrl: string, category: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`[DevEnvironmentService] Installing ${toolName}...`);
      
      // 开始下载
      const downloadTask = await this.startDownload(toolId, toolName, downloadUrl, category);
      
      // 等待下载完成
      const waitForDownload = new Promise<void>((resolve, reject) => {
        const checkDownload = () => {
          const task = this.downloads.get(downloadTask.id);
          if (!task) {
            reject(new Error('Download task not found'));
            return;
          }
          
          if (task.status === 'completed') {
            resolve();
          } else if (task.status === 'failed' || task.status === 'cancelled') {
            reject(new Error(`Download ${task.status}`));
          } else {
            setTimeout(checkDownload, 1000);
          }
        };
        checkDownload();
      });

      await waitForDownload;
      
      // 下载完成后执行安装
      console.log(`[DevEnvironmentService] Download completed, installing ${toolName}...`);
      
      let installCommand = '';
      switch (toolId) {
        case 'vscode':
        case 'vscode-insider':
          installCommand = `"${downloadTask.filePath}" /S`;
          break;
        case 'nodejs':
          installCommand = `msiexec /i "${downloadTask.filePath}" /quiet`;
          break;
        case 'python':
          installCommand = `"${downloadTask.filePath}" /quiet InstallAllUsers=1 PrependPath=1`;
          break;
        default:
          // 默认静默安装
          installCommand = `"${downloadTask.filePath}" /S`;
      }
      
      const { stdout, stderr } = await execPromise(installCommand);
      console.log(`[DevEnvironmentService] Installation stdout:`, stdout);
      if (stderr) {
        console.error(`[DevEnvironmentService] Installation stderr:`, stderr);
      }
      
      // 清理下载文件
      if (fs.existsSync(downloadTask.filePath)) {
        fs.unlinkSync(downloadTask.filePath);
      }
      
      console.log(`[DevEnvironmentService] ${toolName} installed successfully`);
      return { success: true };
      
    } catch (error) {
      console.error(`[DevEnvironmentService] Failed to install ${toolName}:`, error);
      return { success: false, error: (error as Error).message };
    }
  }

  public async uninstallTool(toolId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`[DevEnvironmentService] Uninstalling ${toolId}...`);
      
      let uninstallCommand = '';
      switch (toolId) {
        case 'vscode':
          uninstallCommand = 'winget uninstall Microsoft.VisualStudioCode';
          break;
        case 'nodejs':
          uninstallCommand = 'winget uninstall OpenJS.NodeJS';
          break;
        case 'python':
          uninstallCommand = 'winget uninstall Python.Python.3';
          break;
        default:
          return { success: false, error: `Uninstall not supported for ${toolId}` };
      }
      
      const { stdout, stderr } = await execPromise(uninstallCommand);
      console.log(`[DevEnvironmentService] Uninstall stdout:`, stdout);
      if (stderr) {
        console.error(`[DevEnvironmentService] Uninstall stderr:`, stderr);
      }
      
      return { success: true };
      
    } catch (error) {
      console.error(`[DevEnvironmentService] Failed to uninstall ${toolId}:`, error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * 下载文件方法 - 为旧的安装方法提供支持
   */
  private async downloadFile(url: string, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const fileStream = createWriteStream(filePath);
      // let downloadedSize = 0;
      // const lastTime = Date.now();
      
      const req = https.get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          // 处理重定向
          https.get(response.headers.location!, (redirectResponse) => {
            if (redirectResponse.statusCode !== 200) {
              reject(new Error(`HTTP ${redirectResponse.statusCode}`));
              return;
            }
            
            redirectResponse.pipe(fileStream);
            
            // redirectResponse.on('data', (chunk) => {
        //   downloadedSize += chunk.length;
        // });
            
            redirectResponse.on('end', () => {
              fileStream.end();
              resolve();
            });
          });
          return;
        }
        
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }
        
        response.pipe(fileStream);
        
        // response.on('data', (chunk) => {
        //   downloadedSize += chunk.length;
        // });
        
        response.on('end', () => {
          fileStream.end();
          resolve();
        });
      });
      
      req.on('error', (error) => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        reject(error);
      });
      
      req.setTimeout(30000, () => {
        req.destroy();
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        reject(new Error('Download timeout'));
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
      
      if (os.platform() === 'win32') {
        downloadUrl = 'https://code.visualstudio.com/sha/download?build=stable&os=win32-x64';
      } else if (os.platform() === 'darwin') {
        downloadUrl = 'https://code.visualstudio.com/sha/download?build=stable&os=darwin';
      } else {
        // Linux
        downloadUrl = 'https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64';
      }
      
      // 使用新的下载逻辑
      const downloadTask = await this.startDownload('vscode', 'Visual Studio Code', downloadUrl, '开发环境');
      
      // 等待下载完成
      const waitForDownload = new Promise<void>((resolve, reject) => {
        const checkDownload = () => {
          const task = this.downloads.get(downloadTask.id);
          if (!task) {
            reject(new Error('Download task not found'));
            return;
          }
          
          if (task.status === 'completed') {
            resolve();
          } else if (task.status === 'failed' || task.status === 'cancelled') {
            reject(new Error(`Download ${task.status}: ${task.lastError || 'Unknown error'}`));
          } else {
            setTimeout(checkDownload, 1000);
          }
        };
        checkDownload();
      });

      await waitForDownload;
      
      console.log('[DevEnvironmentService] VSCode downloaded successfully');
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
      
      if (os.platform() === 'win32') {
        downloadUrl = 'https://nodejs.org/dist/latest/node-v20.10.0-win-x64.msi';
      } else if (os.platform() === 'darwin') {
        downloadUrl = 'https://nodejs.org/dist/latest/node-v20.10.0.pkg';
      } else {
        // Linux
        downloadUrl = 'https://nodejs.org/dist/latest/node-v20.10.0-linux-x64.tar.xz';
      }
      
      // 使用新的下载逻辑
      const downloadTask = await this.startDownload('nodejs', 'Node.js', downloadUrl, '开发环境');
      
      // 等待下载完成
      const waitForDownload = new Promise<void>((resolve, reject) => {
        const checkDownload = () => {
          const task = this.downloads.get(downloadTask.id);
          if (!task) {
            reject(new Error('Download task not found'));
            return;
          }
          
          if (task.status === 'completed') {
            resolve();
          } else if (task.status === 'failed' || task.status === 'cancelled') {
            reject(new Error(`Download ${task.status}: ${task.lastError || 'Unknown error'}`));
          } else {
            setTimeout(checkDownload, 1000);
          }
        };
        checkDownload();
      });

      await waitForDownload;
      
      console.log('[DevEnvironmentService] Node.js downloaded successfully');
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
      
      if (os.platform() === 'win32') {
        downloadUrl = 'https://www.python.org/ftp/python/3.12.0/python-3.12.0-amd64.exe';
      } else if (os.platform() === 'darwin') {
        downloadUrl = 'https://www.python.org/ftp/python/3.12.0/python-3.12.0-macos11.pkg';
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
      
      // 使用新的下载逻辑
      const downloadTask = await this.startDownload('python', 'Python', downloadUrl, '开发环境');
      
      // 等待下载完成
      const waitForDownload = new Promise<void>((resolve, reject) => {
        const checkDownload = () => {
          const task = this.downloads.get(downloadTask.id);
          if (!task) {
            reject(new Error('Download task not found'));
            return;
          }
          
          if (task.status === 'completed') {
            resolve();
          } else if (task.status === 'failed' || task.status === 'cancelled') {
            reject(new Error(`Download ${task.status}: ${task.lastError || 'Unknown error'}`));
          } else {
            setTimeout(checkDownload, 1000);
          }
        };
        checkDownload();
      });

      await waitForDownload;
      
      console.log('[DevEnvironmentService] Python downloaded successfully');
      console.log('[DevEnvironmentService] Python installed successfully');
      return { success: true };
    } catch (error) {
      console.error('[DevEnvironmentService] Failed to install Python:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * 自动安装/解压下载的文件
   */
  private async autoInstallDownloadedFile(downloadTask: DownloadTask): Promise<{ success: boolean; error?: string }> {
    try {
      const filePath = downloadTask.filePath;
      const fileExtension = path.extname(filePath).toLowerCase();
      
      console.log(`[DevEnvironmentService] Auto-installing ${filePath} (${fileExtension})`);
      
      // 首先检查文件是否存在且有效
      if (!fs.existsSync(filePath)) {
        return { success: false, error: '下载的文件不存在' };
      }
      
      const stats = fs.statSync(filePath);
      if (stats.size === 0) {
        return { success: false, error: '下载的文件为空' };
      }
      
      switch (fileExtension) {
        case '.exe':
        case '.msi':
          return await this.installWindowsInstaller(filePath, downloadTask);
          
        case '.zip':
          return await this.extractZipFile(filePath, downloadTask);
          
        case '.tar':
        case '.tar.gz':
        case '.tgz':
          return await this.extractTarFile(filePath, downloadTask);
          
        case '.dmg':
          return await this.installDmgFile(filePath, downloadTask);
          
        case '.pkg':
          return await this.installPkgFile(filePath, downloadTask);
          
        default:
          console.log(`[DevEnvironmentService] No auto-install available for ${fileExtension}`);
          return { success: true }; // 不需要安装，视为成功
      }
    } catch (error) {
      console.error(`[DevEnvironmentService] Auto-install failed for ${downloadTask.name}:`, error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * 安装 Windows 安装程序
   */
  private async installWindowsInstaller(filePath: string, downloadTask: DownloadTask): Promise<{ success: boolean; error?: string }> {
    try {
      // 首先检查文件是否为有效的安装程序
      const fileExtension = path.extname(filePath).toLowerCase();
      const stats = fs.statSync(filePath);
      
      // 检查文件大小 - 如果太小，可能是HTML页面而不是真正的安装程序
      if (stats.size < 1024 * 1024) { // 小于1MB
        const fileContent = fs.readFileSync(filePath, 'utf8');
        if (fileContent.includes('<html') || fileContent.includes('<!DOCTYPE')) {
          return { 
            success: false, 
            error: '下载的文件不是有效的安装程序，可能是网页内容。请检查下载URL是否正确。' 
          };
        }
      }
      
      let installCommand = '';
      
      if (fileExtension === '.msi') {
        installCommand = `msiexec /i "${filePath}" /quiet /norestart`;
      } else if (fileExtension === '.exe') {
        installCommand = `"${filePath}" /S /norestart`;
      } else {
        return { success: false, error: `不支持的安装文件类型: ${fileExtension}` };
      }
      
      // 根据工具类型添加特定参数
      if (downloadTask.category === '开发环境') {
        if (downloadTask.name.toLowerCase().includes('node')) {
          installCommand += ' /norestart';
        } else if (downloadTask.name.toLowerCase().includes('python')) {
          installCommand += ' InstallAllUsers=1 PrependPath=1 /norestart';
        }
      }
      
      console.log(`[DevEnvironmentService] Running install command: ${installCommand}`);
      
      const { stdout, stderr } = await execPromise(installCommand);
      console.log(`[DevEnvironmentService] Install stdout:`, stdout);
      if (stderr) {
        console.error(`[DevEnvironmentService] Install stderr:`, stderr);
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * 解压 ZIP 文件
   */
  private async extractZipFile(filePath: string, downloadTask: DownloadTask): Promise<{ success: boolean; error?: string }> {
    try {
      const extractDir = path.join(this.downloadDir, 'extracted', downloadTask.id);
      
      // 确保解压目录存在
      if (!fs.existsSync(extractDir)) {
        fs.mkdirSync(extractDir, { recursive: true });
      }
      
      console.log(`[DevEnvironmentService] Extracting ZIP to ${extractDir}`);
      
      await createReadStream(filePath)
        .pipe(extractZip({ path: extractDir }))
        .promise();
      
      console.log(`[DevEnvironmentService] ZIP extracted successfully`);
      
      // 查找可执行文件或安装程序
      const executableFile = this.findExecutableFile(extractDir);
      if (executableFile) {
        console.log(`[DevEnvironmentService] Found executable: ${executableFile}`);
        // 可以在这里添加自动运行可执行文件的逻辑
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * 解压 TAR 文件
   */
  private async extractTarFile(filePath: string, downloadTask: DownloadTask): Promise<{ success: boolean; error?: string }> {
    try {
      const extractDir = path.join(this.downloadDir, 'extracted', downloadTask.id);
      
      // 确保解压目录存在
      if (!fs.existsSync(extractDir)) {
        fs.mkdirSync(extractDir, { recursive: true });
      }
      
      console.log(`[DevEnvironmentService] Extracting TAR to ${extractDir}`);
      
      if (filePath.endsWith('.tar.gz') || filePath.endsWith('.tgz')) {
        await extractTar({
          file: filePath,
          cwd: extractDir,
          strip: 1
        });
      } else {
        await extractTar({
          file: filePath,
          cwd: extractDir,
          strip: 1
        });
      }
      
      console.log(`[DevEnvironmentService] TAR extracted successfully`);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * 安装 DMG 文件 (macOS)
   */
  private async installDmgFile(filePath: string, downloadTask: DownloadTask): Promise<{ success: boolean; error?: string }> {
    try {
      const mountPoint = path.join(this.downloadDir, 'mount', downloadTask.id);
      
      // 确保挂载点目录存在
      if (!fs.existsSync(mountPoint)) {
        fs.mkdirSync(mountPoint, { recursive: true });
      }
      
      console.log(`[DevEnvironmentService] Mounting DMG to ${mountPoint}`);
      
      // 挂载 DMG
      await execPromise(`hdiutil attach "${filePath}" -mountpoint "${mountPoint}" -nobrowse`);
      
      // 查找应用程序
      const appFile = this.findAppFile(mountPoint);
      if (appFile) {
        console.log(`[DevEnvironmentService] Found app: ${appFile}`);
        // 复制到应用程序目录
        await execPromise(`cp -R "${appFile}" /Applications/`);
      }
      
      // 卸载 DMG
      await execPromise(`hdiutil detach "${mountPoint}"`);
      
      console.log(`[DevEnvironmentService] DMG installed successfully`);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * 安装 PKG 文件 (macOS)
   */
  private async installPkgFile(filePath: string, _downloadTask: DownloadTask): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`[DevEnvironmentService] Installing PKG: ${filePath}`);
      
      const { stdout, stderr } = await execPromise(`sudo installer -pkg "${filePath}" -target /`);
      console.log(`[DevEnvironmentService] PKG install stdout:`, stdout);
      if (stderr) {
        console.error(`[DevEnvironmentService] PKG install stderr:`, stderr);
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * 查找可执行文件
   */
  private findExecutableFile(dir: string): string | null {
    const executableExtensions = ['.exe', '.msi', '.app', '.dmg', '.pkg'];
    
    const findExecutable = (currentDir: string): string | null => {
      const files = fs.readdirSync(currentDir);
      
      for (const file of files) {
        const filePath = path.join(currentDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          const found = findExecutable(filePath);
          if (found) return found;
        } else if (executableExtensions.some(ext => file.toLowerCase().endsWith(ext))) {
          return filePath;
        }
      }
      
      return null;
    };
    
    return findExecutable(dir);
  }

  /**
   * 查找应用程序文件 (macOS)
   */
  private findAppFile(dir: string): string | null {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      if (file.endsWith('.app')) {
        return path.join(dir, file);
      }
    }
    
    return null;
  }

  // 可以添加更多工具的安装方法
}

export const devEnvironmentService = DevEnvironmentService.getInstance();
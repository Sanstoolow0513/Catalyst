const fs = require('fs');
const path = require('path');
const https = require('https');
const { execFile } = require('child_process');
const os = require('os');
const { EventEmitter } = require('events');

/**
 * 软件安装服务，负责管理和执行软件安装
 * @extends EventEmitter
 */
class SoftwareInstallerService extends EventEmitter {
  /**
   * 创建软件安装服务实例
   */
  constructor() {
    super();
    this.tempDir = path.join(os.tmpdir(), 'QMR-Toolkit-Downloads');
    
    console.log('[SoftwareInstallerService] 初始化完成');
    console.log(`[SoftwareInstallerService] 临时目录: ${this.tempDir}`);
  }

  /**
   * 安装指定的软件
   * @param {Object} software 软件信息
   * @param {string} software.id 软件ID
   * @param {string} software.name 软件名称
   * @param {string} software.url 下载URL
   * @param {string} software.installer_args 安装参数
   * @returns {Promise<void>}
   */
  async installSoftware(software) {
    const { id, name, url, installer_args } = software;
    
    // 发出开始下载事件
    this.emit('status', { id, status: 'downloading' });
    
    try {
      // 下载软件
      console.log(`[SoftwareInstallerService] 开始下载 ${name} 从 ${url}`);
      const filePath = await this.downloadFile(url);
      
      // 发出开始安装事件
      this.emit('status', { id, status: 'installing' });
      
      // 执行安装
      console.log(`[SoftwareInstallerService] 开始安装 ${name}`);
      await this.runInstaller(filePath, installer_args);
      
      // 发出安装成功事件
      this.emit('status', { id, status: 'success' });
      console.log(`[SoftwareInstallerService] ${name} 安装成功`);
    } catch (error) {
      // 发出安装错误事件
      this.emit('status', { id, status: 'error', message: error.message });
      console.error(`[SoftwareInstallerService] ${name} 安装失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 从URL下载文件
   * @private
   * @param {string} url 下载URL
   * @returns {Promise<string>} 下载后的文件路径
   */
  async downloadFile(url) {
    // 确保临时目录存在
    await fs.promises.mkdir(this.tempDir, { recursive: true });
    
    // 提取文件名
    const fileName = path.basename(new URL(url).pathname);
    const filePath = path.join(this.tempDir, fileName);
    
    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(filePath);
      
      const request = (downloadUrl) => {
        https.get(downloadUrl, (response) => {
          // 处理重定向
          if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            console.log(`[SoftwareInstallerService] 重定向到 ${response.headers.location}`);
            // 跟随重定向
            request(response.headers.location);
            return;
          }
          
          if (response.statusCode !== 200) {
            reject(new Error(`下载失败，状态码: ${response.statusCode}`));
            return;
          }
          
          response.pipe(fileStream);
          
          fileStream.on('finish', () => {
            fileStream.close(() => resolve(filePath));
          });
        }).on('error', (err) => {
          fs.unlink(filePath, () => {}); // 清理损坏的文件
          reject(err);
        });
      };
      
      request(url); // 初始请求
    });
  }

  /**
   * 运行安装程序
   * @private
   * @param {string} filePath 安装程序路径
   * @param {string} args 安装参数
   * @returns {Promise<void>}
   */
  runInstaller(filePath, args) {
    return new Promise((resolve, reject) => {
      // 使用shell: true以获得更好的.msi和复杂命令兼容性
      execFile(filePath, args ? args.split(' ') : [], { shell: true }, (error, stdout, stderr) => {
        if (error) {
          // 一些安装程序在成功时也可能返回非零退出码，所以我们也检查stderr
          if (stderr) {
            console.warn(`[SoftwareInstallerService] 安装产生stderr: ${stderr}`);
          }
          // 现在，我们将任何错误视为失败，但这可以改进。
          return reject(error);
        }
        console.log(`[SoftwareInstallerService] 安装输出: ${stdout}`);
        resolve();
      });
    });
  }

  /**
   * 获取软件列表
   * @param {string} configPath 软件配置文件路径
   * @returns {Promise<Array>} 软件列表
   */
  async getSoftwareList(configPath) {
    try {
      const data = await fs.promises.readFile(configPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`[SoftwareInstallerService] 读取软件列表失败: ${error.message}`);
      return [];
    }
  }

  /**
   * 清理临时下载目录
   * @returns {Promise<void>}
   */
  async cleanupTempDir() {
    try {
      await fs.promises.rm(this.tempDir, { recursive: true, force: true });
      console.log(`[SoftwareInstallerService] 已清理临时目录: ${this.tempDir}`);
    } catch (error) {
      console.error(`[SoftwareInstallerService] 清理临时目录失败: ${error.message}`);
    }
  }
}

module.exports = { SoftwareInstallerService }; 
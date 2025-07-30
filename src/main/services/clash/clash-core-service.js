const path = require("path");
const fs = require("fs");
const { writeFile, access } = require("fs/promises");
const { spawn } = require("child_process");
const logger = require('../../utils/logger');
const { createError, withErrorHandling } = require('../../utils/error-handler');
const { createHttpClient } = require('../../utils/http-client');

class ClashCoreService {
  /**
   * 创建 Clash 核心服务实例
   * @param {Object} options 配置选项
   * @param {string} options.clashCorePath Clash 核心路径
   */
  constructor(options = {}) {
    this.clashCorePath = options.clashCorePath || path.join(__dirname, "../../../core/clash/clash-core.exe");
    this.clashProcess = null;
  }

  /**
   * 检查并下载核心
   */
  async checkAndDownloadCore() {
    try {
      await access(this.clashCorePath);
    } catch (error) {
      try {
        await this.downloadMihomoCore(this.clashCorePath);
      } catch (downloadError) {
        throw new Error("Mihomo 核心下载失败");
      }
    }
  }

  /**
   * 下载Mihomo核心
   * @param {string} targetPath 目标路径
   */
  async downloadMihomoCore(targetPath) {
    const version = "v1.19.10";
    const zipFilePath = path.join(path.dirname(targetPath), "mihomo.zip");
    const downloadUrl = `https://github.com/MetaCubeX/mihomo/releases/download/${version}/mihomo-windows-amd64-${version}.zip`;

    logger.info('开始下载Mihomo核心', { version, targetPath, downloadUrl });

    const httpClient = createHttpClient({
      timeout: 30000,
      responseType: 'arraybuffer',
      onError: (error) => {
        logger.error('下载Mihomo核心失败', { url: downloadUrl, error: error.message });
        return Promise.reject(error);
      }
    });

    try {
      const response = await httpClient.get(downloadUrl);
      await writeFile(zipFilePath, Buffer.from(response.data));
      logger.info('Mihomo核心下载完成，开始解压', { zipFilePath });

      const AdmZip = require("adm-zip");
      const zip = new AdmZip(zipFilePath);
      zip.extractAllTo(path.dirname(targetPath), true);
      logger.info('Mihomo核心解压完成', { extractPath: path.dirname(targetPath) });

      // 清理临时zip文件
      await fs.promises.unlink(zipFilePath);
      logger.info('临时zip文件已清理', { zipFilePath });
    } catch (error) {
      logger.error('下载或解压Mihomo核心失败', { error: error.message, stack: error.stack });
      throw createError(error, 'ClashCoreService.downloadMihomoCore', { targetPath, downloadUrl });
    }
  }

  /**
   * 启动Mihomo
   * @param {string} configPath 配置文件路径
   */
  async startMihomo(configPath) {
    logger.info('准备启动Mihomo核心', { configPath, corePath: this.clashCorePath });

    if (!configPath) {
      logger.error('启动Mihomo失败：未指定配置文件路径');
      throw createError('未指定配置文件路径', 'ClashCoreService.startMihomo');
    }
    if (!this.clashCorePath) {
      logger.error('启动Mihomo失败：未指定Mihomo核心路径');
      throw createError('未指定 Mihomo 核心路径', 'ClashCoreService.startMihomo');
    }
    if (this.clashProcess) {
      logger.warn('Mihomo核心已在运行，跳过启动');
      return;
    }

    try {
      this.clashProcess = spawn(this.clashCorePath, [
        "-d",
        path.dirname(configPath),
      ], {
        stdio: ['ignore', 'pipe', 'pipe'] // 忽略stdin，捕获stdout和stderr
      });

      this.clashProcess.stdout.on("data", (data) => {
        logger.debug(`Mihomo stdout: ${data}`);
      });

      this.clashProcess.stderr.on("data", (data) => {
        logger.error(`Mihomo stderr: ${data}`);
      });

      this.clashProcess.on("close", (code) => {
        logger.info(`Mihomo核心已退出`, { exitCode: code });
        this.clashProcess = null;
      });

      this.clashProcess.on("error", (error) => {
        logger.error('Mihomo核心进程启动失败', { error: error.message });
        this.clashProcess = null;
      });

      // 等待核心初始化
      await new Promise((resolve) => setTimeout(resolve, 2000));
      logger.info('Mihomo核心启动成功');
    } catch (error) {
      logger.error('启动Mihomo核心时发生异常', { error: error.message, stack: error.stack });
      throw createError(error, 'ClashCoreService.startMihomo', { configPath });
    }
  }

  /**
   * 停止Mihomo
   */
  async stopMihomo() {
    logger.info('准备停止Mihomo核心');

    if (!this.clashProcess) {
      logger.warn('Mihomo核心未运行，无需停止');
      return;
    }

    try {
      // 尝试优雅关闭
      this.clashProcess.kill("SIGTERM");
      logger.debug('已发送SIGTERM信号');

      // 等待1秒
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 检查进程是否已退出
      if (this.clashProcess && !this.clashProcess.killed) {
        logger.warn('Mihomo核心未响应SIGTERM，发送SIGKILL强制终止');
        this.clashProcess.kill("SIGKILL");
      } else {
        logger.info('Mihomo核心已优雅关闭');
      }
    } catch (error) {
      logger.error('停止Mihomo核心时发生异常', { error: error.message, stack: error.stack });
      throw createError(error, 'ClashCoreService.stopMihomo');
    } finally {
      this.clashProcess = null;
    }
  }
}

module.exports = ClashCoreService;

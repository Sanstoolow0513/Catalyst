const path = require("path");
const yaml = require("js-yaml");
const zlib = require("zlib");
const fs = require("fs");
const { readFile, writeFile, access } = require("fs/promises");
const { spawn } = require("child_process");
const logger = require('../../utils/logger');
const { createError } = require('../../utils/error-handler');
const { createHttpClient } = require('../../utils/http-client');

class ClashCoreService {
  constructor(options = {}, mainWindow) {
    this.mainWindow = mainWindow;
    this.configBaseDir = options.configBaseDir;
    this.clashCorePath = options.clashCorePath;
    this.currentConfigPath = null;
    this.clashProcess = null;
    this.clashConfig = null;
    this.externalController = null;
    this.httpClient = createHttpClient({ timeout: 5000 });

    logger.info('ClashCoreService 初始化完成', {
      configBaseDir: this.configBaseDir,
      clashCorePath: this.clashCorePath
    });
  }

  async decompressGzFile(gzFilePath, outputFilePath) {
    return new Promise((resolve, reject) => {
      const input = fs.createReadStream(gzFilePath);
      const output = fs.createWriteStream(outputFilePath);
      const gunzip = zlib.createGunzip();

      input.pipe(gunzip).pipe(output);

      output.on("finish", () => {
        resolve();
      });

      output.on("error", (error) => {
        reject(error);
      });
    });
  }

  async initialize(configManager) {
    logger.info('开始初始化ClashCoreService');
    try {
      await this.checkAndDownloadCore();
      await this.ensureConfigIsLoaded(configManager);
      logger.info('ClashCoreService 初始化成功');
    } catch (error) {
      logger.error('ClashCoreService 初始化失败', { error: error.message, stack: error.stack });
      throw createError(error, 'ClashCoreService.initialize');
    }
  }

  async ensureConfigIsLoaded(configManager) {
    if (this.clashConfig) return;

    await configManager.downloadConfigFromUrl();
    this.currentConfigPath = configManager.getCurrentConfigPath();

    if (this.currentConfigPath) {
      await this.loadConfig(this.currentConfigPath);
    }

    if (!this.clashConfig) {
      throw new Error("无法加载或找到有效的配置文件。");
    }
  }

  async checkAndDownloadCore() {
    logger.info('检查并下载Mihomo核心');
    try {
      await access(this.clashCorePath);
      logger.debug('Mihomo核心已存在', { path: this.clashCorePath });
    } catch (error) {
      logger.info('Mihomo核心不存在，开始下载');
      try {
        await this.downloadMihomoCore(this.clashCorePath);
        logger.info('Mihomo核心下载成功');
      } catch (downloadError) {
        logger.error('Mihomo核心下载失败', { 
          error: downloadError.message, 
          stack: downloadError.stack 
        });
        throw createError('Mihomo 核心下载失败', 'ClashCoreService.checkAndDownloadCore', { 
          path: this.clashCorePath 
        });
      }
    }
  }

  async downloadMihomoCore(targetPath) {
    const version = "v1.19.10";
    const targetDir = path.dirname(targetPath);
    await fs.promises.mkdir(targetDir, { recursive: true });
    const zipFilePath = path.join(targetDir, "mihomo.zip");
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

      await fs.promises.unlink(zipFilePath);
      logger.info('临时zip文件已清理', { zipFilePath });
    } catch (error) {
      logger.error('下载或解压Mihomo核心失败', { error: error.message, stack: error.stack });
      throw createError(error, 'ClashCoreService.downloadMihomoCore', { 
        targetPath, 
        downloadUrl 
      });
    }
  }

  async loadConfig(configPath) {
    try {
      const configContent = await readFile(configPath, "utf-8");
      this.clashConfig = yaml.load(configContent);
      this.externalController = this.clashConfig["external-controller"];
      return this.clashConfig;
    } catch (error) {
      throw error;
    }
  }

  async startMihomo() {
    logger.info('准备启动Mihomo核心', { configPath: this.currentConfigPath, corePath: this.clashCorePath });

    if (!this.currentConfigPath) {
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
        path.dirname(this.currentConfigPath),
      ], {
        stdio: ['ignore', 'pipe', 'pipe']
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

      await new Promise((resolve) => setTimeout(resolve, 2000));
      logger.info('Mihomo核心启动成功');
    } catch (error) {
      logger.error('启动Mihomo核心时发生异常', { error: error.message, stack: error.stack });
      throw createError(error, 'ClashCoreService.startMihomo', { 
        configPath: this.currentConfigPath 
      });
    }
  }

  async stopMihomo() {
    logger.info('准备停止Mihomo核心');

    if (!this.clashProcess) {
      logger.warn('Mihomo核心未运行，无需停止');
      return;
    }

    try {
      this.clashProcess.kill("SIGTERM");
      logger.debug('已发送SIGTERM信号');

      await new Promise((resolve) => setTimeout(resolve, 1000));

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
const path = require("path");
const yaml = require("js-yaml");
const zlib = require("zlib");
const fs = require("fs");
const { readFile, writeFile, access } = require("fs/promises");
const { spawn } = require("child_process");
const { ProxyManager } = require("./proxy-setting");
const { ConfigManager } = require("../config-manager");
const logger = require('../../utils/logger');
const { createError, withErrorHandling } = require('../../utils/error-handler');
const { createHttpClient } = require('../../utils/http-client');

class ClashService {
  /**
   * 创建 Clash 服务实例
   * @param {Object} options 配置选项
   * @param {string} options.configBaseDir 配置基础目录
   * @param {string} options.clashCorePath Clash 核心路径
   * @param {string} options.PROXY_SERVER 代理服务器地址
   * @param {string} options.PROXY_OVERRIDE 代理例外列表
   */
  constructor(options = {}, mainWindow) {
    this.mainWindow = mainWindow;
    this.configBaseDir = options.configBaseDir;
    this.clashCorePath = options.clashCorePath;
    this.currentConfigPath = null;
    this.PROXY_SERVER = options.PROXY_SERVER;
    this.PROXY_OVERRIDE = options.PROXY_OVERRIDE;
    this.clashProcess = null;
    this.clashConfig = null;
    this.externalController = null;
    this.httpClient = createHttpClient({ timeout: 5000 }); // 用于与Clash API通信

    this.proxyManager = new ProxyManager(options);
    this.configManager = new ConfigManager(options);

    logger.info('ClashService 初始化完成', {
      configBaseDir: this.configBaseDir,
      clashCorePath: this.clashCorePath,
      proxyServer: this.PROXY_SERVER
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

  async initialize() {
    logger.info('开始初始化ClashService');
    try {
      await this.checkAndDownloadCore();
      await this.ensureConfigIsLoaded();
      logger.info('ClashService 初始化成功');
    } catch (error) {
      logger.error('ClashService 初始化失败', { error: error.message, stack: error.stack });
      throw createError(error, 'ClashService.initialize');
    }
  }

  async ensureConfigIsLoaded() {
    if (this.clashConfig) {
      return;
    }

    await this.configManager.downloadConfigFromUrl();
    this.currentConfigPath = this.configManager.getCurrentConfigPath();

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
        logger.error('Mihomo核心下载失败', { error: downloadError.message, stack: downloadError.stack });
        throw createError('Mihomo 核心下载失败', 'ClashService.checkAndDownloadCore', { path: this.clashCorePath });
      }
    }
  }

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
      throw createError(error, 'ClashService.downloadMihomoCore', { targetPath, downloadUrl });
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
      throw createError('未指定配置文件路径', 'ClashService.startMihomo');
    }
    if (!this.clashCorePath) {
      logger.error('启动Mihomo失败：未指定Mihomo核心路径');
      throw createError('未指定 Mihomo 核心路径', 'ClashService.startMihomo');
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
      throw createError(error, 'ClashService.startMihomo', { configPath: this.currentConfigPath });
    }
  }

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
      throw createError(error, 'ClashService.stopMihomo');
    } finally {
      this.clashProcess = null;
    }
  }

  async clearSystemProxy() {
    logger.info('准备清除系统代理');
    try {
      const result = await this.proxyManager.clearSystemProxy();
      logger.info('系统代理清除操作完成', { success: result });
      return result;
    } catch (error) {
      logger.error('清除系统代理时发生错误', { error: error.message, stack: error.stack });
      throw createError(error, 'ClashService.clearSystemProxy');
    }
  }

  async setSystemProxy() {
    logger.info('准备设置系统代理', { proxyServer: this.PROXY_SERVER, proxyOverride: this.PROXY_OVERRIDE });
    try {
      const result = await this.proxyManager.setSystemProxy(this.PROXY_SERVER, this.PROXY_OVERRIDE);
      logger.info('系统代理设置操作完成', { success: result, proxyServer: this.PROXY_SERVER });
      return result;
    } catch (error) {
      logger.error('设置系统代理时发生错误', { proxyServer: this.PROXY_SERVER, proxyOverride: this.PROXY_OVERRIDE, error: error.message, stack: error.stack });
      throw createError(error, 'ClashService.setSystemProxy', { proxyServer: this.PROXY_SERVER, proxyOverride: this.PROXY_OVERRIDE });
    }
  }

  async getProxyList() {
    logger.info('开始获取代理列表');
    try {
      await this.ensureConfigIsLoaded();

      const proxyGroups = this.clashConfig["proxy-groups"];
      if (!proxyGroups || !Array.isArray(proxyGroups)) {
        logger.warn('配置中未找到有效的代理组');
        return [];
      }

      const result = proxyGroups
        .filter((group) => group.type === "select" || group.type === "selector")
        .map((group) => ({
          name: group.name,
          type: group.type,
          current: group.proxies ? group.proxies[0] || "" : "",
          options: group.proxies || [],
        }));

      logger.debug('已从配置文件获取代理组', { count: result.length });

      // 如果核心正在运行，尝试从API获取实时状态
      if (this.clashProcess && this.externalController) {
        try {
          const url = `http://${this.externalController}/proxies`;
          logger.debug('尝试从Clash API获取实时代理状态', { url });
          const response = await this.httpClient.get(url);
          const liveProxies = response.data.proxies;

          for (const group of result) {
            if (liveProxies[group.name] && liveProxies[group.name].now) {
              group.current = liveProxies[group.name].now;
            }
          }
          logger.debug('已从API更新代理组的实时状态');
        } catch (apiError) {
          logger.warn('无法从Clash API获取实时状态，将使用配置文件中的默认值', { error: apiError.message });
          // API调用失败，继续使用配置文件中的默认值
        }
      }

      logger.info('代理列表获取成功', { count: result.length });
      return result;
    } catch (error) {
      logger.error('获取代理列表时发生错误', { error: error.message, stack: error.stack });
      throw createError(error, 'ClashService.getProxyList');
    }
  }

  async testProxyLatency(proxyName) {
    logger.info('开始测试代理延迟', { proxyName, externalController: this.externalController });

    if (!this.externalController) {
      logger.error('测试代理延迟失败：未配置外部控制器地址');
      throw createError('未配置外部控制器地址', 'ClashService.testProxyLatency');
    }

    try {
      const url = `http://${this.externalController}/proxies/${encodeURIComponent(proxyName)}/delay`;
      const params = {
        timeout: 5000,
        url: "http://www.gstatic.com/generate_204",
      };
      logger.debug('发送延迟测试请求', { url, params });
      const response = await this.httpClient.get(url, { params });
      const delay = response.data.delay;
      logger.info('代理延迟测试成功', { proxyName, delay });
      return delay;
    } catch (error) {
      logger.warn('代理延迟测试失败', { proxyName, error: error.message });
      return -1;
    }
  }

  async switchProxy(groupName, proxyName) {
    logger.info('开始切换代理', { groupName, proxyName, externalController: this.externalController });

    if (!this.externalController) {
      logger.error('切换代理失败：未配置外部控制器地址');
      throw createError('未配置外部控制器地址', 'ClashService.switchProxy');
    }

    try {
      const url = `http://${this.externalController}/proxies/${encodeURIComponent(groupName)}`;
      logger.debug('发送代理切换请求', { url, proxyName });
      await this.httpClient.put(url, { name: proxyName });
      logger.info('代理切换成功', { groupName, proxyName });
      return true;
    } catch (error) {
      logger.error('代理切换失败', { groupName, proxyName, error: error.message, stack: error.stack });
      return false;
    }
  }

  async getCurrentProxy(groupName) {
    logger.info('开始获取当前代理', { groupName, externalController: this.externalController });

    if (!this.externalController) {
      logger.error('获取当前代理失败：未配置外部控制器地址');
      throw createError('未配置外部控制器地址', 'ClashService.getCurrentProxy');
    }

    try {
      const url = `http://${this.externalController}/proxies/${encodeURIComponent(groupName)}`;
      logger.debug('发送获取当前代理请求', { url });
      const response = await this.httpClient.get(url);
      const currentProxy = response.data.now;
      logger.info('获取当前代理成功', { groupName, currentProxy });
      return currentProxy;
    } catch (error) {
      logger.error('获取当前代理时发生错误', { groupName, error: error.message, stack: error.stack });
      throw createError(error, 'ClashService.getCurrentProxy', { groupName });
    }
  }
}

module.exports = ClashService;

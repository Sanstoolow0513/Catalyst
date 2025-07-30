const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { mkdir, readFile, writeFile } = require("fs/promises");
const logger = require('../../utils/logger');
const { createError, withErrorHandling } = require('../../utils/error-handler');
const { createHttpClient } = require('../../utils/http-client');

class ClashConfigService {
  /**
   * 创建 Clash 配置服务实例
   * @param {Object} options 配置选项
   * @param {string} options.configBaseDir 配置基础目录
   */
  constructor(options = {}) {
    this.configBaseDir = options.configBaseDir;
    this.urlFilePath = path.join(options.configDir, "config_sources.yaml");
    this.currentConfigPath = null;
    logger.info('ClashConfigService 初始化完成', { configBaseDir: this.configBaseDir, urlFilePath: this.urlFilePath });
  }

  /**
   * 获取当前配置路径
   * @returns {string|null} 当前配置文件路径
   */
  getCurrentConfigPath() {
    return this.currentConfigPath;
  }

  /**
   * 从URL下载配置
   */
  async downloadConfigFromUrl() {
    logger.info('开始下载配置文件');

    try {
      await mkdir(this.configBaseDir, { recursive: true });
      logger.debug('配置基础目录已创建或存在', { configBaseDir: this.configBaseDir });

      // 读取配置源文件
      try {
        await fs.promises.access(this.urlFilePath);
      } catch (err) {
        logger.warn('配置源文件不存在', { filePath: this.urlFilePath });
        throw createError('配置源文件不存在，请先添加配置URL。', 'ClashConfigService.downloadConfigFromUrl', { filePath: this.urlFilePath });
      }

      const urlListContent = await readFile(this.urlFilePath, "utf-8");
      const availableUrls = urlListContent
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (availableUrls.length === 0) {
        logger.error('配置源文件中未找到有效的URL');
        throw createError('未找到有效的配置文件URL', 'ClashConfigService.downloadConfigFromUrl');
      }

      const selectedConfigUrl = availableUrls[0];
      logger.info('选择配置URL进行下载', { selectedConfigUrl });

      // 为URL创建一个唯一的目录名
      const encodedUrlHash = Buffer.from(selectedConfigUrl)
        .toString("base64")
        .replace(/[\\/:*?"<>|]/g, "_");
      const configDirectory = path.join(this.configBaseDir, encodedUrlHash);
      const downloadedConfigPath = path.join(configDirectory, "config.yaml");

      await mkdir(configDirectory, { recursive: true });
      logger.debug('配置文件存储目录已创建', { configDirectory });

      // 使用统一的HTTP客户端
      const httpClient = createHttpClient({
        timeout: 15000,
        responseType: 'text',
        onError: (error) => {
          logger.error('下载配置文件失败', { url: selectedConfigUrl, error: error.message });
          return Promise.reject(error);
        }
      });

      logger.info('开始HTTP请求下载配置文件', { url: selectedConfigUrl });
      const response = await httpClient.get(selectedConfigUrl);
      await writeFile(downloadedConfigPath, response.data);
      logger.info('配置文件下载并保存成功', { savedPath: downloadedConfigPath });

      this.currentConfigPath = downloadedConfigPath;
      return this.currentConfigPath;
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        logger.error('下载配置文件超时', { url: error.config?.url });
        throw createError('获取配置文件超时，请检查URL是否有效。', 'ClashConfigService.downloadConfigFromUrl', { url: error.config?.url });
      }
      logger.error('下载配置文件时发生未知错误', { error: error.message, stack: error.stack });
      throw createError(error, 'ClashConfigService.downloadConfigFromUrl');
    }
  }

  /**
   * 加载配置文件
   * @param {string} configPath 配置文件路径
   */
  async loadConfig(configPath) {
    logger.info('开始加载配置文件', { configPath });

    try {
      await fs.promises.access(configPath);
      const configContent = await readFile(configPath, "utf-8");
      const config = yaml.load(configContent);
      logger.info('配置文件加载成功', { configPath });
      return config;
    } catch (error) {
      if (error.code === 'ENOENT') {
        logger.error('加载配置文件失败：文件不存在', { configPath });
        throw createError(`配置文件不存在: ${configPath}`, 'ClashConfigService.loadConfig', { configPath });
      }
      logger.error('加载配置文件时发生错误', { configPath, error: error.message, stack: error.stack });
      throw createError(error, 'ClashConfigService.loadConfig', { configPath });
    }
  }

  /**
   * 保存用户配置
   * @param {Object} config 配置对象
   */
  async saveUserConfig(config) {
    logger.info('开始保存用户配置', { filePath: this.urlFilePath });

    try {
      const yamlContent = yaml.dump(config);
      await writeFile(this.urlFilePath, yamlContent, "utf-8");
      logger.info('用户配置保存成功', { filePath: this.urlFilePath });
    } catch (error) {
      logger.error('保存用户配置失败', { filePath: this.urlFilePath, error: error.message, stack: error.stack });
      throw createError(error, 'ClashConfigService.saveUserConfig', { filePath: this.urlFilePath });
    }
  }

  /**
   * 保存URL到文件
   * @param {string} url URL
   */
  async saveUrlToFile(url) {
    logger.info('开始保存配置URL', { url, filePath: this.urlFilePath });

    try {
      await writeFile(this.urlFilePath, url.trim() + "\n", "utf-8");
      logger.info('配置URL保存成功', { url, filePath: this.urlFilePath });
    } catch (error) {
      logger.error('保存配置URL失败', { url, filePath: this.urlFilePath, error: error.message, stack: error.stack });
      throw createError(error, 'ClashConfigService.saveUrlToFile', { url, filePath: this.urlFilePath });
    }
  }

  /**
   * 获取URL列表
   * @returns {Array<string>} URL列表
   */
  async getUrlList() {
    logger.info('开始获取配置URL列表', { filePath: this.urlFilePath });

    try {
      await fs.promises.access(this.urlFilePath);
      const content = await readFile(this.urlFilePath, "utf-8");
      const urls = content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      logger.info('配置URL列表获取成功', { count: urls.length });
      return urls;
    } catch (error) {
      if (error.code === 'ENOENT') {
        logger.info('配置URL文件不存在，返回空列表', { filePath: this.urlFilePath });
        return [];
      }
      logger.error('获取配置URL列表失败', { filePath: this.urlFilePath, error: error.message, stack: error.stack });
      throw createError(error, 'ClashConfigService.getUrlList', { filePath: this.urlFilePath });
    }
  }
}

module.exports = ClashConfigService;
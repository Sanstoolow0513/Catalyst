const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { mkdir, readFile, writeFile } = require('fs/promises');
const logger = require('../utils/logger');
const { createError, handleGlobalError } = require('../utils/error-handler');

// 应用默认配置
const DEFAULT_APP_CONFIG = {
  PROXY_SERVER: '127.0.0.1:7890',
  PROXY_OVERRIDE: 'localhost;127.*;10.*;172.16.*;172.17.*;172.18.*;172.19.*;172.20.*;172.21.*;172.22.*;172.23.*;172.24.*;172.25.*;172.26.*;172.27.*;172.28.*;172.29.*;172.30.*;172.31.*;192.168.*',
  APP_VERSION: '1.0.0',
  APP_NAME: '多功能系统工具',
  RESOURCE_PATHS: {
    CLASH_CONFIG_DIR: 'resources/clash/configs',
    CLASH_CORE_DIR: 'resources/clash/core',
    INSTALLERS_DIR: 'resources/installers',
  },
  DEFAULT_WINDOW_CONFIG: {
    width: 850,
    height: 750,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      devTools: true,
    },
  },
};

class ConfigManager {
  /**
   * 创建配置管理器实例
   * @param {Object} options 配置选项
   * @param {string} options.appDataPath 应用数据存储路径
   * @param {string} options.configDir 用户配置目录
   */
  constructor(options = {}) {
    this.appDataPath = options.appDataPath || path.join(__dirname, '../../Appdata');
    this.configDir = options.configDir || path.join(this.appDataPath, 'config');
    this.userConfigPath = path.join(this.configDir, 'user-config.yaml');
    this.appConfigPath = path.join(this.configDir, 'app-config.yaml');
    this.configSourcesPath = path.join(this.configDir, 'config_sources.yaml');
    this.currentConfigPath = null;

    // 确保配置目录存在
    this.ensureConfigDir();
  }

  /**
   * 确保配置目录存在
   */
  async ensureConfigDir() {
    try {
      await mkdir(this.configDir, { recursive: true });
      logger.info(`配置目录已准备就绪: ${this.configDir}`);
    } catch (error) {
      logger.error('创建配置目录失败', { configDir: this.configDir }, error);
      throw createError(error, 'ConfigManager.ensureConfigDir', { configDir: this.configDir });
    }
  }

  /**
   * 加载应用配置
   * @returns {Object} 应用配置对象
   */
  async loadAppConfig() {
    try {
      let appConfig = { ...DEFAULT_APP_CONFIG };

      // 尝试从文件加载用户覆盖的配置
      try {
        await fs.promises.access(this.appConfigPath);
        const fileContent = await readFile(this.appConfigPath, 'utf-8');
        const fileConfig = yaml.load(fileContent) || {};
        appConfig = { ...appConfig, ...fileConfig };
        logger.info('应用配置已从文件加载');
      } catch (err) {
        // 文件不存在或读取失败，使用默认配置
        logger.info('应用配置文件不存在或读取失败，使用默认配置');
      }

      return appConfig;
    } catch (error) {
      logger.error('加载应用配置失败', null, error);
      throw createError(error, 'ConfigManager.loadAppConfig');
    }
  }

  /**
   * 保存用户配置到文件
   * @param {Object} config 用户配置对象
   */
  async saveUserConfig(config) {
    try {
      await this.ensureConfigDir();
      const yamlContent = yaml.dump(config);
      await writeFile(this.userConfigPath, yamlContent, 'utf-8');
      logger.info('用户配置已保存');
    } catch (error) {
      logger.error('保存用户配置失败', { filePath: this.userConfigPath }, error);
      throw createError(error, 'ConfigManager.saveUserConfig', { filePath: this.userConfigPath });
    }
  }

  /**
   * 加载用户配置
   * @returns {Object} 用户配置对象
   */
  async loadUserConfig() {
    try {
      await fs.promises.access(this.userConfigPath);
      const configContent = await readFile(this.userConfigPath, 'utf-8');
      const config = yaml.load(configContent) || {};
      logger.info('用户配置已加载');
      return config;
    } catch (error) {
      if (error.code === 'ENOENT') {
        logger.info('用户配置文件不存在，返回空配置');
        return {};
      }
      logger.error('加载用户配置失败', { filePath: this.userConfigPath }, error);
      throw createError(error, 'ConfigManager.loadUserConfig', { filePath: this.userConfigPath });
    }
  }

  /**
   * 保存配置源URL到文件
   * @param {string} url 配置源URL
   */
  async saveConfigSource(url) {
    try {
      await this.ensureConfigDir();
      await writeFile(this.configSourcesPath, url.trim() + '\n', 'utf-8');
      logger.info('配置源URL已保存');
    } catch (error) {
      logger.error('保存配置源URL失败', { filePath: this.configSourcesPath }, error);
      throw createError(error, 'ConfigManager.saveConfigSource', { filePath: this.configSourcesPath });
    }
  }

  /**
   * 获取配置源URL列表
   * @returns {Array<string>} URL列表
   */
  async getConfigSources() {
    try {
      await fs.promises.access(this.configSourcesPath);
      const content = await readFile(this.configSourcesPath, 'utf-8');
      const urls = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      logger.info('配置源URL列表已获取', { count: urls.length });
      return urls;
    } catch (error) {
      if (error.code === 'ENOENT') {
        logger.info('配置源URL文件不存在，返回空列表');
        return [];
      }
      logger.error('获取配置源URL列表失败', { filePath: this.configSourcesPath }, error);
      throw createError(error, 'ConfigManager.getConfigSources', { filePath: this.configSourcesPath });
    }
  }

  /**
   * 下载配置文件
   * @param {string} url 配置文件URL
   * @returns {string} 下载的配置文件路径
   */
  async downloadConfig(url) {
    try {
      const { createHttpClient } = require('../utils/http-client');
      const httpClient = createHttpClient({
        timeout: 15000,
        onError: (error) => {
          logger.error('HTTP请求失败', { url, method: error.config?.method }, error);
          return Promise.reject(error);
        }
      });

      // 为URL创建一个唯一的目录名
      const encodedUrlHash = Buffer.from(url).toString('base64').replace(/[\\/:*?"<>|]/g, '_');
      const configDirectory = path.join(this.configDir, 'configs', encodedUrlHash);
      const downloadedConfigPath = path.join(configDirectory, 'config.yaml');

      await mkdir(configDirectory, { recursive: true });

      logger.info('开始下载配置文件', { url, targetPath: downloadedConfigPath });
      const response = await httpClient.get(url, { responseType: 'text' });
      await writeFile(downloadedConfigPath, response.data);
      this.currentConfigPath = downloadedConfigPath;
      logger.info('配置文件下载成功', { url, savedPath: downloadedConfigPath });
      return downloadedConfigPath;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        logger.error('下载配置文件超时', { url });
        throw createError('获取配置文件超时，请检查URL是否有效。', 'ConfigManager.downloadConfig', { url });
      }
      logger.error('下载配置文件失败', { url }, error);
      throw createError(error, 'ConfigManager.downloadConfig', { url });
    }
  }

  /**
   * 获取当前配置文件路径
   * @returns {string|null} 当前配置文件路径
   */
  getCurrentConfigPath() {
    return this.currentConfigPath;
  }
}

module.exports = { ConfigManager };

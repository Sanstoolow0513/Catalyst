const logger = require('../../utils/logger');
const ClashCoreService = require('./ClashCoreService');
const ProxyService = require('./ProxyService');
const { ConfigManager } = require('../config-manager');

/**
 * Clash协调服务层
 * 负责整合核心服务和代理服务，提供统一接口
 */
class ClashService {
  constructor(options = {}, mainWindow) {
    this.mainWindow = mainWindow;
    
    // 创建配置管理器
    this.configManager = new ConfigManager({
      appDataPath: options.appDataPath,
      configDir: options.configDir
    });

    // 创建核心服务
    this.coreService = new ClashCoreService({
      configBaseDir: options.configBaseDir,
      clashCorePath: options.clashCorePath
    }, mainWindow);

    // 创建代理服务
    this.proxyService = new ProxyService({
      PROXY_SERVER: options.PROXY_SERVER,
      PROXY_OVERRIDE: options.PROXY_OVERRIDE
    }, this.coreService);

    logger.info('Clash协调服务初始化完成', {
      configBaseDir: options.configBaseDir,
      clashCorePath: options.clashCorePath,
      proxyServer: options.PROXY_SERVER
    });
  }

  async initialize() {
    logger.info('开始初始化Clash协调服务');
    try {
      // 初始化配置管理器
      await this.configManager.initialize();
      
      // 初始化核心服务
      await this.coreService.initialize(this.configManager);
      
      logger.info('Clash协调服务初始化成功');
    } catch (error) {
      logger.error('Clash协调服务初始化失败', { error: error.message, stack: error.stack });
      throw error;
    }
  }

  // 核心服务方法代理
  async startMihomo() {
    return this.coreService.startMihomo();
  }

  async stopMihomo() {
    return this.coreService.stopMihomo();
  }

  // 代理服务方法代理
  async clearSystemProxy() {
    return this.proxyService.clearSystemProxy();
  }

  async setSystemProxy() {
    return this.proxyService.setSystemProxy();
  }

  async getProxyList() {
    return this.proxyService.getProxyList();
  }

  async testProxyLatency(proxyName) {
    return this.proxyService.testProxyLatency(proxyName);
  }

  async switchProxy(groupName, proxyName) {
    return this.proxyService.switchProxy(groupName, proxyName);
  }

  async getCurrentProxy(groupName) {
    return this.proxyService.getCurrentProxy(groupName);
  }
}

module.exports = ClashService;

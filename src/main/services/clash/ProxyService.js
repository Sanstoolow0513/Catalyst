const logger = require('../../utils/logger');
const { createError } = require('../../utils/error-handler');
const { createHttpClient } = require('../../utils/http-client');
const { ProxyManager } = require("./proxy-setting");

class ProxyService {
  constructor(options = {}, coreService) {
    this.coreService = coreService;
    this.PROXY_SERVER = options.PROXY_SERVER;
    this.PROXY_OVERRIDE = options.PROXY_OVERRIDE;
    this.proxyManager = new ProxyManager(options);
    this.httpClient = createHttpClient({ timeout: 5000 });

    logger.info('ProxyService 初始化完成', {
      proxyServer: this.PROXY_SERVER,
      proxyOverride: this.PROXY_OVERRIDE
    });
  }

  async clearSystemProxy() {
    logger.info('准备清除系统代理');
    try {
      const result = await this.proxyManager.clearSystemProxy();
      logger.info('系统代理清除操作完成', { success: result });
      return result;
    } catch (error) {
      logger.error('清除系统代理时发生错误', { error: error.message, stack: error.stack });
      throw createError(error, 'ProxyService.clearSystemProxy');
    }
  }

  async setSystemProxy() {
    logger.info('准备设置系统代理', { proxyServer: this.PROXY_SERVER, proxyOverride: this.PROXY_OVERRIDE });
    try {
      const result = await this.proxyManager.setSystemProxy(this.PROXY_SERVER, this.PROXY_OVERRIDE);
      logger.info('系统代理设置操作完成', { success: result, proxyServer: this.PROXY_SERVER });
      return result;
    } catch (error) {
      logger.error('设置系统代理时发生错误', { 
        proxyServer: this.PROXY_SERVER, 
        proxyOverride: this.PROXY_OVERRIDE, 
        error: error.message, 
        stack: error.stack 
      });
      throw createError(error, 'ProxyService.setSystemProxy', { 
        proxyServer: this.PROXY_SERVER, 
        proxyOverride: this.PROXY_OVERRIDE 
      });
    }
  }

  async getProxyList() {
    logger.info('开始获取代理列表');
    try {
      const config = this.coreService.clashConfig;
      const proxyGroups = config["proxy-groups"];
      
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
      if (this.coreService.clashProcess && this.coreService.externalController) {
        try {
          const url = `http://${this.coreService.externalController}/proxies`;
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
        }
      }

      logger.info('代理列表获取成功', { count: result.length });
      return result;
    } catch (error) {
      logger.error('获取代理列表时发生错误', { error: error.message, stack: error.stack });
      throw createError(error, 'ProxyService.getProxyList');
    }
  }

  async testProxyLatency(proxyName) {
    logger.info('开始测试代理延迟', { 
      proxyName, 
      externalController: this.coreService.externalController 
    });

    if (!this.coreService.externalController) {
      logger.error('测试代理延迟失败：未配置外部控制器地址');
      throw createError('未配置外部控制器地址', 'ProxyService.testProxyLatency');
    }

    try {
      const url = `http://${this.coreService.externalController}/proxies/${encodeURIComponent(proxyName)}/delay`;
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
    logger.info('开始切换代理', { 
      groupName, 
      proxyName, 
      externalController: this.coreService.externalController 
    });

    if (!this.coreService.externalController) {
      logger.error('切换代理失败：未配置外部控制器地址');
      throw createError('未配置外部控制器地址', 'ProxyService.switchProxy');
    }

    try {
      const url = `http://${this.coreService.externalController}/proxies/${encodeURIComponent(groupName)}`;
      logger.debug('发送代理切换请求', { url, proxyName });
      await this.httpClient.put(url, { name: proxyName });
      logger.info('代理切换成功', { groupName, proxyName });
      return true;
    } catch (error) {
      logger.error('代理切换失败', { 
        groupName, 
        proxyName, 
        error: error.message, 
        stack: error.stack 
      });
      return false;
    }
  }

  async getCurrentProxy(groupName) {
    logger.info('开始获取当前代理', { 
      groupName, 
      externalController: this.coreService.externalController 
    });

    if (!this.coreService.externalController) {
      logger.error('获取当前代理失败：未配置外部控制器地址');
      throw createError('未配置外部控制器地址', 'ProxyService.getCurrentProxy');
    }

    try {
      const url = `http://${this.coreService.externalController}/proxies/${encodeURIComponent(groupName)}`;
      logger.debug('发送获取当前代理请求', { url });
      const response = await this.httpClient.get(url);
      const currentProxy = response.data.now;
      logger.info('获取当前代理成功', { groupName, currentProxy });
      return currentProxy;
    } catch (error) {
      logger.error('获取当前代理时发生错误', { 
        groupName, 
        error: error.message, 
        stack: error.stack 
      });
      throw createError(error, 'ProxyService.getCurrentProxy', { groupName });
    }
  }
}

module.exports = ProxyService;
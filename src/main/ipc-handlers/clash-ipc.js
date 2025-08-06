const {
  registerCoreHandlers,
  registerProxyHandlers,
  registerSystemHandlers,
  registerEventHandlers
} = require('./clash/index');
const logger = require('../utils/logger');

/**
 * 注册Clash IPC处理器（聚合模块）
 * @param {Object} clashService Clash服务实例
 */
function registerClashIPCHandlers(clashService) {
  logger.info('开始注册Clash IPC处理器');
  
  // 注册各功能模块
  registerCoreHandlers(clashService);
  registerProxyHandlers(clashService);
  registerSystemHandlers(clashService);
  registerEventHandlers(clashService);
  
  logger.info('Clash IPC处理器注册完成');
}

module.exports = { registerClashIPCHandlers };
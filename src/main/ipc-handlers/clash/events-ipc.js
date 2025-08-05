const { ipcMain } = require('electron');
const logger = require('../../utils/logger');
const { createError } = require('../../utils/error-handler');
const { CLASH_EVENTS } = require('../../../shared/ipc-events');

/**
 * Clash事件订阅IPC处理器
 * @param {Object} clashService Clash服务实例
 */
function registerEventHandlers(clashService) {
  logger.info('注册Clash事件订阅处理器');

  // 代理列表更新事件
  ipcMain.on('request-proxy-list', async (event) => {
    try {
      if (!clashService) throw createError('ClashService未初始化', 'IPC.request-proxy-list');
      const proxyList = await clashService.getProxyList();
      event.sender.send(CLASH_EVENTS.PROXY_LIST_UPDATE_PUB, proxyList);
    } catch (error) {
      logger.error('发送代理列表更新失败', error);
    }
  });
}

module.exports = { registerEventHandlers };
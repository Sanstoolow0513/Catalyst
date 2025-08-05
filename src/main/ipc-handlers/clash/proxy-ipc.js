const { ipcMain } = require('electron');
const logger = require('../../utils/logger');
const { createError } = require('../../utils/error-handler');
const { CLASH_EVENTS } = require('../../../shared/ipc-events');

/**
 * 代理管理IPC处理器
 * @param {Object} clashService Clash服务实例
 */
function registerProxyHandlers(clashService) {
  logger.info('注册代理管理处理器');

  // 获取代理列表
  ipcMain.handle(CLASH_EVENTS.GET_PROXY_LIST_REQ, async () => {
    logger.info('收到获取代理列表请求');
    try {
      if (!clashService) throw createError('ClashService未初始化', 'IPC.get-proxy-list');
      const proxyList = await clashService.getProxyList();
      return { success: true, data: proxyList };
    } catch (error) {
      logger.error('获取代理列表失败', error);
      return { success: false, message: error.message };
    }
  });

  // 切换代理
  ipcMain.handle(CLASH_EVENTS.SWITCH_PROXY_REQ, async (event, groupName, proxyName) => {
    logger.info('收到切换代理请求', { groupName, proxyName });
    try {
      if (!clashService) throw createError('ClashService未初始化', 'IPC.switch-proxy');
      const success = await clashService.switchProxy(groupName, proxyName);
      return success 
        ? { success: true, message: '代理切换成功' }
        : { success: false, message: '代理切换失败' };
    } catch (error) {
      logger.error('切换代理失败', { groupName, proxyName, error });
      return { success: false, message: error.message };
    }
  });

  // 测试代理延迟
  ipcMain.handle(CLASH_EVENTS.TEST_PROXY_LATENCY_REQ, async (event, proxyName) => {
    logger.info('收到测试代理延迟请求', { proxyName });
    try {
      if (!clashService) throw createError('ClashService未初始化', 'IPC.test-proxy-latency');
      const latency = await clashService.testProxyLatency(proxyName);
      return latency >= 0 
        ? { success: true, data: latency }
        : { success: false, message: '测试失败' };
    } catch (error) {
      logger.error('测试代理延迟失败', { proxyName, error });
      return { success: false, message: error.message };
    }
  });
}

module.exports = { registerProxyHandlers };
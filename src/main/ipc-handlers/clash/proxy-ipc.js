const { ipcMain } = require('electron');
const logger = require('../../utils/logger');
const { createError } = require('../../utils/error-handler');
const { ipcErrorMiddleware } = require('../../utils/ipc-middleware');
const { CLASH_EVENTS } = require('../../../shared/ipc-events');

/**
 * 代理管理IPC处理器
 * - 统一使用 ipcErrorMiddleware
 * - 提供旧事件名兼容：'switch-proxy'、'request-proxy-list'、'test-proxy-latency'
 * @param {Object} clashService Clash服务实例
 */
function registerProxyHandlers(clashService) {
  logger.info('注册代理管理处理器');

  // 获取代理列表
  ipcMain.handle(
    CLASH_EVENTS.GET_PROXY_LIST_REQ,
    ipcErrorMiddleware(async () => {
      logger.info('收到获取代理列表请求');
      if (!clashService) throw createError('ClashService未初始化', 'IPC.get-proxy-list');
      const proxyList = await clashService.getProxyList();
      return { list: proxyList };
    })
  );

  // 切换代理
  ipcMain.handle(
    CLASH_EVENTS.SWITCH_PROXY_REQ,
    ipcErrorMiddleware(async (event, groupName, proxyName) => {
      logger.info('收到切换代理请求', { groupName, proxyName });
      if (!clashService) throw createError('ClashService未初始化', 'IPC.switch-proxy');
      const ok = await clashService.switchProxy(groupName, proxyName);
      if (!ok) throw createError('代理切换失败', 'IPC.switch-proxy');
      return { message: '代理切换成功' };
    })
  );

  // 测试代理延迟
  ipcMain.handle(
    CLASH_EVENTS.TEST_PROXY_LATENCY_REQ,
    ipcErrorMiddleware(async (event, proxyName) => {
      logger.info('收到测试代理延迟请求', { proxyName });
      if (!clashService) throw createError('ClashService未初始化', 'IPC.test-proxy-latency');
      const latency = await clashService.testProxyLatency(proxyName);
      if (latency < 0) throw createError('测试失败', 'IPC.test-proxy-latency');
      return { latency };
    })
  );

}

module.exports = { registerProxyHandlers };
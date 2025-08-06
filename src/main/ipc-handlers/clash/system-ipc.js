const { ipcMain } = require('electron');
const logger = require('../../utils/logger');
const { createError } = require('../../utils/error-handler');
const { ipcErrorMiddleware } = require('../../utils/ipc-middleware');
const { CLASH_EVENTS } = require('../../../shared/ipc-events');

/**
 * 系统代理IPC处理器
 * - 统一使用 ipcErrorMiddleware
 * - 兼容旧事件名：'set-system-proxy'、'clear-system-proxy'
 * @param {Object} clashService Clash服务实例
 */
function registerSystemHandlers(clashService) {
  logger.info('注册系统代理处理器');

  // 设置系统代理
  ipcMain.handle(
    CLASH_EVENTS.SET_SYSTEM_PROXY_REQ,
    ipcErrorMiddleware(async () => {
      logger.info('收到设置系统代理请求');
      if (!clashService) throw createError('ClashService未初始化', 'IPC.set-system-proxy');
      const ok = await clashService.setSystemProxy();
      if (!ok) throw createError('设置失败', 'IPC.set-system-proxy');
      return { message: '系统代理已设置' };
    })
  );

  // 清除系统代理
  ipcMain.handle(
    CLASH_EVENTS.CLEAR_SYSTEM_PROXY_REQ,
    ipcErrorMiddleware(async () => {
      logger.info('收到清除系统代理请求');
      if (!clashService) throw createError('ClashService未初始化', 'IPC.clear-system-proxy');
      const ok = await clashService.clearSystemProxy();
      if (!ok) throw createError('清除失败', 'IPC.clear-system-proxy');
      return { message: '系统代理已清除' };
    })
  );

}

module.exports = { registerSystemHandlers };
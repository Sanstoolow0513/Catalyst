const { ipcMain } = require('electron');
const logger = require('../../utils/logger');
const { createError } = require('../../utils/error-handler');
const { CLASH_EVENTS } = require('../../../shared/ipc-events');

/**
 * 系统代理IPC处理器
 * @param {Object} clashService Clash服务实例
 */
function registerSystemHandlers(clashService) {
  logger.info('注册系统代理处理器');

  // 设置系统代理
  ipcMain.handle(CLASH_EVENTS.SET_SYSTEM_PROXY_REQ, async () => {
    logger.info('收到设置系统代理请求');
    try {
      if (!clashService) throw createError('ClashService未初始化', 'IPC.set-system-proxy');
      const success = await clashService.setSystemProxy();
      return success 
        ? { success: true, message: '系统代理已设置' }
        : { success: false, message: '设置失败' };
    } catch (error) {
      logger.error('设置系统代理失败', error);
      return { success: false, message: error.message };
    }
  });

  // 清除系统代理
  ipcMain.handle(CLASH_EVENTS.CLEAR_SYSTEM_PROXY_REQ, async () => {
    logger.info('收到清除系统代理请求');
    try {
      if (!clashService) throw createError('ClashService未初始化', 'IPC.clear-system-proxy');
      const success = await clashService.clearSystemProxy();
      return success 
        ? { success: true, message: '系统代理已清除' }
        : { success: false, message: '清除失败' };
    } catch (error) {
      logger.error('清除系统代理失败', error);
      return { success: false, message: error.message };
    }
  });
}

module.exports = { registerSystemHandlers };
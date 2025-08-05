const { ipcMain } = require('electron');
const logger = require('../../utils/logger');
const { createError } = require('../../utils/error-handler');
const { CLASH_EVENTS } = require('../../../shared/ipc-events');

/**
 * Clash核心控制IPC处理器
 * @param {Object} clashService Clash服务实例
 */
function registerCoreHandlers(clashService) {
  logger.info('注册Clash核心控制处理器');

  // 启动Clash核心
  ipcMain.handle(CLASH_EVENTS.START_REQ, async () => {
    logger.info('收到启动Clash请求');
    try {
      if (!clashService) throw createError('ClashService未初始化', 'IPC.start-clash');
      await clashService.startMihomo();
      return { success: true, message: 'Clash核心已启动' };
    } catch (error) {
      logger.error('启动Clash失败', error);
      return { success: false, message: error.message };
    }
  });

  // 停止Clash核心
  ipcMain.handle(CLASH_EVENTS.STOP_REQ, async () => {
    logger.info('收到停止Clash请求');
    try {
      if (!clashService) throw createError('ClashService未初始化', 'IPC.stop-clash');
      await clashService.stopMihomo();
      return { success: true, message: 'Clash核心已停止' };
    } catch (error) {
      logger.error('停止Clash失败', error);
      return { success: false, message: error.message };
    }
  });
}

module.exports = { registerCoreHandlers };
const { ipcMain } = require('electron');
const logger = require('../../utils/logger');
const { createError } = require('../../utils/error-handler');
const { ipcErrorMiddleware } = require('../../utils/ipc-middleware');
const { CLASH_EVENTS } = require('../../../shared/ipc-events');

/**
 * Clash核心控制IPC处理器
 * - 统一使用 ipcErrorMiddleware 包装，返回 { success, data?, error? }
 * - 提供对历史事件名的兼容桥接：'start-clash'、'stop-clash'
 * @param {Object} clashService Clash服务实例
 */
function registerCoreHandlers(clashService) {
  logger.info('注册Clash核心控制处理器');

  // 启动Clash核心
  ipcMain.handle(
    CLASH_EVENTS.START_REQ,
    ipcErrorMiddleware(async () => {
      logger.info('收到启动Clash请求');
      if (!clashService) throw createError('ClashService未初始化', 'IPC.start-clash');
      await clashService.startMihomo();
      return { message: 'Clash核心已启动' };
    })
  );

  // 停止Clash核心
  ipcMain.handle(
    CLASH_EVENTS.STOP_REQ,
    ipcErrorMiddleware(async () => {
      logger.info('收到停止Clash请求');
      if (!clashService) throw createError('ClashService未初始化', 'IPC.stop-clash');
      await clashService.stopMihomo();
      return { message: 'Clash核心已停止' };
    })
  );

}

module.exports = { registerCoreHandlers };
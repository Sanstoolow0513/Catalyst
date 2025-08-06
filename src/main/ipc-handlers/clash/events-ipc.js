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

  // 事件订阅相关逻辑可以添加在这里
}

module.exports = { registerEventHandlers };
const logger = require('./logger');
const { createError } = require('./error-handler');

/**
 * IPC统一错误处理中间件
 * 自动捕获异步处理函数中的错误并返回标准响应格式
 * @param {Function} handler IPC事件处理函数
 * @returns {Function} 封装后的处理函数
 */
function ipcErrorMiddleware(handler) {
  return async function(event, ...args) {
    try {
      const result = await handler(event, ...args);
      return { success: true, data: result };
    } catch (error) {
      const formattedError = createError(error);
      logger.error('IPC处理错误', {
        event: event.event || 'unknown',
        error: formattedError,
        args
      });
      
      return { 
        success: false, 
        error: formattedError 
      };
    }
  };
}

module.exports = {
  ipcErrorMiddleware
};
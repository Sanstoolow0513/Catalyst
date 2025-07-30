const logger = require('./logger');

/**
 * 标准化错误对象
 * @param {Error|string} error 原始错误
 * @param {string} context 错误发生的上下文
 * @param {Object} metadata 附加的元数据
 * @returns {Object} 标准化的错误对象
 */
function createError(error, context, metadata = {}) {
  const normalizedError = {
    message: error instanceof Error ? error.message : String(error),
    context,
    timestamp: new Date().toISOString(),
    ...metadata
  };

  if (error instanceof Error) {
    normalizedError.stack = error.stack;
    normalizedError.name = error.name;
  }

  return normalizedError;
}

/**
 * 全局错误处理器
 * @param {Error} error 捕获的错误
 * @param {string} context 错误发生的上下文
 * @param {Object} metadata 附加的元数据
 */
function handleGlobalError(error, context, metadata = {}) {
  const normalizedError = createError(error, context, metadata);
  logger.error('未处理的异常', { context, ...metadata }, error);
  // 这里可以添加上报错误到远程服务的逻辑
}

/**
 * 异步操作错误处理器（用于包裹 async 函数）
 * @param {Function} asyncFn 异步函数
 * @param {string} context 错误上下文
 * @param {Object} metadata 附加元数据
 * @returns {Function} 包裹后的函数
 */
function withErrorHandling(asyncFn, context, metadata = {}) {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      handleGlobalError(error, context, { ...metadata, args });
      throw error; // 重新抛出错误，让调用者处理
    }
  };
}

module.exports = {
  createError,
  handleGlobalError,
  withErrorHandling
};
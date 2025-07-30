const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

// 确保日志目录存在
const logDir = path.join(__dirname, '../../data/logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 日志级别
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

// 当前日志级别
const CURRENT_LOG_LEVEL = LOG_LEVELS.INFO;

// 创建日志文件路径
const logFilePath = path.join(logDir, `app-${format(new Date(), 'yyyy-MM-dd')}.log`);

/**
 * 写入日志到文件
 * @param {string} level 日志级别
 * @param {string} message 日志消息
 * @param {Error} [error] 可选的错误对象
 */
function writeLogToFile(level, message, error = null) {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  let logEntry = `[${timestamp}] [${level}] ${message}`;
  if (error) {
    logEntry += `\nError: ${error.stack || error.message}`;
  }
  logEntry += '\n';

  fs.appendFileSync(logFilePath, logEntry, 'utf8');
}

/**
 * 格式化日志消息
 * @param {string} message 原始消息
 * @param {Object} context 可选的上下文信息
 * @returns {string} 格式化后的消息
 */
function formatMessage(message, context = null) {
  let formattedMessage = message;
  if (context) {
    formattedMessage += ` | Context: ${JSON.stringify(context)}`;
  }
  return formattedMessage;
}

/**
 * 核心日志函数
 * @param {string} level 日志级别
 * @param {string} message 日志消息
 * @param {Object} [context] 可选的上下文信息
 * @param {Error} [error] 可选的错误对象
 */
function log(level, message, context = null, error = null) {
  if (LOG_LEVELS[level] >= CURRENT_LOG_LEVEL) {
    const formattedMessage = formatMessage(message, context);
    // 控制台输出
    console[level.toLowerCase()](formattedMessage);
    if (error) console.error(error);
    // 文件写入
    writeLogToFile(level, formattedMessage, error);
  }
}

// 导出日志函数
module.exports = {
  debug: (message, context) => log('DEBUG', message, context),
  info: (message, context) => log('INFO', message, context),
  warn: (message, context) => log('WARN', message, context),
  error: (message, context, error) => log('ERROR', message, context, error)
};
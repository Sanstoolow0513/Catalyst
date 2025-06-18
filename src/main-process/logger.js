import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.join(__dirname, 'logs');

// 确保日志目录存在
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// 创建日志文件路径 (按日期)
const logFilePath = path.join(logDirectory, `${new Date().toISOString().split('T')[0]}.log`);

// 创建日志流
const logStream = fs.createWriteStream(logFilePath, { 
  flags: 'a',
  encoding: 'utf8'
});

/**
 * 日志记录函数
 * @param {string} level 日志级别 (info, error, debug)
 * @param {string} message 日志消息
 * @param {string} [source] 日志来源
 */
function log(level, message, source = '') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] [PID:${process.pid}] ${source ? `[${source}] ` : ''}${message}\n`;
  
  // 写入文件
  logStream.write(logEntry);
  
  // 同时输出到控制台
  if (level === 'error') {
    console.error(logEntry.trim());
  } else {
    console.log(logEntry.trim());
  }
}

export const logger = {
  info: (message, source) => log('info', message, source),
  error: (message, source) => log('error', message, source),
  debug: (message, source) => log('debug', message, source)
};
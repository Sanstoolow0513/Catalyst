const { safeStorage } = require('electron');
const logger = require('../utils/logger');

class LLMService {
  constructor() {
    this.apiKey = null;
  }

  async setApiKey(apiKey) {
    try {
      // 加密存储API密钥
      const encrypted = safeStorage.encryptString(apiKey);
      this.apiKey = encrypted.toString('hex');
      logger.info('API密钥已安全存储');
      return true;
    } catch (error) {
      logger.error('API密钥存储失败', error);
      return false;
    }
  }

  async sendMessage(message) {
    if (!this.apiKey) {
      throw new Error('API密钥未设置');
    }

    try {
      // 解密API密钥
      const decrypted = safeStorage.decryptString(Buffer.from(this.apiKey, 'hex'));
      
      // LLM服务已禁用
      throw new Error('LLM服务当前不可用');
    } catch (error) {
      logger.error('LLM服务调用失败', error);
      throw error;
    }
  }
}

module.exports = LLMService;
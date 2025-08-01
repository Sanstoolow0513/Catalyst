const { safeStorage } = require('electron');
const logger = require('../utils/logger');
const { createError } = require('../utils/error-handler');

class APIKeyManager {
  constructor() {
    this.keyStorageKey = 'llm-api-key';
  }

  /**
   * 保存加密的API密钥
   * @param {string} encryptedKey Base64编码的加密密钥
   * @returns {Promise<boolean>} 保存是否成功
   */
  async saveKey(encryptedKey) {
    try {
      if (!safeStorage.isEncryptionAvailable()) {
        throw new Error('系统安全存储不可用');
      }
      
      const buffer = Buffer.from(encryptedKey, 'base64');
      const decryptedKey = safeStorage.decryptString(buffer);
      
      // 实际应用中应使用安全存储，这里简化示例
      localStorage.setItem(this.keyStorageKey, decryptedKey);
      logger.info('API密钥保存成功');
      return true;
    } catch (error) {
      logger.error('保存API密钥失败', error);
      throw createError(error, 'APIKeyManager.saveKey');
    }
  }

  /**
   * 获取解密后的API密钥
   * @returns {Promise<string>} 解密后的API密钥
   */
  async getKey() {
    try {
      const key = localStorage.getItem(this.keyStorageKey);
      if (!key) {
        throw new Error('未找到API密钥');
      }
      return key;
    } catch (error) {
      logger.error('获取API密钥失败', error);
      throw createError(error, 'APIKeyManager.getKey');
    }
  }
}

module.exports = APIKeyManager;
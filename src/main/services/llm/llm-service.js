const { safeStorage } = require('electron');
const { Configuration, OpenAIApi } = require('openai');
const logger = require('../utils/logger');

class LLMService {
  constructor() {
    this.apiKey = null;
    this.openai = null;
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
      
      // 初始化OpenAI客户端
      const configuration = new Configuration({
        apiKey: decrypted,
      });
      this.openai = new OpenAIApi(configuration);

      // 发送请求
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      logger.error('OpenAI API调用失败', error);
      throw error;
    }
  }
}

module.exports = LLMService;